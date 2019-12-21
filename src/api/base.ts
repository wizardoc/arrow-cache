export interface StorageAPI {
  setItem(key: string, content: string): Promise<boolean>;
  removeItem(key: string): Promise<string>;
}

export interface BaseAPI {
  markAsActive(key: string): Promise<boolean>;
  markAsStatic(key: string): Promise<boolean>;
  moveToNextStream(key: string): Promise<boolean>;
  updateContent(key: string, content: string): Promise<boolean>;
  clear(): Promise<boolean>;
}
