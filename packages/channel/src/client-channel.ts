import { Message } from "./channle-message";

export interface PendingMessage<R = any> {
  type: string;
  resolver: (value?: R | PromiseLike<R> | undefined) => void;
}

export class ClientChannel {
  private msgQueue: PendingMessage[] = [];

  constructor(private store: Worker) {
    this.store.onmessage = this.onMessage as any;
  }

  send<R, T = unknown>(payload: Message<T>): Promise<R> {
    return new Promise(resolve => {
      if (!this.store) {
        throw new Error(
          "Store cannot be a undefined, please call createClientChannel to resolve it."
        );
      }

      this.store.postMessage(payload);
      this.msgQueue.push({
        type: payload.type,
        resolver: resolve
      });
    });
  }

  private onMessage = (e: MessageEvent) => {
    const { type, data } = e.data as Message<unknown>;

    this.unlock(type, data);
  };

  private unlock(targetType: string, data: unknown) {
    const pos = this.msgQueue.findIndex(
      ({ type }: PendingMessage) => type === targetType
    );

    this.msgQueue[pos].resolver(data);
    this.msgQueue.splice(pos, 1);
  }
}
