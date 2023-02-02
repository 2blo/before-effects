import { type Post } from "@prisma/client";

export function SortByDescendingDate(posts: Array<Post>) {
  return posts.sort(
    (a: Post, b: Post) => -(a.createdAt.getTime() - b.createdAt.getTime())
  );
}
