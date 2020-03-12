export interface StaticAPI {
  staticKeys(): Promise<string[]>;
  staticClear(): Promise<boolean>;
}
