import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Content } from "@prisma/client";
import { Splitscreen } from "@ui/SplitScreen";
import { useRouter } from "next/router";
import { aspectAtom } from "@ui/SplitScreen";
import { useAtom } from "jotai";
import Image from "next/image";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
  random: () => 0.2,
});

const Video: NextPage = () => {
  const [aspect] = useAtom(aspectAtom);
  return (
    <div className="flex-col -space-y-16">
      <Splitscreen
        contenttype={Content.VIDEO}
        after="a7kTqy96Bz8"
        before="gFcDolkdB9A"
        className="mx-auto"
      />
      {/* <Splitscreen
        className="mx-auto"
        contenttype="IMAGE"
        after="https://preview.redd.it/fcwt76c4kp7a1.png?width=8000&format=png&auto=webp&s=fa00ec8bcb0979c26c078f6f9764c7a35a9db33a"
        before="https://preview.redd.it/h93al5c4kp7a1.png?width=8000&format=png&auto=webp&s=c35051f26e05d7a9d5a7cdf760f6cd1cb005035e"
      /> */}
      <div
        className="mx-auto flex-col space-y-2"
        style={{ width: aspect.width }}
      >
        <h1>{"Long Video Title"}</h1>
        <div className="flex gap-2">
          <Image
            className="h-16 w-16 rounded-full object-cover"
            src="/lifeform.jpg"
            alt="a"
            width={1000}
            height={1000}
          />
          <h1 style={{ alignSelf: "flex-end" }}>{"User name"}</h1>
        </div>
        <div className="whitespace-pre-wrap pt-8">
          {lorem.generateParagraphs(4).replaceAll("\n", "\n\n")}
        </div>
      </div>
    </div>
  );
};

export default Video;
