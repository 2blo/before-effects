import { publicProcedure } from "../trpc";
import { Database } from "../../../../lib/database.types";
import { z } from "zod";
// import { Content } from ".prisma/client";
import { Content } from "@prisma/client";

import { router, protectedProcedure } from "../trpc";

export const contentRouter = router({
  uploadUrl: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        before: z.string().url(),
        after: z.string().url(),
        type: z.enum([Content.IMAGE, Content.VIDEO]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          before: input.before,
          after: input.after,
          userId: ctx.session.user.id,
          type: input.type,
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({
        where: {
          id: input.postId,
        },
      });
    }),
  first: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findFirst();
  }),
});
