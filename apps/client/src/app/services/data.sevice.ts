import { Injectable, resource } from '@angular/core';
import { CACHE_DB, CACHE_KEY, CACHE_STORE } from '@common/constants';
import {
  CachedPosts,
  RedditListing,
  RedditPost,
  RedditPostData,
} from '@models/post';

const CACHE_TTL_MS = 1000 * 60 * 15;
const QUERY_URL = 'https://github.com/reddit/node-api-client';
const REDDIT_SEARCH_URL = 'https://www.reddit.com/search.json';

@Injectable({ providedIn: 'root' })
export class DataServce {
  public readonly posts = resource({
    defaultValue: [],
    loader: async ({ abortSignal }) => {
      const cached = await this.readCache();
      if (cached && this.isCacheFresh(cached.savedAt)) {
        return cached.posts;
      }

      const posts = await this.fetchPosts(abortSignal);
      await this.writeCache(posts);
      return posts;
    },
  });

  private async fetchPosts(abortSignal: AbortSignal): Promise<RedditPost[]> {
    const url = new URL(REDDIT_SEARCH_URL);
    url.searchParams.set('q', QUERY_URL);
    url.searchParams.set('limit', '100');
    url.searchParams.set('sort', 'new');
    url.searchParams.set('include_over_18', '1');
    url.searchParams.set('raw_json', '1');

    const response = await fetch(url.toString(), { signal: abortSignal });
    if (!response.ok) {
      throw new Error(`Reddit request failed: ${response.status}`);
    }

    const payload = (await response.json()) as RedditListing;
    const posts = payload.data.children
      .map(({ data }) => data)
      .filter((data) => this.containsQuery(data))
      .map((data) => this.toPost(data));
    return this.pickRandom(posts, 100);
  }

  private containsQuery(data: RedditPostData): boolean {
    const needle = QUERY_URL.toLowerCase();
    return (
      data.url.toLowerCase().includes(needle) ||
      data.title.toLowerCase().includes(needle) ||
      (data.selftext ?? '').toLowerCase().includes(needle)
    );
  }

  private toPost(data: RedditPostData): RedditPost {
    return {
      id: data.id,
      title: data.title,
      permalink: `https://www.reddit.com${data.permalink}`,
      url: data.url,
      author: data.author,
      createdUtc: data.created_utc,
      subreddit: data.subreddit,
      score: data.score,
      numComments: data.num_comments,
      thumbnail: data.thumbnail,
    };
  }

  private pickRandom(posts: RedditPost[], count: number): RedditPost[] {
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

  private isCacheFresh(savedAt: number): boolean {
    return Date.now() - savedAt < CACHE_TTL_MS;
  }

  private async readCache(): Promise<CachedPosts | null> {
    if (!this.canUseCache()) {
      return null;
    }

    try {
      const db = await this.openCacheDb();
      const tx = db.transaction(CACHE_STORE, 'readonly');
      const store = tx.objectStore(CACHE_STORE);
      const result = await this.requestToPromise(store.get(CACHE_KEY));
      await this.transactionDone(tx);
      db.close();
      return (result as CachedPosts | undefined) ?? null;
    } catch {
      return null;
    }
  }

  private async writeCache(posts: RedditPost[]): Promise<void> {
    if (!this.canUseCache()) {
      return;
    }

    try {
      const db = await this.openCacheDb();
      const tx = db.transaction(CACHE_STORE, 'readwrite');
      const store = tx.objectStore(CACHE_STORE);
      store.put({
        key: CACHE_KEY,
        savedAt: Date.now(),
        posts,
      });
      await this.transactionDone(tx);
      db.close();
    } catch {
      // Cache failures shouldn't block the fetch.
    }
  }

  private canUseCache(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  private openCacheDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_DB, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CACHE_STORE)) {
          db.createObjectStore(CACHE_STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private transactionDone(transaction: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    });
  }
}
