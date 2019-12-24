export interface IIceHouse {
  add(key: string, content: string): Promise<void>;
  update(key: string, content: string): Promise<void>;
  remove(key: string): Promise<boolean>;
  find(key: string): Promise<string>;
  batchAdd(items: ColdDataItem[]): Promise<unknown>;
}

export interface ColdDataItem {
  key: string;
  content: string;
}

export interface ObjectifyColdData {
  [key: string]: string;
}

export type ParsedAllColdData<T> = T extends true
  ? ObjectifyColdData
  : ColdDataItem[];

export class IceHouse implements IIceHouse {
  private initPromise: Promise<IDBDatabase>;

  private readonly DATABASE_NAME = "ice_house";
  private readonly TABLE_NAME = "cold_data";

  constructor() {
    const request = indexedDB.open(this.DATABASE_NAME);

    request.onerror = err => console.error(err);
    // recreate table when db is upgrade
    request.onupgradeneeded = e =>
      this.handleIceHouseInit((e.target as any).result);

    this.initPromise = new Promise(resolve => {
      request.onsuccess = e => {
        resolve((e.target as any).result);
      };
    });
  }

  private handleIceHouseInit(db: IDBDatabase) {
    const coldData = db.createObjectStore(this.TABLE_NAME, { keyPath: "key" });

    coldData.createIndex("key", "key", { unique: true });

    return coldData;
  }

  // return a objectStore when db connect success
  private async getObjectStore(): Promise<IDBObjectStore> {
    const db = await this.initPromise;

    return db.transaction(["cold_data"], "readwrite").objectStore("cold_data");
  }

  // wrap db operate fn
  private getResult<T>(request: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = e => {
        resolve((e.target as any).result);
      };

      request.onerror = err => {
        reject(err);
      };
    });
  }

  // set a data in db
  async add(key: string, content: string): Promise<void> {
    const coldData = await this.getObjectStore();

    // invoke update method when throw doublekey
    try {
      await this.getResult(coldData.add({ key, content }));
    } catch (e) {
      this.update(key, content);
    }
  }

  async remove(key: string): Promise<boolean> {
    if (!(await this.keys()).includes(key)) {
      return false;
    }

    const coldData = await this.getObjectStore();

    return this.getResult(coldData.delete(key));
  }

  async update(key: string, content: string): Promise<void> {
    const coldData = await this.getObjectStore();

    return this.getResult(coldData.put({ content, key }));
  }

  async find(key: string): Promise<string | undefined> {
    const coldData = await this.getObjectStore();
    const result: ColdDataItem = await this.getResult(coldData.get(key));

    if (!result) {
      return undefined;
    }

    return result.content;
  }

  async batchAdd(items: ColdDataItem[]): Promise<unknown> {
    const coldData = await this.getObjectStore();

    return Promise.all(items.map(item => this.getResult(coldData.put(item))));
  }

  async keys(): Promise<string[]> {
    const coldData = await this.getObjectStore();

    return this.getResult(coldData.getAllKeys());
  }

  async findOnce(key: string): Promise<string | undefined> {
    let result: string | undefined;

    if ((await this.keys()).includes(key)) {
      result = await this.find(key);
      this.remove(key);
    }

    return result;
  }

  async clear(): Promise<void> {
    const coldData = await this.getObjectStore();

    return this.getResult(coldData.clear());
  }

  async findAll(isObjectify?: true): Promise<ObjectifyColdData>;
  async findAll(isObjectify?: false): Promise<ColdDataItem[]>;
  async findAll(
    isObjectify?: boolean
  ): Promise<ColdDataItem[] | ObjectifyColdData> {
    const coldData = await this.getObjectStore();
    const result = await this.getResult<ColdDataItem[]>(coldData.getAll());

    return isObjectify || true
      ? result.reduce(
          (total, cur) => (total[cur.key] = cur.content) && total,
          {}
        )
      : result;
  }
}
