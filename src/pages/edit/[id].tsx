import { Content, type Post } from "@prisma/client";
import ManagePost from "@ui/ManagePost";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import NextError from "next/error";
import { useRouter } from "next/router";

function idToUrl(id: Post["before"] | Post["after"], type: Post["type"]) {
  return type === Content.VIDEO ? `https://youtu.be/${id}` : id;
}

const EditPost: NextPage = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.post.byId.useQuery({ id });
  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }
  if (postQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <ManagePost
      post={{
        before: idToUrl(data.before, data.type),
        after: idToUrl(data.after, data.type),
        title: data.title,
        description: data.description,
        id: id,
      }}
    />
  );
};

export default EditPost;
