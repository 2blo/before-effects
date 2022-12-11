import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Content } from "@prisma/client";

const UploadVideo: NextPage = () => {
  const mutation = trpc.content.uploadUrl.useMutation();
  const onClick = async () => {
    mutation.mutate({
      title: "test title",
      description: "test description",
      before: "https://www.youtube.com/watch?v=dPUWe3PdQ4g",
      after: "https://www.youtube.com/watch?v=dPUWe3PdQ4g",
      type: Content.VIDEO,
    });
  };

  return (
    <div>
      <h1>SSG</h1>
      <h1 onClick={onClick}>Upload</h1>
    </div>
  );
};

export default UploadVideo;
