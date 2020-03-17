import { Cache } from "./cache";
import { CacheData, KeysTypeData, KeysType, CacheKey } from "../shared";
import { ParsedCacheOptions } from "../client/main";
import { ServerChannel, Res } from "@arrow-cache/channel";

let cache: Cache;
const channel = new ServerChannel(self);

channel.listen("init", (cacheOptions: ParsedCacheOptions, res: Res) => {
  cache = new Cache(cacheOptions);

  res(1);
});

channel.listen("permanentMemory", (_, res: Res) => {
  cache.stashStore();
  res(1);
});

channel.listen("readAllInMemory", async (_, res: Res) => {
  await cache.readAllInMemory();
  res(1);
});

channel.listen("saveData", async ({ key, content }: CacheData, res: Res) => {
  const { iceHouse } = cache;

  // read content of key into memory from icehouse if the key is already exist in icehouse
  if ((await cache.coldDataKeys()).includes(key)) {
    await iceHouse.remove(key);
  }

  cache.addItem(key, content);

  res(1);
});

channel.listen("keys", async ({ type }: KeysTypeData, res: Res) => {
  const staticKeys = await cache.coldDataKeys();
  const activeKeys = cache.keys;

  const KEYS_MAP = {
    [KeysType.STATIC]: staticKeys,
    [KeysType.ACTIVE]: activeKeys,
    [KeysType.ALL]: Array.from(new Set([...staticKeys, ...activeKeys]))
  };

  res(KEYS_MAP[type]);
});

channel.listen("moveToNextStream", async ({ key }: CacheKey, res: Res) => {
  if (!cache.findItem(key)) {
    const block = await cache.iceHouse.findOnce(key);

    if (!block) {
      throw new Error(`Cannot find cache item by ${key}`);
    }

    cache.addItem(key, block);

    return res(false);
  }

  cache.extendingCacheLife(key);

  res(true);
});

channel.listen(
  "updateContent",
  async ({ key, content }: CacheData, res: Res) => {
    const { iceHouse } = cache;

    if (!(await iceHouse.find(key))) {
      return res(false);
    }

    iceHouse.update(key, content);
    res(true);
  }
);

channel.listen("removeItem", ({ key }: CacheKey, res: Res) =>
  res(cache.iceHouse.remove(key) || cache.removeItem(key))
);

channel.listen("clear", ({ type }: KeysTypeData, res: Res) => {
  const ClEAR_HANDLER_DISPATCHER = {
    [KeysType.ACTIVE]: () => cache.clear(),
    [KeysType.STATIC]: () => cache.iceHouse.clear(),
    [KeysType.ALL]: () => {
      cache.clear();
      cache.iceHouse.clear();
    }
  };

  res(ClEAR_HANDLER_DISPATCHER[type]());
});

channel.listen(
  "mark",
  async ({ type, key }: KeysTypeData & CacheKey, res: Res) => {
    type MarkHandlerDispatcher = {
      [type in KeysType]: () => Promise<boolean> | boolean;
    };

    const MARK_HANDLER_DISPATCHER: Partial<MarkHandlerDispatcher> = {
      [KeysType.STATIC]: () => {
        const content = cache.findOnce(key);

        if (!content) {
          return false;
        }

        cache.iceHouse.add(key, content);
        return true;
      },
      [KeysType.ACTIVE]: async () => {
        const content = await cache.iceHouse.findOnce(key);

        if (!content) {
          return false;
        }

        cache.addItem(key, content);

        return true;
      }
    };

    res(await MARK_HANDLER_DISPATCHER[type]!());
  }
);

channel.listen("snapshot", async (_, res: Res) => res(await cache.snapshot()));

channel.listen("getItem", async ({ key, content }: CacheData, res: Res) => {
  const memoryItem = cache.findItem(key);

  if (memoryItem) {
    return res(memoryItem);
  }

  const diskItem = await cache.iceHouse.find(key);

  if (!diskItem) {
    // write the default value into memory
    if (content !== undefined) {
      cache.addItem(key, content);

      return res(content);
    }

    return res(undefined);
  }

  cache.iceHouse.remove(key);
  cache.addItem(key, diskItem);

  res(diskItem);
});
