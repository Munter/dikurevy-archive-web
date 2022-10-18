import type { AliasId } from "./Alias";
import type { MaterialId } from "./Material";

export interface Role {
  abbr: string;
  title: string;
  material: MaterialId;
  actor: AliasId;
}
