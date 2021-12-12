import { MissingEnvVariableError } from "#lib";

export const requiredEnvVariables = ["URI_DISCORD"];

// Ensure required env variables have loaded
for (const rev of requiredEnvVariables) {
  if (typeof process.env[rev] !== "string") {
    throw new MissingEnvVariableError(rev);
  }
}

// Augment process.env
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV?: "prod" | "dev";
      URI_DISCORD: string;
    }
  }
}

export const isProd = process.env.NODE_ENV === "prod";
export const isDev = process.env.NODE_ENV === "dev" || !isProd;

export const uri = {
  discord: process.env.URI_DISCORD
};
