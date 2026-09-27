import { app } from "./app2";
import { loadEnv } from "./config/env";

export function startServer() {
  try {
    const config = loadEnv();

    return app.listen(config.port, () => {
      console.log(
        `Server listening on port ${config.port} (${config.nodeEnv})`,
      );
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown configuration error.";

    console.error(`Startup configuration error: ${message}`);
    process.exitCode = 1;
    return undefined;
  }
}

if (require.main === module) {
  startServer();
}
