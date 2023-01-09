import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { type Post, Content } from "@prisma/client";
import NextError from "next/error";
import Link from "next/link";

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  id: Post["id"];
  contenttype: Content;
  title: Post["title"];
  createdat: Post["createdAt"];
  after: Post["after"];
}

const Thumbnail: React.FC<ThumbnailProps> = ({ ...props }) => {
  return (
    <Link
      href={`/post/${props.id}`}
      passHref
      style={{ color: "inherit", textDecoration: "inherit" }}
    >
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
      <h5>{props.title}</h5>
      <h6>{props.createdat.toLocaleDateString("en-GB")}</h6>
    </Link>
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
    <div className="mx-auto w-3/4">
      {userQuery.isReady && postQuery.status === "success" ? (
        <div className="grid grid-cols-fluid gap-5">
          {postQuery.data.map((item) => (
            <Thumbnail
              id={item.id}
              contenttype={item.type}
              after={item.after}
              createdat={item.createdAt}
              className="h-16 w-32"
              key={item.id}
              title={item.title}
            ></Thumbnail>
          ))}
        </div>
      ) : (
        <div>loadingg</div>
      )}
    </div>
  );
};

export default UserPage;
