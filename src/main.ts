import StoreWorker from "./workers/store.worker.ts";
import { BaseAPI, StaticAPI, ActiveAPI, StorageAPI } from "./api";

const DEFAULT_CLEAR_DURATION = 2000;

export class ArrowCache implements BaseAPI, StaticAPI, ActiveAPI, StorageAPI {
  private _clearDuration: number;
  private cache: 

  constructor(clearDuration?: number) {
    this._clearDuration = clearDuration || DEFAULT_CLEAR_DURATION;

    new StoreWorker().postMessage;
  }

  activeKeys(): string[] {
    throw new Error("Method not implemented.");
  }
  activeClear(): boolean {
    throw new Error("Method not implemented.");
  }
  staticKeys(): string[] {
    throw new Error("Method not implemented.");
  }
  staticClear(): boolean {
    throw new Error("Method not implemented.");
  }
  setItem(key: string, content: string): boolean {
    throw new Error("Method not implemented.");
  }
  removeItem(key: string): string {
    throw new Error("Method not implemented.");
  }
  markAsActive(key: string): boolean {
    throw new Error("Method not implemented.");
  }
  markAsStatic(key: string): boolean {
    throw new Error("Method not implemented.");
  }
  moveToNextStream(key: string): boolean {
    throw new Error("Method not implemented.");
  }
  updateContent(key: string, content: string): boolean {
    throw new Error("Method not implemented.");
  }
  keys(): string[] {
    throw new Error("Method not implemented.");
  }
  clear(): boolean {
    throw new Error("Method not implemented.");
  }
}
