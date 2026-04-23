import { writeFileSync } from "node:fs";

export function writeTsconfig(
  tsconfig: Record<string, unknown>,
  outputPath: string,
): void {
  writeFileSync(outputPath, JSON.stringify(tsconfig, null, 2) + "\n");
  console.log(`\nWrote tsconfig.json to ${outputPath}`);
}
