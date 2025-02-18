import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-input",
    path: "./lib/index.ts",
    outputPath: "./dist/index.js",
    umdName: "JBInput",
    external: ["jb-validation", "jb-form", "jb-core"],
    globals: {
      "jb-validation": "JBValidation",
      "jb-core":"JBCore"
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-input-react",
    path: "./react/lib/JBInput.tsx",
    outputPath: "./react/dist/JBInput.js",
    external: ["jb-core", "jb-core/react","jb-input", "prop-types", "react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName:"JBInputReact",
    dir:"./react"
  },
];