import { effect, Injectable, resource } from '@angular/core';
import { RedditPost } from '@models/post';

type PostsResponse = {
  count: number;
  posts: RedditPost[];
  savedAt: number;
};

const API_PATH = '/api/posts';
const DEV_API_ORIGIN = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class DataServce {
  public readonly posts = resource({
    defaultValue: [],
    loader: async ({ abortSignal }) => {
      const response = await fetch(this.getApiUrl(), {
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const payload = (await response.json()) as PostsResponse;
      return payload.posts;
    },
  });

  constructor() {
    effect(() => {
      if (this.posts.hasValue()) {
        console.log('posts changed: ', this.posts.value());
      } else if (this.posts.error()) {
        console.log('posts error: ', this.posts.error());
      }
    });
  }

  private getApiUrl(): string {
    if (typeof window === 'undefined') {
      return `${DEV_API_ORIGIN}${API_PATH}`;
    }

    if (
      window.location.hostname === 'localhost' &&
      window.location.port === '4200'
    ) {
      return `${DEV_API_ORIGIN}${API_PATH}`;
    }

    return API_PATH;
  }
}
