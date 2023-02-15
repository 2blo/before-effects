import { Content, type Post } from "@prisma/client";
import ManagePost from "@ui/ManagePost";
import { type NextPage } from "next";
import { useRouter } from "next/router";

function idToUrl(id: Post["before"] | Post["after"], type: Post["type"]) {
  return type === Content.VIDEO ? `https://youtu.be/${id}` : id;
}

const EditPost: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as Post["id"];
  const before = router.query.before as Post["before"];
  const after = router.query.after as Post["after"];
  const title = router.query.title as Post["title"];
  const description = router.query.description as Post["description"];
  const type = router.query.type as Post["type"];

  return (
    <ManagePost
      post={{
        before: idToUrl(before, type),
        after: idToUrl(after, type),
        title: title,
        description: description,
        id: id,
      }}
    />
  );
};

export default EditPost;
