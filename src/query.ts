import { IQuery, miniql } from "miniql";
import { createQueryResolver, IQueryResolverConfig } from "@miniql/inline";

import data from './data.json';

const productions = Object.values(data.productions);
const materials = Object.values(data.materials);
const persons = Object.values(data.persons);

const inlineQueryConfig: IQueryResolverConfig = {
  entities: {
    productions: {
        primaryKey: "id",
    },
    materials: {
        primaryKey: "id",
    },
    persons: {
        primaryKey: "id",
        nested: {
        }
    },
  }
};

async function main() {

  const queryResolver = await createQueryResolver(inlineQueryConfig, {productions, materials, persons});

  const query: IQuery = {
    get: {
      productions: {
        args: {
          id: 'DIKUrevy-2008',
          // year: 2008
        },
      }
    }
  }

  const result = await miniql(query, queryResolver, {});

  console.log(JSON.stringify(result, null, 2));
}

main()
