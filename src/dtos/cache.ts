export interface CacheKey {
  key: string;
}

export interface CacheData extends CacheKey {
  content: string;
}
