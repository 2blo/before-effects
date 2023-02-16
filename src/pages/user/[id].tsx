import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { type Post, Content } from "@prisma/client";
import NextError from "next/error";
import { SortByDescendingDate } from "../../utils/userutils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Layout } from "@ui/layout";
import PostControl from "@ui/PostControls";

dayjs.extend(relativeTime);

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  onDelete: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ ...props }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/post/${props.post.id}`)}
      style={{ color: "inherit", textDecoration: "inherit" }}
      className="group rounded-xl border-8 border-transparent hover:bg-white/5"
    >
      <Image
        className="h-[135px] w-[270px] rounded-tr-xl rounded-tl-xl rounded-br-xl object-cover"
        src={
          props.post.type === Content.IMAGE
            ? props.post.after
            : `https://i.ytimg.com/vi/${props.post.after}/hqdefault.jpg`
        }
        alt="alt"
        width={2000}
        height={2000}
      ></Image>
      <h5 className="text-lg text-white">{props.post.title}</h5>
      <div className="flex items-end justify-between">
        <h6 className="text-sm text-white">
          {dayjs(props.post.createdAt).fromNow()}
        </h6>
        <div onClick={(e) => e.stopPropagation()}>
          <PostControl
            onDelete={props.onDelete}
            post={props.post}
            discrete={true}
            alignLeft={true}
          />
        </div>
      </div>
    </div>
  );
};

const UserPage: NextPage = () => {
  const userQuery = useRouter();
  const userId = userQuery.query.id as string;
  const postQuery = trpc.post.listByUser.useQuery({ userId });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  return (
    <Layout>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[#110d0d] to-[#450000] py-24">
          <div className="mx-auto w-3/4 flex-col space-y-10">
            <div className="flex gap-2">
              <Image
                className="h-32 w-32 rounded-full object-cover"
                src="/lifeform.jpg"
                alt="alt"
                width={1000}
                height={1000}
              />
              <h1
                className="text-4xl text-white"
                style={{ alignSelf: "flex-end" }}
              >
                {"User name"}
              </h1>
            </div>
            {userQuery.isReady && postQuery.status === "success" ? (
              <div className="grid grid-cols-fluid justify-center gap-x-4 gap-y-16">
                {SortByDescendingDate(postQuery.data.slice()).map((item) => (
                  <Thumbnail
                    className="h-16 w-32"
                    key={item.id}
                    post={item}
                    onDelete={() => postQuery.refetch()}
                  ></Thumbnail>
                ))}
              </div>
            ) : (
              <div>loading...</div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default UserPage;
