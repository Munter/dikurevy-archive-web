import type { AliasId } from "./Alias";
import type { ProductionId } from "./Production";
import type { Prop } from "./Prop";
import type { RevueName } from "./Revues";
import type { Role } from "./Role";

export type MaterialType = "sketch" | "song" | "video";
export type MaterialLocationFolder = "sketches" | "sange" | "video";
export type MaterialId =
  `${RevueName}-${number}-${MaterialLocationFolder}/${string}`;

export interface Material {
  revuename: RevueName;
  status: string;
  props: Array<Prop>;
  version: string;
  type: MaterialType;
  order: number;
  title: string;
  id: MaterialId;
  revueyear: number;
  production: ProductionId;

  /**
   * Length in minutes
   */
  length: number;
  authoringyear: number;
  texLocation: `${number}/${MaterialLocationFolder}/${string}.tex`;
  pdfLocation: `${number}/${MaterialLocationFolder}/${string}.pdf`;
  authors: Array<AliasId>;
  roles: Array<Role>;
  instructors: Array<AliasId>;
  melody?: string | undefined;
  composer?: string | undefined;
  rawTex: string;
  contentBlocks: Array<{ type: MaterialType; content: string }>;
  meta: MaterialMeta;
}

export interface MaterialMeta {
  type?: MaterialType;
  title?: string;
  youtube?: string;
  spotify?: string;
}
