import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Splitscreen } from "@ui/SplitScreen";
import { useRouter } from "next/router";
import { aspectAtom } from "@ui/SplitScreen";
import { useAtom } from "jotai";
import Image from "next/image";
import NextError from "next/error";

const Video: NextPage = () => {
  const [aspect] = useAtom(aspectAtom);

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
    <div className="flex-col -space-y-16">
      <Splitscreen
        contenttype={data.type}
        before={data.before}
        after={data.after}
        className="mx-auto"
      />
      <div
        className="mx-auto flex-col space-y-2"
        style={{ width: aspect.width }}
      >
        <h1>{data.title}</h1>
        <div className="flex gap-2">
          <Image
            className="h-16 w-16 rounded-full object-cover"
            src="/lifeform.jpg"
            alt="alt"
            width={1000}
            height={1000}
          />
          <h1 style={{ alignSelf: "flex-end" }}>{"User name"}</h1>
        </div>
        <div className="whitespace-pre-wrap pt-8">{data.description}</div>
      </div>
    </div>
  );
};

export default Video;
