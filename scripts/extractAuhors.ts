import { cleanTexStuff } from "./cleanTexStuff";

function cleanIndividualAuthor(author: string): string {
  // Handle convention of realname plus nick
  return author
    .replace(/^.*? \(\\texttt\{([^\}]+?)\}\)/, "$1")
    .replace(/\\tt{([^\}]+?)}/, "$1")
    .replace(/\\tt ([^\}]+?)/, "$1");
}

export function extractAuthors(author: string): Array<string> {
  author = cleanTexStuff(author);

  // Expand known groups of people
  author = author.replace(/Uffe (&|og) Uffe Productions™?/gi, "uffe, uffefl");

  // Handle grouped formatted authors
  author = author.replace(/\{\\tt ([^\}]+?)\}/g, (_match, group) => {
    return extractAuthors(group).join(", ");
  });

  // Remove parantheticals
  author = author.replace(/\(([^\}]+?)\)/g, "$1");

  const authors = author
    .trim()
    .replace("kortekst:", ",")
    .replace(". Revideret af", ",")
    .replace("efter idé af", ",")
    .replace("efter en idé af", ",")
    .replace("indskrevet af", ",")
    .replace("inspireret af", ",")
    .replace("med inspiration fra", ",")
    .replace("strammet af", ",")
    .replace("strammet op af", ",")
    .replace("med rettelser fra", ",")
    .replace("samt", ",")
    .replace(" -- og lidt", ",")
    .replace("/", ",")
    .replace(" og co.", "")
    .replace("m.m.fl.", "")
    .replace("m.fl.", "")
    .replace("m. endnu fl.", "")
    .replace("et. al.", "")
    .replace("et.\\ al.", "")
    .replace("o.\\ a.\\", "")
    .replace(" o. a.", "")
    .replace("...", "")
    .replace(" -- det er deres skuld det hele", "")
    .replace(" -- det var hans skyld", "")
    .replace("Skrevet af", "")
    .replace("$\\neg$", "")
    .replace("\\hspace{3.5cm}", "")
    .split(/ *(?:\+|&|\bog\b|,) */g)
    .map((s) => s.trim())
    .filter(Boolean);

  return authors.map(cleanIndividualAuthor);
}
