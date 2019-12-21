interface ICache {
  addItem(key: string, data: string): boolean;
  removeItem(key: string): boolean;
  updateItem(key: string, data: string): boolean;
  findItem(key: string): string;
}

interface CacheItem {
  key: string;
  content: string;
  // write the item on disk when lifeCount = 0
  lifeCount: number;
  // mark whether cacheItem is active. When isActivated is True, the cacheItem is exist in memory,
  // otherwise on disk
  isActivated: boolean;
}

export class Cache implements ICache {
  addItem(key: string, data: string): boolean {
    throw new Error("Method not implemented.");
  }
  removeItem(key: string): boolean {
    throw new Error("Method not implemented.");
  }
  updateItem(key: string, data: string): boolean {
    throw new Error("Method not implemented.");
  }
  findItem(key: string): string | undefined {
    throw new Error("Method not implemented.");
  }

  public store = {};

  constructor() {}
}
