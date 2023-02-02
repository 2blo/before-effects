import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Content } from "@prisma/client";

const UploadVideo: NextPage = () => {
  const mutation = trpc.post.uploadUrl.useMutation();
  const onClick = async () => {
    mutation.mutate({
      title: "Terminal 2",
      description: "Music: Zutomayo - Humanoid",
      before: "gFcDolkdB9A",
      after: "a7kTqy96Bz8",
      type: Content.VIDEO,
    });
  };
  const onClicki = async () => {
    mutation.mutate({
      title: "Tuyu canvas",
      description: "Source: Tuyu - あの世行きのバスに乗って、さらば",
      before:
        "https://preview.redd.it/h93al5c4kp7a1.png?width=8000&format=png&auto=webp&s=c35051f26e05d7a9d5a7cdf760f6cd1cb005035e",
      after:
        "https://preview.redd.it/fcwt76c4kp7a1.png?width=8000&format=png&auto=webp&s=fa00ec8bcb0979c26c078f6f9764c7a35a9db33a",
      type: Content.IMAGE,
    });
  };
  const onClicki2 = async () => {
    mutation.mutate({
      title: "makise",
      description: "Source: kaisen",
      before: "https://i.redd.it/6wdlxkn0c9291.png",
      after: "https://i.redd.it/6wdlxkn0c9291.png",
      type: Content.IMAGE,
    });
  };

  return (
    <div>
      <h1>SSG</h1>
      <h1 onClick={onClick}>Upload terminal</h1>
      <h1 onClick={onClicki}>Upload tuyu</h1>
      <h1 onClick={onClicki2}>Upload makise</h1>
    </div>
  );
};

export default UploadVideo;
