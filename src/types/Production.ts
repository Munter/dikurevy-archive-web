import type { MaterialId } from "./Material";
import type { RevueName } from "./Revues";

export type ProductionId = `${RevueName}-${string}`;

export interface Production {
  id: ProductionId,
  name: string,
  year: string,
  minutes: number,
  acts: Array<{
    title: string,
    order: number,
    minutes: number,
    materials: Array<MaterialId>
  }>,
}
