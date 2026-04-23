import type {
  Answers,
  JsxMode,
  ModuleKind,
  ModuleResolution,
  ProjectType,
  StrictLevel,
  Target,
} from "./types.js";

function deriveLib(projectType: ProjectType, target: Target): string[] {
  const hasDOM = projectType === "browser" || projectType === "react";
  return hasDOM ? [target, "DOM", "DOM.Iterable"] : [target];
}

function deriveModuleResolution(moduleKind: ModuleKind): ModuleResolution {
  if (moduleKind === "NodeNext") return "nodenext";
  if (moduleKind === "Node16") return "node16";
  if (moduleKind === "CommonJS") return "node10";
  return "bundler";
}

function applyStrictness(
  opts: Record<string, unknown>,
  level: StrictLevel,
): void {
  if (level === "basic" || level === "max") {
    opts["strict"] = true;
  }
  if (level === "max") {
    Object.assign(opts, {
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      allowUnreachableCode: false,
      allowUnusedLabels: false,
    });
  }
}

function applyJsx(opts: Record<string, unknown>, jsxMode: JsxMode): void {
  if (jsxMode !== "none") {
    opts["jsx"] = jsxMode;
  }
}

function applyExtras(
  opts: Record<string, unknown>,
  has: (flag: string) => boolean,
): void {
  if (has("declaration")) opts["declaration"] = true;
  if (has("declarationMap")) opts["declarationMap"] = true;
  if (has("sourceMap")) opts["sourceMap"] = true;
  if (has("inlineSources")) opts["inlineSources"] = true;
  if (has("removeComments")) opts["removeComments"] = true;
  if (has("resolveJsonModule")) opts["resolveJsonModule"] = true;
  if (has("skipLibCheck")) opts["skipLibCheck"] = true;
  if (has("isolatedModules")) opts["isolatedModules"] = true;
  if (has("verbatimModuleSyntax")) opts["verbatimModuleSyntax"] = true;

  if (has("allowJs")) {
    opts["allowJs"] = true;
    opts["checkJs"] = true;
  }
  if (has("incremental")) {
    opts["incremental"] = true;
    opts["tsBuildInfoFile"] = "./.tsbuildinfo";
  }
}

export function buildTsconfig(answers: Answers): Record<string, unknown> {
  const {
    projectType,
    target,
    moduleKind,
    strictLevel,
    jsxMode,
    outDir,
    srcGlob,
    extraExcludes,
    extras,
  } = answers;

  const compilerOptions: Record<string, unknown> = {
    target,
    lib: deriveLib(projectType, target),
    module: moduleKind,
    moduleResolution: deriveModuleResolution(moduleKind),
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    outDir,
  };

  applyStrictness(compilerOptions, strictLevel);
  applyJsx(compilerOptions, jsxMode);
  applyExtras(compilerOptions, (flag) => extras.includes(flag));

  return {
    compilerOptions,
    include: [srcGlob],
    exclude: ["node_modules", ...extraExcludes],
  };
}
