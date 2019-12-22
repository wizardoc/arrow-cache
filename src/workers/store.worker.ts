import { Cache } from "../cache/cache";
import { Channel, Res } from "../channel";
import { CacheData } from "../dtos";

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
  console.info(data);
  cache.addItem(data.key, data.content);

  res(1);
});
