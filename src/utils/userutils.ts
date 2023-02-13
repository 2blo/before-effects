import { type Post } from "@prisma/client";
import { useEffect } from "react";

export function SortByDescendingDate(posts: Array<Post>) {
  return posts.sort(
    (a: Post, b: Post) => -(a.createdAt.getTime() - b.createdAt.getTime())
  );
}

export function usePersistForm<T>(
  value: T,
  localStorageKey: string,
  enable: boolean
) {
  useEffect(() => {
    if (enable) {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }
  }, [value, localStorageKey, enable]);
  return;
}
