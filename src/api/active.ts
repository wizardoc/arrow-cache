export interface ActiveAPI {
  activeKeys(): Promise<string[]>;
  activeClear(): Promise<boolean>;
}
