import StoreWorker from "./workers/store.worker.ts";

interface Messagable {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  postMessage(message: any, transfer: Transferable[]): void;
  postMessage(message: any, options?: PostMessageOptions): void;
}

interface MessagePayload{
  event: string;
}

export class Store {
  constructor(private container: Messagable){
  }

  postMessage(message: any, args?: Transferable[] | PostMessageOptions): void {
    this.container.postMessage(message, args as unknown)
  }

  onmessage<T extends MessagePayload>(cb : (data: T) => void): void {
    this.container.onmessage =  => {

    }
  }

  private messageHandler(){
    (this: Worker, ev: MessageEvent)
  }
}