export type ProjectType = "node" | "browser" | "react" | "library";

export type Target =
  | "ES2015"
  | "ES2017"
  | "ES2018"
  | "ES2019"
  | "ES2020"
  | "ES2021"
  | "ES2022"
  | "ES2023"
  | "ESNext";

export type ModuleKind =
  | "CommonJS"
  | "ESNext"
  | "NodeNext"
  | "Node16"
  | "Preserve"
  | "None";

export type ModuleResolution = "bundler" | "nodenext" | "node16" | "node10";

export type JsxMode =
  | "react"
  | "react-jsx"
  | "react-jsxdev"
  | "preserve"
  | "none";

export type StrictLevel = "none" | "basic" | "max";

export interface Answers {
  projectType: ProjectType;
  target: Target;
  moduleKind: ModuleKind;
  strictLevel: StrictLevel;
  jsxMode: JsxMode;
  outDir: string;
  srcGlob: string;
  extraExcludes: string[];
  extras: string[];
}
