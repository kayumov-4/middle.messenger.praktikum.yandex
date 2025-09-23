import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleFileExtensions: ["ts", "json", "node", "js"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    verbose: true,
  };
};
