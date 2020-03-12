import { Message } from "./dtos";

export type Res = (resData: unknown) => void;

type ListenHandler = (data: any | undefined, res: Res) => void;

export type Self = WorkerGlobalScope & typeof globalThis;

interface Listener {
  eventType: string;
  handler: ListenHandler;
}

export class ServerChannel {
  private listeners: Listener[] = [];

  constructor(private self: Self) {
    this.self.addEventListener("message", (e: MessageEvent) =>
      this.onWebWorkerMessage(e.data)
    );
  }

  listen(eventType: string, handler: ListenHandler) {
    if (!this.self) {
      throw new Error("The self is required!");
    }

    this.listeners.push({
      eventType,
      handler
    });
  }

  private onWebWorkerMessage(msg: Message<unknown>) {
    const listener: Listener | undefined = this.listeners.find(
      ({ eventType }: Listener) => eventType === msg.type
    );

    if (listener) {
      listener.handler(msg.data, (resData: unknown) => {
        if (!this.self) {
          throw new Error(
            "Self cannot be a undefined, please call createServerChannel to resolve it."
          );
        }

        this.self.postMessage({ type: msg.type, data: resData });
      });
    }
  }
}
