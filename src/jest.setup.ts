import { connectDB, disconnectDB } from "./config";
import { envConstants } from "./constants";
import { startServer, stopServer } from "./server";

beforeAll(async () => {
  await connectDB();
  await startServer(envConstants.APP_PORT);
});

afterAll(async () => {
  await disconnectDB();
  await stopServer();
});
