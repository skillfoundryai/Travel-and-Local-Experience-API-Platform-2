import { Router } from "express";
import { discover } from "./discovery.service";
import { validateDiscoveryQuery } from "./validateDiscoveryQuery";

export const discoveryRouter = Router();

discoveryRouter.get("/discovery", (request, response) => {
  const validation = validateDiscoveryQuery(request.query);

  if (!validation.success) {
    response.status(400).json({ error: validation.error });
    return;
  }

  try {
    const result = discover(validation.data);

    if (!result) {
      response.status(404).json({
        error: {
          code: "DISCOVERY_NOT_AVAILABLE",
          message:
            "Discovery information is not available for the requested destination.",
        },
      });
      return;
    }

    response.status(200).json(result);
  } catch {
    response.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "The discovery request could not be completed.",
      },
    });
  }
});
