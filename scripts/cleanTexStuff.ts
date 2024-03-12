export function cleanTexStuff(input: string, verbose = true): string {
  if (typeof input !== "string") {
    return input;
  }

  let output = input;

  // Convert TeX quotes
  output = output.replace(/`{2}(.*?)('|`){2}/g, '"$1"');
  output = output.replace(/`{1}(.*?)('|`){1}/g, "'$1'");

  output = output.replace(/\\l?dots(?:\{\})?/g, "…");
  output = output.replace(/\\'e/g, "é");
  output = output.replace(/\\'/g, "'");
  output = output.replace(/\\ae(?:\{\})?/g, "æ");
  output = output.replace(/\\"o/g, "ö");
  output = output.replace(/\\ss/g, "ß");
  output = output.replace(/\{\\o\}/g, "ø");
  output = output.replace(/\\oe/g, "ø");
  output = output.replace(/\\o\{\}/g, "ø");
  output = output.replace(/\\aa(?:\{\})?/g, "å");
  output = output.replace(/\\&/g, "&");
  output = output.replace(/\\#/g, "#");
  output = output.replace(/\\%/g, "%");
  output = output.replace(/\\ /g, " ");
  output = output.replace(/\\-/g, "-");
  output = output.replace(/\\_/g, "_");

  output = output.replace(/\$\\!\$/g, "");
  output = output.replace(/\\texttrademark/g, "™");
  output = output.replace(/\\@/g, "@");
  output = output.replace(/\$?\\times\$?/g, "×");
  output = output.replace(/\$\\alpha\$/g, "α");
  output = output.replace(/\$\\lambda\$/g, "λ");
  output = output.replace(/\$\\pi\$/g, "π");
  output = output.replace(/\$\\neg\$/g, "¬");

  output = output.replace(/\$\\sqrt([^\\]*)\$/g, "√$1");

  // TeX formatting
  output = output.replace(/\\text(?:it|sf|rm|tt|bf)\{([^\}]*)\}/g, "$1");
  output = output.replace(/\{\\(?:sc|em|emph|tt) ([^\}]*)\}/g, "$1");
  output = output.replace(/\\(?:sc|em|emph|tt) ([^\}]*)/g, "$1");
  output = output.replace(/\\(?:sc|em|emph|tt)\{([^\}]*)\}/g, "$1");
  output = output.replace(/\\hspace\{([^\}]*)\}/g, "");

  // Bracket wrappers
  output = output.replace(/\\\{([^*\}])*\\\}/g, "$1");

  // Hacks
  output = output.replace(/\$\^\{2\}\$/g, "²");
  output = output.replace(/\$\^\\small tm\$/gi, "™");
  output = output.replace(/\\*$/gi, "");

  if (verbose) {
    if (output.includes("\\") || output.includes("{")) {
      console.error(
        `TeX was not cleaned properly\n\n Input: ${input}\nOutput: ${output}`
      );
    }
  }

  return output;
}
