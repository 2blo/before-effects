import { z } from "zod";

const t = z.object({ className: z.string(), "aria-hidden": z.boolean() });
export const inListIconProps: z.infer<typeof t> = {
  className: "mr-2 h-5 w-5",
  "aria-hidden": true,
};
