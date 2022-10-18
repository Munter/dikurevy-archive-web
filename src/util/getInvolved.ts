import { materials } from "../data";
import type { AliasId } from "../types/Alias";
import type { Production } from "../types/Production";

export function getInvolved(production: Production) : Array<AliasId> {
  const involved : Set<AliasId> = new Set();

  for (const act of production.acts) {
    for (const materialId of act.materials) {
      const material = materials[materialId];

      if (material) {
        material.authors.map(involved.add, involved);
        material.instructors.map(involved.add, involved);
        material.roles.map(r => involved.add(r.actor));
      }
    }
  }

  return Array.from(involved).sort();
}
