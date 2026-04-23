import type { ProjectType } from "./types.js";

export const EXTRA_CHOICES = [
  { name: "Declaration files (.d.ts)", value: "declaration" },
  { name: "Declaration maps (.d.ts.map)", value: "declarationMap" },
  { name: "Source maps", value: "sourceMap" },
  { name: "Inline sources in source maps", value: "inlineSources" },
  { name: "Remove comments from output", value: "removeComments" },
  { name: "Incremental builds (.tsbuildinfo)", value: "incremental" },
  { name: "Resolve JSON modules", value: "resolveJsonModule" },
  { name: "Allow importing .js files", value: "allowJs" },
  {
    name: "Skip type checking of .d.ts files (skipLibCheck)",
    value: "skipLibCheck",
  },
  {
    name: "isolatedModules (required by esbuild / swc / Babel)",
    value: "isolatedModules",
  },
  {
    name: "verbatimModuleSyntax (enforce import type)",
    value: "verbatimModuleSyntax",
  },
] as const;

export type ExtraKey = (typeof EXTRA_CHOICES)[number]["value"];

export function defaultExtras(projectType: ProjectType): ExtraKey[] {
  const always: ExtraKey[] = [
    "sourceMap",
    "incremental",
    "resolveJsonModule",
    "skipLibCheck",
  ];

  const libraryOnly: ExtraKey[] =
    projectType === "library" ? ["declaration", "declarationMap"] : [];

  return [...libraryOnly, ...always];
}
