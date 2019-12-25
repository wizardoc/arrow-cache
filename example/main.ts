import { ArrowCache } from "..";

const cache = new ArrowCache({ isPermanentMemory: true });

(async () => {
  // await cache.setItem("count", "1");
  await cache.InitSuccess();
  setTimeout(async () => {
    console.info(await cache.snapshot());
  }, 1000);
})();

// setInterval(async () => {
//   await cache.InitSuccess();
//   console.info(await cache.snapshot());
//   const result = await cache.getItem("count");

//   console.info(result);

//   if (!result) {
//     await cache.setItem("count", "0");
//   }

//   const view = +result || 0;

//   await cache.setItem("count", view + 1 + "");

//   document.querySelector("#counter").innerHTML = await cache.getItem("count");
// }, 500);
