import { publicProcedure } from "../trpc";
import { z } from "zod";
import { Content, Prisma } from "@prisma/client";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  description: true,
  type: true,
  before: true,
  after: true,
  createdAt: true,
  userId: true,
});

export const postRouter = router({
  uploadUrl: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        before: z.string(),
        after: z.string(),
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

  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const post = await ctx.prisma.post.findUnique({
        where: { id },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${id}'`,
        });
      }
      return post;
    }),

  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const post = await ctx.prisma.post.findMany({
        where: { userId },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${userId}'`,
        });
      }
      return post;
    }),
});
