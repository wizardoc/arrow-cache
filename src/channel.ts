import { Message } from "./dtos";

export type Res = (resData: unknown) => void;
type ListenHandler = (data: unknown | undefined, res: Res) => void;

interface Listener {
  eventType: string;
  handler: ListenHandler;
}

export interface PendingMessage {
  type: string;
  resolver: (value: unknown) => void;
}

export interface ClientChannel {
  send<T = unknown>(payload: Message<T>): Promise<T>;
}

export interface ServerChannel {
  listen(eventType: string, handler: ListenHandler): void;
}

export class Channel implements ClientChannel, ServerChannel {
  private store: Worker;
  private msgQueue: PendingMessage[] = [];
  private self: (WorkerGlobalScope & typeof globalThis) | undefined;
  private listeners: Listener[] = [];

  constructor(store: Worker, self?: WorkerGlobalScope & typeof globalThis) {
    this.store = store;
    this.self = self;

    if (this.store) {
      this.store.onmessage = this.onMessage as any;
    }

    if (this.self) {
      this.self.addEventListener("message", (e: MessageEvent) =>
        this.onWebWorkerMessage(e.data)
      );
    }
  }

  private unlock(targetType: string, data: unknown) {
    const pos = this.msgQueue.findIndex(
      ({ type }: PendingMessage) => type === targetType
    );

    this.msgQueue[pos].resolver(data);
    this.msgQueue.splice(pos, 1);
  }

  private onMessage = (e: MessageEvent) => {
    const { type, data } = e.data as Message<unknown>;

    this.unlock(type, data);
  };

  private onWebWorkerMessage(msg: Message<unknown>) {
    const listener: Listener | undefined = this.listeners.find(
      ({ eventType }: Listener) => eventType === msg.type
    );

    if (listener) {
      listener.handler(msg.data, (resData: unknown) => {
        this.self.postMessage({ type: msg.type, data: resData });
      });
    }
  }

  send<R, T = unknown>(payload: Message<T>): Promise<R> {
    return new Promise(resolve => {
      this.store.postMessage(payload);
      this.msgQueue.push({
        type: payload.type,
        resolver: resolve
      });
    });
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
}
