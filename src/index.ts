import { env } from "./config/env";
import { app } from "./app";

async function startServer() {
  try {
    app.listen(env.port, () => {
      console.log(
        `Server started on port ${env.port} in ${env.nodeEnv} mode`
      );
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown startup error";

    console.error(`Startup failed: ${message}`);
    process.exit(1);
  }
}

startServer();
