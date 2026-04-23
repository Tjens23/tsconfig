import { select, checkbox, confirm, input } from "@inquirer/prompts";
import checkboxPlus from "inquirer-checkbox-plus-plus";
import { EXTRA_CHOICES, defaultExtras } from "./choices";
import type {
  JsxMode,
  ModuleKind,
  ProjectType,
  StrictLevel,
  Target,
} from "./types";

export async function askProjectType(): Promise<ProjectType> {
  return select<ProjectType>({
    message: "What kind of project is this?",
    choices: [
      { name: "Node.js application", value: "node" },
      { name: "Browser application", value: "browser" },
      { name: "React / JSX application", value: "react" },
      { name: "Reusable library", value: "library" },
    ],
  });
}

export async function askTarget(): Promise<Target> {
  const targets: Target[] = [
    "ES2015",
    "ES2017",
    "ES2018",
    "ES2019",
    "ES2020",
    "ES2021",
    "ES2022",
    "ES2023",
    "ESNext",
  ];

  return select<Target>({
    message: "Compilation target (ES version your runtime supports)?",
    default: "ES2022",
    choices: targets.map((v) => ({
      name: v,
      value: v,
      ...(v === "ES2022"
        ? { description: "recommended – Node 18 / evergreen browsers" }
        : v === "ESNext"
          ? { description: "latest features (may be unstable)" }
          : {}),
    })),
  });
}

export async function askModuleKind(
  projectType: ProjectType,
): Promise<ModuleKind> {
  return select<ModuleKind>({
    message: "Module system?",
    default: projectType === "node" ? "CommonJS" : "ESNext",
    choices: [
      {
        name: "ESNext (import/export)",
        value: "ESNext",
        description: "use with a bundler or modern Node",
      },
      {
        name: "CommonJS (require/exports)",
        value: "CommonJS",
        description: "classic Node.js",
      },
      {
        name: "NodeNext (ESM + CJS via package.json type)",
        value: "NodeNext",
      },
      { name: "Node16", value: "Node16" },
      { name: "Preserve (pass through as-is)", value: "Preserve" },
    ],
  });
}

export async function askStrictLevel(): Promise<StrictLevel> {
  return select<StrictLevel>({
    message: "Strictness level?",
    default: "max",
    choices: [
      {
        name: "Maximum (recommended)",
        value: "max",
        description:
          "strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes + all lint checks",
      },
      { name: "Basic (strict: true only)", value: "basic" },
      { name: "None", value: "none" },
    ],
  });
}

export async function askJsxMode(): Promise<JsxMode> {
  return select<JsxMode>({
    message: "JSX transform?",
    default: "react-jsx",
    choices: [
      {
        name: "react-jsx (React 17+ automatic)",
        value: "react-jsx",
        description: "no need to import React in every file",
      },
      { name: "react (classic)", value: "react" },
      { name: "preserve (let bundler handle it)", value: "preserve" },
    ],
  });
}

export async function askOutDir(): Promise<string> {
  return input({
    message: "Output directory?",
    default: "./dist",
    validate: (v) => v.trim().length > 0 || "Cannot be empty",
  });
}

export async function askSrcGlob(): Promise<string> {
  return input({
    message: "Source files glob (include pattern)?",
    default: "src/**/*",
    validate: (v) => v.trim().length > 0 || "Cannot be empty",
  });
}

export async function askExtraExcludes(): Promise<string[]> {
  return checkbox({
    message: "Exclude patterns (in addition to node_modules)?",
    choices: [
      { name: "dist", value: "dist", checked: true },
      { name: "build", value: "build", checked: false },
      { name: "coverage", value: "coverage", checked: false },
      { name: "**/*.test.ts", value: "**/*.test.ts", checked: false },
      { name: "**/*.spec.ts", value: "**/*.spec.ts", checked: false },
    ],
  });
}

export async function askExtras(projectType: ProjectType): Promise<string[]> {
  return (await checkboxPlus({
    message: "Additional options? (type to search)",
    searchable: true,
    highlight: true,
    default: defaultExtras(projectType),
    theme: {
      icon: { checked: "◉", unchecked: "◯", disabled: "◯", cursor: "❯" },
    },
    source: (_: unknown, query: string) => {
      const q = (query ?? "").toLowerCase();
      return Promise.resolve(
        EXTRA_CHOICES.filter((c) =>
          q === "" ? true : c.name.toLowerCase().includes(q),
        ),
      );
    },
  })) as string[];
}

export async function askOverwrite(): Promise<boolean> {
  return confirm({
    message: "tsconfig.json already exists. Overwrite?",
    default: false,
  });
}
