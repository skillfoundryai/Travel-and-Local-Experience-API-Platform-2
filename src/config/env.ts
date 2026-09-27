import dotenv from "dotenv";

dotenv.config();

const ALLOWED_RUNTIME_MODES = [
  "development",
  "test",
  "production",
] as const;

type RuntimeMode = (typeof ALLOWED_RUNTIME_MODES)[number];

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(
      `Configuration error: ${name} is required. ` +
        `Add it to your local .env file. See .env.example for guidance.`
    );
  }

  return value.trim();
}

function parsePort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "Configuration error: PORT must be a valid integer between 1 and 65535."
    );
  }

  return port;
}

function parseRuntimeMode(value: string): RuntimeMode {
  if (
    !ALLOWED_RUNTIME_MODES.includes(
      value as RuntimeMode
    )
  ) {
    throw new Error(
      `Configuration error: NODE_ENV must be one of: ${ALLOWED_RUNTIME_MODES.join(
        ", "
      )}.`
    );
  }

  return value as RuntimeMode;
}

export function loadEnv() {
  return {
    port: parsePort(requireEnv("PORT")),
    nodeEnv: parseRuntimeMode(requireEnv("NODE_ENV")),
  } as const;
}
