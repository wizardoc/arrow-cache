import StoreWorker from "./workers/store.worker.ts";

console.info(StoreWorker);

const store = new StoreWorker();

// store.onmessage()
