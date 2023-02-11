import { z } from "zod";

const protocols = ["https", "http"] as const;
const remotePatternSchema = z.array(
  z.object({
    protocol: z.enum(protocols).optional(),
    hostname: z.string(),
    pathname: z.string(),
  })
);

export type RemotePatterns = z.infer<typeof remotePatternSchema>;
