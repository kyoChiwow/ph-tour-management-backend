import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    // eslint-disable-next-line no-console
    console.log("Connected to DB!");
    server = app.listen(envVars.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.log("Unhandled Rejection detected.. Server is shutting down", err);

  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log("Server closed");
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.log("Uncaught Exception detected.. Server is shutting down", err);

  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log("Server closed");
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("Signal signal detected.. Server is shutting down");

  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log("Server closed");
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  // eslint-disable-next-line no-console
  console.log("Signal init signal detected.. Server is shutting down");

  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log("Server closed");
      process.exit(1);
    });
  }

  process.exit(1);
});

// Unhandled rejection error ->
// Promise.reject(new Error("I forgot to catch this promise"));

// Uncaught exception error ->
// throw new Error("I forgot to handle this local error");

/**
 * unhandled rejection error -> (when we have a promise that is not handled)
 * uncaught rejection error ->
 * signal termination (sigterm) ->
 */
