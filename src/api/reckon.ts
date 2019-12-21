import { CommonAPI } from "./common";

export interface ReckonAPI {
  keys(): Promise<string[]>;
  length(): Promise<number>;
}

// export class ReckonService implements ReckonAPI {
//   keys(): Promise<string[]> {
//     return this.target.innerKeys();
//   }
//   length(): number {
//     return this.target.innerLength();
//   }
//   constructor(private target: CommonAPI) {}
// }
