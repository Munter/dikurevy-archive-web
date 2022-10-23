import type { AliasId } from "./Alias";

export interface Prop {
    name: string,
    description: string,
    responsible: AliasId;
}
