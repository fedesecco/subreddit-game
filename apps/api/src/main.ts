import express from 'express';

type RedditPost = {
  id: string;
  title: string;
  permalink: string;
  url: string;
  author: string;
  createdUtc: number;
  subreddit: string;
  category: string;
  score: number;
  numComments: number;
  thumbnail?: string;
};

type SubredditFeed = {
  name: string;
  category: string;
};

type CachedPosts = {
  posts: RedditPost[];
  savedAt: number;
};

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const CACHE_TTL_MS = Number(process.env.REDDIT_CACHE_TTL_MS ?? 1000 * 60 * 15);
const FEED_POST_LIMIT = Number(process.env.REDDIT_FEED_LIMIT ?? 12);
const MAX_POSTS = Number(process.env.REDDIT_MAX_POSTS ?? 100);
const USER_AGENT =
  process.env.REDDIT_USER_AGENT ??
  'subrgame-api/1.0 (+http://localhost:3000)';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const SUBREDDIT_FEEDS: SubredditFeed[] = [
  { name: 'AskReddit', category: 'discussion' },
  { name: 'funny', category: 'funny' },
  { name: 'gaming', category: 'gaming' },
  { name: 'pics', category: 'photography' },
  { name: 'todayilearned', category: 'learning' },
  { name: 'worldnews', category: 'politics-news' },
  { name: 'aww', category: 'animals' },
  { name: 'movies', category: 'movies' },
  { name: 'music', category: 'music' },
  { name: 'science', category: 'science' },
  { name: 'technology', category: 'technology' },
  { name: 'sports', category: 'sports' },
  { name: 'television', category: 'television' },
  { name: 'FoodPorn', category: 'food' },
  { name: 'Art', category: 'art' },
  { name: 'DIY', category: 'diy' },
  { name: 'EarthPorn', category: 'nature' },
  { name: 'HistoryMemes', category: 'history' },
  { name: 'space', category: 'space' },
  { name: 'gadgets', category: 'gadgets' },
];

const app = express();

let cache: CachedPosts | null = null;
let inFlightRequest: Promise<CachedPosts> | null = null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.send({
    status: 'ok',
    cachedPosts: cache?.posts.length ?? 0,
    cacheAgeMs: cache ? Date.now() - cache.savedAt : null,
  });
});

app.get('/api/posts', async (_req, res) => {
  try {
    const result = await getCachedPosts();
    res.send({
      savedAt: result.savedAt,
      count: result.posts.length,
      posts: result.posts,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load posts';
    res.status(502).send({ message });
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

async function getCachedPosts(): Promise<CachedPosts> {
  if (cache && cache.posts.length > 0 && Date.now() - cache.savedAt < CACHE_TTL_MS) {
    return cache;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetchAndCachePosts();

  try {
    return await inFlightRequest;
  } finally {
    inFlightRequest = null;
  }
}

async function fetchAndCachePosts(): Promise<CachedPosts> {
  const results = await Promise.allSettled(
    SUBREDDIT_FEEDS.map((feed) => fetchFeed(feed))
  );

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );

  if (failures.length > 0) {
    console.error(
      'Reddit RSS feed failures:',
      failures.map((failure) => failure.reason)
    );
  }

  const posts = results
    .filter(
      (result): result is PromiseFulfilledResult<RedditPost[]> =>
        result.status === 'fulfilled'
    )
    .flatMap((result) => result.value);

  const deduped = dedupePosts(posts).filter((post) => hasImage(post));
  const selectedPosts = pickRandom(deduped, MAX_POSTS);

  if (selectedPosts.length === 0) {
    throw new Error('No Reddit RSS posts with images were loaded.');
  }

  cache = {
    posts: selectedPosts,
    savedAt: Date.now(),
  };

  return cache;
}

async function fetchFeed(feed: SubredditFeed): Promise<RedditPost[]> {
  const url = new URL(`https://www.reddit.com/r/${feed.name}/hot/.rss`);
  url.searchParams.set('limit', String(FEED_POST_LIMIT));

  const response = await fetch(url, {
    headers: {
      Accept: 'application/atom+xml,application/rss+xml,text/xml',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`r/${feed.name} RSS request failed: ${response.status}`);
  }

  const xml = await response.text();
  return parseFeed(xml, feed);
}

function parseFeed(xml: string, feed: SubredditFeed): RedditPost[] {
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/g) ?? [];

  return entries
    .map((entry) => toPost(entry, feed))
    .filter((post): post is RedditPost => post !== null);
}

function toPost(entry: string, feed: SubredditFeed): RedditPost | null {
  const title = decodeXmlEntities(extractTag(entry, 'title') ?? '');
  const id = decodeXmlEntities(extractTag(entry, 'id') ?? '');
  const permalink = decodeXmlEntities(extractLinkHref(entry) ?? '');
  const author = decodeXmlEntities(extractTag(entry, 'name') ?? '');
  const publishedAt =
    extractTag(entry, 'published') ?? extractTag(entry, 'updated') ?? '';
  const content = decodeXmlEntities(extractTag(entry, 'content') ?? '');

  if (!title || !id || !permalink) {
    return null;
  }

  const imageUrl = extractImageUrl(content);
  const externalUrl = extractExternalUrl(content) ?? permalink;

  return {
    id,
    title,
    permalink,
    url: externalUrl,
    author,
    createdUtc: toUnixTimestamp(publishedAt),
    subreddit: feed.name,
    category: feed.category,
    score: extractMetric(content, 'score'),
    numComments: extractMetric(content, 'comments'),
    thumbnail: imageUrl ?? undefined,
  };
}

function extractTag(source: string, tagName: string): string | null {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapedTag}>`,
    'i'
  );

  return pattern.exec(source)?.[1]?.trim() ?? null;
}

function extractLinkHref(source: string): string | null {
  const match = /<link\b[^>]*href="([^"]+)"/i.exec(source);
  return match?.[1] ?? null;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function extractImageUrl(content: string): string | null {
  const imageMatch = /<img\b[^>]*src="([^"]+)"/i.exec(content);
  if (imageMatch?.[1]) {
    return imageMatch[1];
  }

  const links = Array.from(content.matchAll(/<a\b[^>]*href="([^"]+)"/gi));
  const imageLink = links.find((match) =>
    IMAGE_EXTENSIONS.some((extension) =>
      match[1].toLowerCase().includes(extension)
    )
  );

  return imageLink?.[1] ?? null;
}

function extractExternalUrl(content: string): string | null {
  const links = Array.from(content.matchAll(/<a\b[^>]*href="([^"]+)"/gi));
  const externalLink = links.find((match) => !match[1].includes('/r/'));
  return externalLink?.[1] ?? null;
}

function extractMetric(content: string, metric: 'score' | 'comments'): number {
  const pattern =
    metric === 'score'
      ? /(\d+(?:,\d+)*)\s+points?/i
      : /(\d+(?:,\d+)*)\s+comments?/i;
  const match = pattern.exec(content)?.[1];

  if (!match) {
    return 0;
  }

  return Number.parseInt(match.replace(/,/g, ''), 10);
}

function toUnixTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : Math.floor(timestamp / 1000);
}

function dedupePosts(posts: RedditPost[]): RedditPost[] {
  const unique = new Map<string, RedditPost>();

  for (const post of posts) {
    unique.set(post.id, post);
  }

  return Array.from(unique.values());
}

function hasImage(post: RedditPost): boolean {
  return typeof post.thumbnail === 'string' && post.thumbnail.length > 0;
}

function pickRandom(posts: RedditPost[], count: number): RedditPost[] {
  const shuffled = [...posts];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
}
