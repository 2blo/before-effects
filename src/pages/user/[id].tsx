import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { type Post, Content } from "@prisma/client";
import NextError from "next/error";
import { SortByDescendingDate } from "../../utils/userutils";
import MenuDropDown from "@ui/Menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";

dayjs.extend(relativeTime);

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  id: Post["id"];
  contenttype: Content;
  title: Post["title"];
  createdat: Post["createdAt"];
  after: Post["after"];
  onDelete: () => void;
  userId: Post["userId"];
}

const Thumbnail: React.FC<ThumbnailProps> = ({ ...props }) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const deleteMutation = trpc.post.deleteById.useMutation({
    onSuccess(data) {
      console.log("you should delte" + data.title);
      if (sessionData?.user === undefined) {
        throw new TRPCClientError(
          "Unexpected unauthorized error, the server should have thrown an error first."
        );
      } else {
        console.log("inval");
        utils.post.listByUser.invalidate({ userId: sessionData.user.id });
        props.onDelete();
      }
    },
  });
  return (
    <div
      onClick={() => router.push(`/post/${props.id}`)}
      style={{ color: "inherit", textDecoration: "inherit" }}
      className="group rounded-xl border-8 border-transparent hover:bg-gray-300"
    >
      <Image
        className="h-[135px] w-[270px] rounded-tr-xl rounded-tl-xl rounded-br-xl object-cover"
        src={
          props.contenttype === Content.IMAGE
            ? props.after
            : `https://i.ytimg.com/vi/${props.after}/hqdefault.jpg`
        }
        alt="alt"
        width={2000}
        height={2000}
      ></Image>
      <h5 className="text-lg">{props.title}</h5>
      <div className="flex items-end justify-between">
        <h6 className="text-sm">{dayjs(props.createdat).fromNow()}</h6>
        <div onClick={(e) => e.stopPropagation()}>
          {sessionData?.user?.id === props.userId ? (
            <MenuDropDown
              id={props.id}
              onDelete={async () => {
                deleteMutation.mutate({ id: props.id });
              }}
            ></MenuDropDown>
          ) : (
            <></>
          )}
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
    <div className="mx-auto w-3/4 flex-col space-y-10">
      <div className="flex gap-2">
        <Image
          className="h-32 w-32 rounded-full object-cover"
          src="/lifeform.jpg"
          alt="alt"
          width={1000}
          height={1000}
        />
        <h1 className="text-4xl" style={{ alignSelf: "flex-end" }}>
          {"User name"}
        </h1>
      </div>
      {userQuery.isReady && postQuery.status === "success" ? (
        <div className="grid grid-cols-fluid justify-center gap-x-4 gap-y-16">
          {SortByDescendingDate(postQuery.data.slice()).map((item) => (
            <Thumbnail
              id={item.id}
              contenttype={item.type}
              after={item.after}
              createdat={item.createdAt}
              className="h-16 w-32"
              key={item.id}
              title={item.title}
              userId={item.userId}
              onDelete={() => postQuery.refetch()}
            ></Thumbnail>
          ))}
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export default UserPage;
