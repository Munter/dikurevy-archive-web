import type { AliasId } from "./Alias";
import type { ProductionId } from "./Production";
import type { Prop } from "./Prop";
import type { RevueName } from "./Revues";
import type { Role } from "./Role";

type MaterialType = 'sketch' | 'song' | 'video';
type MaterialLocationFolder = 'sketches' | 'songs' | 'videos';
export type MaterialId = `${RevueName}-${string}-${MaterialLocationFolder}/${string}.tex`

export interface Material {
  revuename: RevueName;
  status: string;
  props: Array<Prop>;
  version: string,
  type: MaterialType
  order: number;
  title: string;
  id: MaterialId;
  revueyear: string;
  production: ProductionId;

  /**
   * Length in minutes
   */
  length: 5;
  authoringyear: string;
  texLocation: `${string}/${MaterialLocationFolder}/${string}.tex`;
  pdfLocation: `${string}/${MaterialLocationFolder}/${string}.pdf`;
  authors: Array<AliasId>;
  roles: Array<Role>;
  instructors: Array<AliasId>;
}
