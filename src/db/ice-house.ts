export interface IIceHouse {
  add(key: string, content: string): Promise<void>;
  update(key: string, content: string): Promise<void>;
  remove(key: string): Promise<void>;
  find(key: string): Promise<string>;
}

export interface ColdDataItem {
  key: string;
  content: string;
}

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

  async remove(key: string): Promise<void> {
    const coldData = await this.getObjectStore();

    return this.getResult(coldData.delete(key));
  }

  async update(key: string, content: string): Promise<void> {
    const coldData = await this.getObjectStore();

    return this.getResult(coldData.put({ content, key }));
  }

  async find(key: string): Promise<string> {
    const coldData = await this.getObjectStore();
    const result: ColdDataItem = await this.getResult(coldData.get(key));

    return result.content;
  }
}
