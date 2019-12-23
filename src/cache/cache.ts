import { objectMap, objectFilter, omit } from "../utils";
import { IceHouse, ColdDataItem } from "../db";

interface ICache {
  addItem(key: string, data: string): boolean;
  removeItem(key: string): boolean;
  updateItem(key: string, data: string): boolean;
  findItem(key: string): string;
}

/**
 * key-value store for cache some data
 */
interface CacheItem {
  content: string;
  // write the item on disk when lifeCount = 0
  lifeCount: number;
  // mark whether cacheItem is active. When isActivated is True, the cacheItem is exist in memory,
  // otherwise on disk
  isActivated: boolean;
  // mark the item can be cleared
  imminentDead?: boolean;
}

interface Store {
  [key: string]: CacheItem;
}

type Timeout = number;

const INIT_LIFECOUNT = 2;

export class Cache implements ICache {
  private store: Store = {};
  private currentTimerId: Timeout | undefined;
  private clearDuration: number;
  private iceHouse: IceHouse;

  constructor(clearDuration: number) {
    this.iceHouse = new IceHouse();
    this.clearDuration = clearDuration;
    // create a timer for monitor lifeCount and clear the cache block that's dead
    this.initMonitor();
  }

  // write in disk
  private killCache(items: ColdDataItem): void;
  private killCache(items: ColdDataItem[]): void;
  private killCache(items: ColdDataItem[] | ColdDataItem): void {
    if ((items as ColdDataItem[]).length) {
      this.iceHouse.batchAdd(items as ColdDataItem[]);
    } else {
      const item = items as ColdDataItem;

      this.iceHouse.add(item.key, item.content);
    }
  }

  private cacheMonitor() {
    const imminentDeadItems: ColdDataItem[] = [];

    // check lifeCount and mark imminentDead
    this.store = objectMap(this.store, (val: CacheItem) => ({
      ...val,
      lifeCount: val.lifeCount - 1,
      imminentDead: val.lifeCount - 1 === 0
    }));

    for (const key of Object.keys(this.store)) {
      const item = this.store[key];

      if (this.store[key].imminentDead) {
        imminentDeadItems.push({
          key,
          content: item.content
        });
      }
    }

    // clear the item in memory if it's lifeCount = 0
    this.store = objectFilter(
      this.store,
      (val: CacheItem) => !val.imminentDead
    );

    // stop timer when there's nothing in store
    if (!Object.keys(this.store).length) {
      clearInterval(this.currentTimerId);

      this.currentTimerId = undefined;
    }

    // processing imminentDeadItems
    if (imminentDeadItems.length) {
      this.killCache(imminentDeadItems);
    }
  }

  private initMonitor() {
    this.currentTimerId = (setInterval(
      () => this.cacheMonitor(),
      this.clearDuration
    ) as unknown) as Timeout;
  }

  addItem(key: string, data: string): boolean {
    this.store[key] = {
      content: data,
      lifeCount: INIT_LIFECOUNT,
      isActivated: true
    };

    // addItem will add item to the store
    // create a timer when current timer is destroy
    if (!this.currentTimerId) {
      this.initMonitor();
    }

    return true;
  }

  removeItem(key: string): boolean {
    if (!this.store[key]) {
      return false;
    }

    this.killCache({ key, content: this.store[key].content });
    this.store = omit(this.store, key);

    return true;
  }

  updateItem(key: string, data: string): boolean {
    if (!this.store[key]) {
      return false;
    }

    this.store[key].content = data;
  }

  findItem(key: string): string | undefined {
    const item = this.store[key];

    if (!item) {
      return;
    }

    return this.store[key].content;
  }

  coldDataKeys(): Promise<string[]> {
    return this.iceHouse.keys();
  }

  get keys(): string[] {
    return Object.keys(this.store);
  }

  get snapshot(): Store {
    return this.store;
  }
}
