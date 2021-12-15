import { MissingEnvVariableError } from "#lib";

export const requiredEnvVariables = [
  "URI_DISCORD",
  "URI_POSTGRESQL",
  "URI_REDIS",
  "PREFIX",
  "PHISHING_API_URL",
  "USER_AGENT"
];

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
      URI_POSTGRESQL: string;
      URI_REDIS: string;
      PREFIX: string;
      PHISHING_API_URL: string;
      USER_AGENT: string;
    }
  }
}

export const isProd = process.env.NODE_ENV === "prod";
export const isDev = process.env.NODE_ENV === "dev" || !isProd;

export const uri = {
  discord: process.env.URI_DISCORD,
  postgresql: process.env.URI_POSTGRESQL,
  redis: process.env.URI_REDIS
};

export const prefix = process.env.PREFIX;

export const phishingApiUrl = process.env.PHISHING_API_URL;
export const userAgent = process.env.USER_AGENT;
