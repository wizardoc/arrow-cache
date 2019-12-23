import { Cache } from "../cache/cache";
import { Channel, Res } from "../channel";
import { CacheData, KeysTypeData, KeysType } from "../dtos";

// self.addEventListener("message", ({ data }) => {
//   self.postMessage({ data: "world", type: data.type });
// });

let cache: Cache;
const channel = new Channel(undefined, self);

channel.listen("init", (data: number, res: Res) => {
  cache = new Cache(data);

  res(1);
});

channel.listen("saveData", (data: CacheData, res: Res) => {
  cache.addItem(data.key, data.content);

  res(1);
});

channel.listen("keys", async ({ type }: KeysTypeData, res: Res) => {
  const KEYS_MAP = {
    [KeysType.STATIC]: await cache.coldDataKeys(),
    [KeysType.ACTIVE]: cache.keys
  };

  res(KEYS_MAP[type]);
});
