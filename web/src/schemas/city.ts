import { z } from "zod";

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string(),
  utcOffsetStandard: z.number(),
  utcOffsetDst: z.number(),
  hasDst: z.boolean(),
});

export type City = z.infer<typeof CitySchema>;

export const DstModeSchema = z.enum(["auto", "dst", "standard"]);
export type DstMode = z.infer<typeof DstModeSchema>;
