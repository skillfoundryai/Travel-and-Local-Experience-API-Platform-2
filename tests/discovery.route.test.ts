import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("GET /discovery", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(
    () =>
      new Promise<void>((resolve, reject) => {
        server = app.listen(0, "127.0.0.1", () => {
          const address = server.address();

          if (!address || typeof address === "string") {
            reject(new Error("The test server did not expose a TCP port."));
            return;
          }

          baseUrl = `http://127.0.0.1:${address.port}`;
          resolve();
        });

        server.on("error", reject);
      }),
  );

  afterAll(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }),
  );

  it("returns discovery data for a supported destination", async () => {
    const response = await fetch(
      `${baseUrl}/discovery?destination=Muscat&limit=5`,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      destination: "Muscat",
      places: [{ category: "place" }],
      activities: [{ category: "activity" }],
    });
  });

  it("returns a stable client error for invalid input", async () => {
    const response = await fetch(
      `${baseUrl}/discovery?destination=&limit=100`,
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      error: {
        code: "INVALID_INPUT",
        details: expect.arrayContaining([
          expect.objectContaining({ field: "destination" }),
          expect.objectContaining({ field: "limit" }),
        ]),
      },
    });
  });

  it("returns not found when discovery data is unavailable", async () => {
    const response = await fetch(
      `${baseUrl}/discovery?destination=UnknownDestination`,
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: {
        code: "DISCOVERY_NOT_AVAILABLE",
        message:
          "Discovery information is not available for the requested destination.",
      },
    });
  });
});
