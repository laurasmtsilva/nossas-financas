import fs from "node:fs";
import path from "node:path";

import { ROOT } from "./constants";

function beginArtifact(
  kind: string,
  name: string
): string {
  return `==================== BEGIN ARTIFACT ====================

Kind: ${kind}
Name: ${name}

`;
}

function endArtifact(): string {
  return `
===================== END ARTIFACT =====================

`;
}

export function buildFilesContext(
  files: string[]
): string {
  let output = "";

  for (const file of files) {
    const normalized = file.trim();

    if (!normalized) {
      continue;
    }

    const absolutePath = path.join(ROOT, normalized);

    output += beginArtifact(
      "Source Code",
      normalized
    );

    const extension =
      path.extname(normalized).slice(1) || "text";

    output += `\`\`\`${extension}\n`;

    if (fs.existsSync(absolutePath)) {
      output += fs.readFileSync(
        absolutePath,
        "utf8"
      ).trim();
    } else {
      output += "[Arquivo não encontrado]";
    }

    output += "\n```\n";

    output += endArtifact();
  }

  return output;
}