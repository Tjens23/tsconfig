#!/usr/bin/env node
import { existsSync } from "fs";
import { resolve } from "path";
import {
  askProjectType,
  askTarget,
  askModuleKind,
  askStrictLevel,
  askJsxMode,
  askOutDir,
  askSrcGlob,
  askExtraExcludes,
  askExtras,
  askOverwrite,
} from "./prompts";
import { buildTsconfig } from "./build";
import { writeTsconfig } from "./write";

async function main(): Promise<void> {
  console.log("\n  tsconfig generator  \n");

  const projectType = await askProjectType();
  const target = await askTarget();
  const moduleKind = await askModuleKind(projectType);
  const strictLevel = await askStrictLevel();
  const jsxMode = projectType === "react" ? await askJsxMode() : "none";
  const outDir = await askOutDir();
  const srcGlob = await askSrcGlob();
  const extraExcludes = await askExtraExcludes();
  const extras = await askExtras(projectType);

  const outputPath = resolve(process.cwd(), "tsconfig.json");
  if (existsSync(outputPath)) {
    const confirmed = await askOverwrite();
    if (!confirmed) {
      console.log("Aborted – no file was written.");
      return;
    }
  }

  const tsconfig = buildTsconfig({
    projectType,
    target,
    moduleKind,
    strictLevel,
    jsxMode,
    outDir,
    srcGlob,
    extraExcludes,
    extras,
  });

  writeTsconfig(tsconfig, outputPath);
}

main().catch((err: unknown) => {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nBye!");
  } else {
    throw err;
  }
});
