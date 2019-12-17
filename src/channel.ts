import { Message } from "./dtos";
import { resolve } from "dns";

export interface PendingMessage {
  type: string;
  resolver: (value: unknown) => void;
}

export class Channel {
  private store: Worker;
  private msgQueue: PendingMessage[] = [];

  constructor(store: Worker) {
    this.store = store;
    this.store.onmessage = this.onMessage as any;
  }

  unlock(targetType: string, data: unknown) {
    const { resolver } = this.msgQueue.find(
      ({ type }: PendingMessage) => type === targetType
    );

    console.info(data);

    resolver(data);
  }

  onMessage = (e: MessageEvent) => {
    const { type, data } = e.data as Message<unknown>;

    this.unlock(type, data);
  };

  send<T = unknown>(payload: Message<T>): Promise<T> {
    return new Promise(resolve => {
      this.store.postMessage(payload);
      this.msgQueue.push({
        type: payload.type,
        resolver: resolve
      });
    });
  }
}
