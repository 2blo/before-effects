import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Content } from "@prisma/client";

const Video: NextPage = () => {
  const query = trpc.content.first.useQuery();

  return (
    <div>
      <h1>SSG</h1>
      <h1>{query.data ? query.data.title : "Loading tRPC query..."}</h1>
    </div>
  );
};

export default Video;
