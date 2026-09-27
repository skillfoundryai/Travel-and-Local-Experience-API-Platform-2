import { app } from "./app";
import { env } from "./config/env";

function startServer() {
  try {
    const config = env;

    app.listen(config.port, () => {
      console.log(
        `Server listening on port ${config.port} (${config.nodeEnv})`
      );
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown configuration error.";

    console.error(`Startup configuration error: ${message}`);
    process.exit(1);
  }
}

startServer();
