export interface StorageAPI {
  setItem(key: string, content: string): boolean;
  removeItem(key: string): string;
}

export interface BaseAPI {
  markAsActive(key: string): boolean;
  markAsStatic(key: string): boolean;
  moveToNextStream(key: string): boolean;
  updateContent(key: string, content: string): boolean;
  clear(): boolean;
}
