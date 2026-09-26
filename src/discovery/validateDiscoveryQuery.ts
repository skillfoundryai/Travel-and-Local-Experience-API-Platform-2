import { discoveryQuerySchema, type DiscoveryQuery } from "./discovery.schema";
import type { DiscoveryValidationError } from "./discovery.types";

export interface DiscoveryValidationSuccess {
  success: true;
  data: DiscoveryQuery;
}

export interface DiscoveryValidationFailure {
  success: false;
  error: {
    code: "INVALID_INPUT";
    message: string;
    details: DiscoveryValidationError[];
  };
}

export type DiscoveryValidationResult =
  | DiscoveryValidationSuccess
  | DiscoveryValidationFailure;

export function validateDiscoveryQuery(input: unknown): DiscoveryValidationResult {
  const result = discoveryQuerySchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "The discovery request contains invalid input.",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "request",
          message: issue.message,
        })),
      },
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
