import { expect, test } from "vitest";
import { Content, type Post } from "@prisma/client";
import { SortByDescendingDate } from "../../src/utils/userutils";

const old: Post = {
  id: "a",
  type: Content.IMAGE,
  title: "a",
  description: "a",
  before: "a",
  after: "a",
  createdAt: new Date("1 June 2022"),
  userId: "a",
};

const mid: Post = {
  id: "b",
  type: Content.IMAGE,
  title: "b",
  description: "b",
  before: "b",
  after: "b",
  createdAt: new Date("2 June 2022"),
  userId: "b",
};

const recent: Post = {
  id: "c",
  type: Content.IMAGE,
  title: "c",
  description: "c",
  before: "c",
  after: "c",
  createdAt: new Date("3 June 2022"),
  userId: "c",
};

const ascendingPosts = [old, mid, recent];
const descendingPosts = [recent, mid, old];

test("Ascending sorted equals reverse.", () => {
  expect(SortByDescendingDate(ascendingPosts.slice())).toStrictEqual(
    ascendingPosts.slice().reverse()
  );
});

test.fails(
  "Sorted not equals unsorted (verify not reference comparison).",
  () => {
    expect(SortByDescendingDate(ascendingPosts.slice())).toStrictEqual(
      ascendingPosts.slice()
    );
  }
);

test("Descending unchanged.", () => {
  expect(SortByDescendingDate(descendingPosts.slice())).toStrictEqual(
    descendingPosts.slice()
  );
});
