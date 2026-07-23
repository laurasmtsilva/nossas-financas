import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "../..");

export const PROMPTS_DIR = path.join(
  import.meta.dirname,
  "prompts"
);