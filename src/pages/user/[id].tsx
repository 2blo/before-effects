import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import NextError from "next/error";
import Image from "next/image";
import { Post, Content } from "@prisma/client";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { z } from "zod";

const queryClient = new QueryClient();

function useYoutubeThumbnail(after: Post["after"]) {
  return useQuery({
    queryKey: ["thumbnails", after],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${after}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );
      return data;
    },
  });
}

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  contenttype: Content;
  title: Post["title"];
  createdat: string;
  // createdat: Post["createdAt"];
  after: Post["after"];
}

export interface YoutubeThumbnailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  after: Post["after"];
}

const YoutubeThumbnail: React.FC<YoutubeThumbnailProps> = ({
  className,
  ...props
}) => {
  const data = useYoutubeThumbnail(props.after);
  if (data.status !== "success") {
    return <>{"loading"}</>;
  }
  console.log(data.data);
  data;
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* <Image
        className="h-28 w-[119.111px] object-cover"
        src={data}
        alt="alt"
        width={400}
        height={300}
      ></Image> */}
      data.data
    </QueryClientProvider>
  );
};

const Thumbnail: React.FC<ThumbnailProps> = ({ className, ...props }) => {
  let image: string;
  if (props.contenttype === Content.IMAGE) {
    image = props.after;
  } else {
  }
  return (
    <div>
      {props.contenttype === Content.IMAGE ? (
        <Image
          className="h-28 w-[119.111px] object-cover"
          src={props.after}
          alt="alt"
          width={400}
          height={300}
        ></Image>
      ) : (
        <YoutubeThumbnail after={props.after}></YoutubeThumbnail>
      )}
      <h3>{props.title}</h3>
      <h4>{props.createdat.toString()}</h4>
    </div>
  );
};

const UserPage: NextPage = () => {
  // const userId = useRouter().query.id as string;
  // const postQuery = trpc.post.listByUser.useQuery({ userId });
  // if (postQuery.error) {
  //   return (
  //     <NextError
  //       title={postQuery.error.message}
  //       statusCode={postQuery.error.data?.httpStatus ?? 500}
  //     />
  //   );
  // }
  // if (postQuery.status !== "success") {
  //   return <>Loading...</>;
  // }
  // const { data } = postQuery;

  // const router = useRouter();
  // const id = router.query.id;
  // let userQuery = undefined;
  // if (Array.isArray(id)) {
  //   throw "Found array of ids instead of a single id";
  // } else if (id) {
  //   userQuery = trpc.user.getById.useQuery(id);
  // }
  // const red = data.reduce((x, y) => x + "-----" + y.title, "");
  return (
    <div>
      {/* <h1>SSG</h1>
      <h1>{red}</h1> */}
      {/* <div style={{"grid-template-columns": "repeat(auto-fit)"}} className="grid grid-flow-row-dense grid-flow-col-dense tem gap-x-px"> */}
      <div className="grid grid-cols-fluid gap-5">
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <div className="h-32 w-32 bg-red-400"></div>
        <Thumbnail
          title={"title lol"}
          createdat={"2022-21-34"}
          after={"/lifeform.jpg"}
          contenttype={Content.IMAGE}
        ></Thumbnail>
        <Thumbnail
          title={"title lol"}
          createdat={"2022-21-34"}
          after={"a7kTqy96Bz8"}
          contenttype={Content.VIDEO}
        ></Thumbnail>
      </div>
    </div>
  );
};

export default UserPage;
