export function cleanTexStuff(input: string): string {
  if (typeof input !== "string") {
    return input;
  }

  let output = input;

  // Convert TeX quotes
  output = output.replace(/`{2}(.*?)('|`){2}/g, '"$1"');
  output = output.replace(/`{1}(.*?)('|`){1}/g, "'$1'");

  output = output.replace(/\\ldots/g, "...");
  output = output.replace(/\\'e/g, "é");
  output = output.replace(/\\'/g, "'");
  output = output.replace(/\\ae\{\}/g, "æ");
  output = output.replace(/\\ae/g, "æ");
  output = output.replace(/\\"o/g, "ö");
  output = output.replace(/\\ss/g, "ß");
  output = output.replace(/\{\\o\}/g, "ø");
  output = output.replace(/\\oe/g, "ø");
  output = output.replace(/\\o\{\}/g, "ø");
  output = output.replace(/\\aa/g, "æ");
  output = output.replace(/\\&/g, "&");
  output = output.replace(/\\#/g, "#");
  output = output.replace(/\\%/g, "%");
  output = output.replace(/\\ /g, " ");
  output = output.replace(/\\-/g, "-");

  output = output.replace(/\\texttrademark/g, "™");
  output = output.replace(/\$\\alpha\$/g, "α");
  output = output.replace(/\$\\lambda\$/g, "λ");
  output = output.replace(/\$\\pi\$/g, "π");

  // TeX formatting
  output = output.replace(/\\text(?:it|sf)\{([^\}]*)\}/g, "$1");

  return output;
}
