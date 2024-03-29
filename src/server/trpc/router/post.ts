import { publicProcedure } from "../trpc";
import { z } from "zod";
import { Content, Prisma } from "@prisma/client";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  editInputSchema,
  getVideoId,
  uploadInputSchema,
} from "../../../utils/trpc";

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

function inferPostFormatting(
  input: z.infer<typeof uploadInputSchema>,
  userId: string
) {
  const beforeId = getVideoId(input.before);
  const afterId = getVideoId(input.after);
  const { type, before, after } =
    beforeId && afterId
      ? { type: Content.VIDEO, before: beforeId, after: afterId }
      : { type: Content.IMAGE, before: input.before, after: input.after };
  return {
    title: input.title,
    description: input.description,
    before: before,
    after: after,
    userId: userId,
    type: type,
  };
}

export const postRouter = router({
  upload: protectedProcedure
    .input(uploadInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: inferPostFormatting(input, ctx.session.user.id),
      });
    }),

  edit: protectedProcedure.input(editInputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.post.update({
      where: {
        id_userId: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      },
      data: inferPostFormatting(input, ctx.session.user.id),
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

  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.post.delete({
          where: {
            id_userId: {
              id: input.id,
              userId: ctx.session.user.id,
            },
          },
          select: defaultPostSelect,
        });
      } catch (RecordNotFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `There is no post with id '${id}' created by user '${ctx.session.user.id}'. This error should never occur, unless a user is spamming the delete button, or if they "hack" the client and try to delete another user's post.`,
        });
      }
    }),
});
