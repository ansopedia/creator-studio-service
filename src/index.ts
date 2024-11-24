import { connectDB } from "./config";
import { envConstants } from "./constants";
import { startServer } from "./server";

(async () => {
  try {
    await connectDB();
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to setup initial data:", error);
    process.exit(1);
  }
})();
