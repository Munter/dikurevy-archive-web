import type { MaterialType } from "../src/types/Material";
import { cleanTexStuff } from "./cleanTexStuff";

const blockMatcher =
  /\\begin\{(?<blockName>sketch|song|video)\}(.*)\\end{\k<blockName>}/gs;
const texKiller = /\\[a-z]+\{[^\{]+\}(?:\[[^\]]+\])?/g;
const commentKiller = /%.+$/gm;

export function cleanContent(
  tex: string
): Array<{ type: MaterialType; content: string }> {
  const results: Array<{ type: MaterialType; content: string }> = [];
  const matches = tex.matchAll(blockMatcher);

  for (const match of matches) {
    const [_fullMatch, blockName, content] = match;

    results.push({
      type: blockName as MaterialType,
      content: cleanTexStuff(content ?? "", false)
        .replace(commentKiller, "")
        .replace(texKiller, "")
        .replace(/\n{2,}/g, "\n\n")
        .replace(/^ +/gm, "")
        .trim(),
    });
  }

  return results;
}
