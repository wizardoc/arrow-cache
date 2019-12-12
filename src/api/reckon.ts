import { CommonAPI } from "./common";

export interface ReckonAPI {
  keys(): string[];
  length(): number;
}

export class ReckonService implements ReckonAPI {
  keys(): string[] {
    return this.target.innerKeys();
  }
  length(): number {
    return this.target.innerLength();
  }
  constructor(private target: CommonAPI) {}
}
