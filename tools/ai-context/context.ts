import fs from "node:fs";
import path from "node:path";

import { profiles } from "./config";
import { PROMPTS_DIR, ROOT } from "./constants";

function beginArtifact(kind: string, name: string): string {
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

export function buildContext(
  profile: keyof typeof profiles
): string {
  const selectedProfile = profiles[profile];

  let output = "";

  //
  // Instruções do agente
  //

  const promptPath = path.join(
    PROMPTS_DIR,
    selectedProfile.prompt
  );

  output += fs.readFileSync(promptPath, "utf8").trim();

  output += "\n\n";

  //
  // Artefatos
  //

  for (const doc of selectedProfile.docs) {
    const absolutePath = path.join(ROOT, doc);

    output += beginArtifact(
      "Project Documentation",
      doc
    );

    output += "```markdown\n";

    if (fs.existsSync(absolutePath)) {
      output += fs.readFileSync(
        absolutePath,
        "utf8"
      ).trim();
    } else {
      output += "[Documento não encontrado]";
    }

    output += "\n```\n";

    output += endArtifact();
  }

  return output;
}