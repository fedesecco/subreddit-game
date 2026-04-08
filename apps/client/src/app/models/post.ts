export class RedditPost {
  id = '';
  title = '';
  permalink = '';
  url = '';
  author = '';
  createdUtc = 0;
  subreddit = '';
  category = '';
  score = 0;
  numComments = 0;
  thumbnail?: string;

  constructor(init?: Partial<RedditPost>) {
    Object.assign(this, init);
  }
}
