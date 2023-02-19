import { appRouter } from "./../../src/server/trpc/router/_app";
import { createContextInner } from "./../../src/server/trpc/context";
import { expect, test } from "vitest";
import { Content, PrismaClient, type Post } from "@prisma/client";
import cuid from "cuid";
import { getVideoId } from "../../src/utils/trpc";

const prisma = new PrismaClient();

/**
 * For each user, make 1 post.
 */
function mock_posts(users: string[]) {
  const video = "https://www.youtube.com/watch?v=Xl02L1jy53c";
  return users.map((name) => {
    return {
      id: cuid(),
      type: Content.VIDEO,
      title: `test title for user ${name}`,
      description: `test description for user ${name}`,
      before: video,
      after: video,
      createdAt: new Date("1 June 2022"),
      userId: cuid(),
    };
  });
}

async function mock_login(posts: Post[], userIndex: number) {
  const id = (posts[userIndex] as Post).userId;
  const ctx = await createContextInner({
    session: { user: { id: id }, expires: "in 2 hours" },
  });
  const caller = appRouter.createCaller(ctx);
  await prisma.user.create({ data: { id: id } });
  return caller;
}

await test("Can edit own user's post.", async () => {
  const posts = mock_posts(["A", "B"]);
  if (!posts[0] || !posts[1]) throw new Error("Failed to crate mock posts.");

  const caller = await mock_login(posts, 0);
  await prisma.post.create({ data: posts[0] });

  const expected = {
    title: "edited " + posts[0].title,
    description: "edited " + posts[0].description,
    before: posts[0].before,
    after: posts[0].after,
    id: posts[0].id,
  };

  await caller.post.edit(expected);
  const { createdAt, type, userId, ...edited } = await caller.post.byId({
    id: posts[0].id,
  });
  expected.before = getVideoId(expected.before) as string;
  expected.after = getVideoId(expected.after) as string;
  expect(expected).toStrictEqual(edited);
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

await test("Cannot edit other user's post.", async () => {
  const posts = mock_posts(["A", "B"]);
  if (!posts[0] || !posts[1]) throw new Error("Failed to crate mock posts.");

  let caller = await mock_login(posts, 0);
  await prisma.post.create({ data: posts[0] });

  caller = await mock_login(posts, 1);

  const expected = {
    title: "edited " + posts[0].title,
    description: "edited " + posts[0].description,
    before: posts[0].before,
    after: posts[0].after,
    id: posts[0].id,
  };

  expect(() => caller.post.edit(expected)).rejects.toThrowError();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

await test("Cannot delete other user's post.", async () => {
  const posts = mock_posts(["A", "B"]);
  if (!posts[0] || !posts[1]) throw new Error("Failed to crate mock posts.");

  let caller = await mock_login(posts, 0);
  await prisma.post.create({ data: posts[0] });

  caller = await mock_login(posts, 1);

  const id = posts[0].id;

  expect(() => caller.post.deleteById({ id: id })).rejects.toThrowError();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});
