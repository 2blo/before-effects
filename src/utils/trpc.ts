import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

import { type AppRouter } from "../server/trpc/router/_app";
import { imageRegex } from "./config";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const youtubeRegex = String.raw`(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`;

const urlHint = "Invalid url or image host.";

const baseSchema = (len: number) =>
  z.string().max(len, `Cannot exceed ${len} characters.`);

const contentSchema = z.union([
  baseSchema(1000).url(urlHint).regex(imageRegex, urlHint),
  baseSchema(1000).url(urlHint).regex(new RegExp(youtubeRegex, "gi"), urlHint),
]);

export const uploadInputSchema = z.object({
  before: contentSchema,
  after: contentSchema,
  title: baseSchema(100).min(1, "Cannot be empty."),
  description: baseSchema(1000),
});

export function getVideoId(url: string) {
  const match = new RegExp(youtubeRegex, "gi").exec(url);
  return match === null ? undefined : match[1];
}

export const editInputSchema = z.intersection(
  uploadInputSchema,
  z.object({ id: z.string().cuid() })
);
