export type RedditListing = {
  data: {
    children: Array<{
      data: RedditPostData;
    }>;
  };
};

export type RedditPostData = {
  id: string;
  title: string;
  permalink: string;
  url: string;
  author: string;
  created_utc: number;
  subreddit: string;
  score: number;
  num_comments: number;
  thumbnail?: string;
  selftext?: string;
};

export type CachedPosts = {
  key: string;
  savedAt: number;
  posts: RedditPost[];
};

export class RedditPost {
  id = '';
  title = '';
  permalink = '';
  url = '';
  author = '';
  createdUtc = 0;
  subreddit = '';
  score = 0;
  numComments = 0;
  thumbnail?: string;

  constructor(init?: Partial<RedditPost>) {
    Object.assign(this, init);
  }
}

export const REDDIT_POST_MODEL = new RedditPost();
