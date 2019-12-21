export interface CommonAPI {
  innerLength(): Promise<number>;
  innerKeys(): Promise<string[]>;
}
