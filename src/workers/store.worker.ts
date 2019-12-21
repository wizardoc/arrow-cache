import { Cache } from "../cache/cache";
import { Channel, Res } from "../channel";
import { CacheData } from "../dtos";

// self.addEventListener("message", ({ data }) => {
//   self.postMessage({ data: "world", type: data.type });
// });

const cache = new Cache();
const channel = new Channel(undefined, self);

channel.listen("saveData", (data: CacheData, res: Res) =>
  res(cache.findItem(data.key) || cache.addItem(data.key, data.content))
);
