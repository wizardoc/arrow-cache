import { ArrowCache } from "../../packages/arrow-cache";

console.info(ArrowCache);

const cache = new ArrowCache({ isPermanentMemory: true });

setInterval(async () => {
  const result: number = await cache.getItem("count", 0);
  await cache.setItem("count", result + 1);

  document.querySelector("#counter").innerHTML = result + 1 + "";
}, 500);
