import inquirer from "inquirer";

import { profiles } from "./config";
import { buildContext } from "./context";
import { buildFilesContext } from "./files";
import { copyToClipboard } from "./clipboard";
import {
  buildArtifactsHeader,
  buildFooter,
  buildHeader,
} from "./header";

async function main() {
  const { profile } = await inquirer.prompt([
    {
      type: "select",
      name: "profile",
      message: "Qual perfil deseja utilizar?",
      choices: Object.entries(profiles).map(([key, profile]) => ({
        name: profile.name,
        value: key,
      })),
    },
  ]);

  const { files } = await inquirer.prompt([
    {
      type: "input",
      name: "files",
      message:
        "Arquivos de código (separados por vírgula ou Enter para nenhum):",
    },
  ]);

  const fileList = files
    .split(",")
    .map((file: string) => file.trim())
    .filter(Boolean);

  let output = "";

  output += buildHeader();

  output += buildContext(
    profile as keyof typeof profiles
  );

  output += buildArtifactsHeader();

  if (fileList.length > 0) {
    output += buildFilesContext(fileList);
  }

  output += buildFooter();

  await copyToClipboard(output);

  console.log("\n✔ Contexto copiado para a área de transferência.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});