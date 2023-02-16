import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Splitscreen } from "@ui/SplitScreen";
import { useRouter } from "next/router";
import { aspectAtom } from "@ui/SplitScreen";
import { useAtom } from "jotai";
import Image from "next/image";
import NextError from "next/error";
import { Layout } from "@ui/layout";
import PostControl from "@ui/PostControls";

const PostPage: NextPage = () => {
  const [aspect] = useAtom(aspectAtom);

  const router = useRouter();
  const id = router.query.id as string;
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
  const { data: post } = postQuery;

  return (
    <Layout>
      <main>
        <div className="min-h-screen flex-col -space-y-16 bg-gradient-to-b from-[#110d0d] to-[#450000] pt-48 pb-64">
          <Splitscreen
            contenttype={post.type}
            before={post.before}
            after={post.after}
            className="mx-auto"
          />
          <div
            className="mx-auto flex-col space-y-2"
            style={{ width: aspect.width }}
          >
            <h1 className="text-white">{post.title}</h1>
            <div className="flex gap-2">
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src="/lifeform.jpg"
                alt="alt"
                width={1000}
                height={1000}
              />
              <h1 className="text-white" style={{ alignSelf: "flex-end" }}>
                {"User name"}
              </h1>
            </div>
            <PostControl
              discrete={false}
              alignLeft={false}
              post={post}
              onDelete={() => router.push(`/user/${post.userId}`)}
            />
            <div className="whitespace-pre-wrap pt-20 text-white">
              {post.description}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PostPage;
