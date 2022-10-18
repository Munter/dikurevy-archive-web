import data from './data.json';
import type { AliasId } from './types/Alias';
import type { Material, MaterialId } from './types/Material';
import type { Production, ProductionId } from './types/Production';
import type { Role } from './types/Role';

export type Involvement = {
  played: Array<Role>,
  authored: Array<MaterialId>,
  instructed: Array<MaterialId>
};

export const productions = data.productions as Record<ProductionId, Production>;
export const materials = data.materials as Record<MaterialId, Material>;
export const aliases = data.persons as Record<AliasId, Involvement>;
