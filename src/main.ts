import StoreWorker from "./workers/store.worker.ts";
import { BaseAPI, StaticAPI, ActiveAPI, StorageAPI } from "./api";
import { Channel } from "./channel";
import { Message } from "./dtos";

const DEFAULT_CLEAR_DURATION = 2000;

export class ArrowCache implements BaseAPI, StaticAPI, ActiveAPI, StorageAPI {
  private _clearDuration: number;
  private store: StoreWorker;
  private channel: Channel;

  constructor(clearDuration?: number) {
    this._clearDuration = clearDuration || DEFAULT_CLEAR_DURATION;
    this.store = new StoreWorker();
    this.channel = new Channel(this.store);

    this.init();
  }

  async init() {
    const data = await this.sendMsg({
      type: "saveData",
      data: "hello"
    });

    console.info(data);
  }

  private sendMsg<T>(msg: Message<T>) {
    return this.channel.send(msg);
  }

  activeKeys(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  activeClear(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  staticKeys(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  staticClear(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  setItem(key: string, content: string): Promise<boolean> {
    return this.channel.send<boolean>({
      type: "saveData",
      data: { key, content }
    });
  }
  removeItem(key: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  markAsActive(key: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  markAsStatic(key: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  moveToNextStream(key: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateContent(key: string, content: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  keys(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  clear(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

const _ = new ArrowCache();
