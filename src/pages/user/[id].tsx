import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { type Post, Content } from "@prisma/client";
import NextError from "next/error";

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  contenttype: Content;
  title: Post["title"];
  createdat: string;
  // createdat: Post["createdAt"];
  after: Post["after"];
}

const Thumbnail: React.FC<ThumbnailProps> = ({ ...props }) => {
  return (
    <div>
      <Image
        // className="h-28 w-[119.111px] object-cover"
        className="h-[90px] w-[160px] object-cover"
        src={
          props.contenttype === Content.IMAGE
            ? props.after
            : `https://i.ytimg.com/vi/${props.after}/hqdefault.jpg`
        }
        alt="alt"
        width={200}
        height={200}
      ></Image>
      <h3>{props.title}</h3>
      <h4>{props.createdat.toString()}</h4>
    </div>
  );
};

const UserPage: NextPage = () => {
  const userQuery = useRouter();
  const userId = userQuery.query.id as string;

  // const postQuery = trpc.post.listByUser.useQuery({ userId });
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
    <>
      {userQuery.isReady && postQuery.status === "success" ? (
        <div className="grid grid-cols-fluid gap-5">
          {postQuery.data.map((item) => (
            <Thumbnail
              contenttype={item.type}
              after={item.after}
              createdat={"now"}
              className="h-16 w-32"
              key={item.id}
              title={item.title}
            ></Thumbnail>
          ))}
        </div>
      ) : (
        <div>loadingg</div>
      )}
    </>
  );
};

export default UserPage;
