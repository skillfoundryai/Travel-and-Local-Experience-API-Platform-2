import { z } from "zod";

export const discoveryQuerySchema = z.object({
  destination: z
    .string({
      error: "Destination is required.",
    })
    .trim()
    .min(1, "Destination is required.")
    .max(100, "Destination must not exceed 100 characters."),

  category: z.enum(["place", "activity"]).optional(),

  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .min(1, "Limit must be between 1 and 50.")
    .max(50, "Limit must be between 1 and 50.")
    .default(20),
});

export type DiscoveryQuery = z.infer<typeof discoveryQuerySchema>;
