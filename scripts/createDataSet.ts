import { readFile } from "fs/promises";
import { resolve, basename, dirname } from "path";
import fastGlob from "fast-glob";

import type { Involvement } from "../src/data";
import type { AliasId } from "../src/types/Alias";
import type {
  Material,
  MaterialId,
  MaterialLocationFolder,
} from "../src/types/Material";
import type { Production, ProductionId } from "../src/types/Production";
import type { RevueName } from "../src/types/Revues";
import { personMap } from "./personMap";
import { cleanTexStuff } from "./cleanTexStuff";
import { extractAuthors } from "./extractAuhors";
import { materialMetaMap } from "./metaMap";
import { cleanContent } from "./cleanContent";

type ArchiveJsonYearData = {
  name: RevueName;
  year: string;
  acts: Array<{
    title: string;
    length: number;
    order: number;
    materials: Array<{
      revueyear: string;
      author: string;
      status: string;
      type: "sketch" | "song" | "video";
      title: string;
      version: string;
      props: Array<{
        name: string;
        description: string;
        responsible: string;
      }>;
      revuename: string;
      length: string;
      instructors: Array<string>;
      roles: Array<{
        abbr: string;
        actor: string;
        title: string;
      }>;
      order: number;
      composer: string;
      melody?: string;
      location: `${MaterialLocationFolder}/${string}.tex`;
    }>;
  }>;
};

function getCleanId(id: string): AliasId {
  const cleanId = cleanTexStuff(
    id.replace(/^X /, "").replace(/\?+/g, "").toLowerCase().trim()
  );

  return personMap[cleanId] || cleanId;
}

(async () => {
  const dataPaths = await fastGlob(resolve(__dirname, "../archive/*/json.js"));

  const allYears = await Promise.all(
    dataPaths
      .sort()
      .map((jsonPath) =>
        readFile(jsonPath, "utf8").then(
          (data) =>
            [
              jsonPath.replace("/json.js", "").split("/").pop()!,
              JSON.parse(data) as ArchiveJsonYearData,
            ] as const
        )
      )
  );

  const persons: Record<AliasId, Involvement> = {};
  const allMaterials: Record<MaterialId, Material> = {};
  const productions: Record<ProductionId, Production> = {};

  function getPerson(id: string): Involvement | undefined {
    const cleanId = getCleanId(id);

    if (!cleanId) {
      return;
    }

    const [first] = cleanId;

    if (first != first?.toLowerCase() && first == first?.toUpperCase()) {
      throw new Error(`waat "${first}"`);
    }
    let person = persons[cleanId];

    if (!person) {
      person = {
        id: cleanId,
        played: [],
        authored: [],
        instructed: [],
      };

      persons[cleanId] = person;
    }

    return person;
  }

  for (const [folderName, { year: stringYear, name, acts }] of allYears) {
    const year = parseInt(stringYear, 10);
    const yearData: Production = {
      id: `${name}-${year}`,
      year,
      name,
      minutes: 0,
      acts: [],
    };

    for (const { materials, length: actMinutes, ...actData } of acts) {
      const materialsReferences: Array<MaterialId> = [];

      for (const m of materials) {
        const {
          location,
          roles = [],
          author = "",
          instructors = [],
          melody,
          composer,
          length,
          revueyear,
          status,
          title,
          props,
          ...material
        } = m;

        const materialBaseName = basename(location, ".tex");
        const dir = dirname(location) as MaterialLocationFolder;
        const materialId =
          `${name}-${yearData.year}-${dir}/${materialBaseName}` as MaterialId;
        const rawTex = await readFile(
          resolve(
            __dirname,
            "../archive",
            `${folderName}/${dir}/${materialBaseName}.tex`
          ),
          "utf-8"
        );

        const materialData: Material = {
          ...material,
          title: cleanTexStuff(title),
          status: cleanTexStuff(status),
          id: materialId,
          revuename: name,
          revueyear: yearData.year,
          production: yearData.id,
          length: parseFloat(length),
          authoringyear: parseInt(revueyear, 10),
          texLocation: `${year}/${dir}/${materialBaseName}.tex`,
          pdfLocation: `${year}/${dir}/${materialBaseName}.pdf`,

          props: props.map((p) => ({
            name: cleanTexStuff(p.name),
            description: cleanTexStuff(p.description),
            responsible: cleanTexStuff(p.responsible),
          })),
          authors: [],
          roles: [],
          instructors: [],
          melody: melody && cleanTexStuff(melody),
          composer: cleanTexStuff(composer),
          rawTex,
          contentBlocks: cleanContent(rawTex),
          meta: materialMetaMap[materialId] ?? {},
        };

        for (const { actor, abbr, title } of roles) {
          const person = getPerson(actor);

          if (person) {
            if (
              abbr.toLowerCase() === "x" &&
              title.toLowerCase() === "instruktør"
            ) {
              person.instructed.push(materialData.id);
              materialData.instructors.push(person.id);
            } else {
              const roleData = {
                abbr,
                title: cleanTexStuff(title),
                material: materialData.id,
                actor: person.id,
              };

              person.played.push(roleData);
              materialData.roles.push(roleData);
            }
          }
        }

        const authors = extractAuthors(author);

        for (const individualAuthor of authors) {
          const person = getPerson(individualAuthor);

          if (person) {
            person.authored.push(materialData.id);

            materialData.authors.push(person.id);
          }
        }

        for (const instructor of instructors) {
          const person = getPerson(instructor);

          if (person) {
            person.instructed.push(materialData.id);

            materialData.instructors.push(person.id);
          }
        }

        materialsReferences.push(materialData.id);
        allMaterials[materialData.id] = materialData;
      }

      yearData.acts.push({
        ...actData,
        minutes: actMinutes,
        materials: materialsReferences,
      });
      yearData.minutes += actMinutes;
    }

    productions[yearData.id] = yearData;
  }

  const data = {
    productions,
    materials: allMaterials,
    persons,
  };

  console.log(JSON.stringify(data, undefined, 2));
})();
