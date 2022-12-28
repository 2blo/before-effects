import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Content } from "@prisma/client";
import { Splitscreen } from "@ui/SplitScreen";
import { useRouter } from "next/router";
import { aspectAtom } from "@ui/SplitScreen";
import { useAtom } from "jotai";
import Image from "next/image";

const Video: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  //   let userQuery = undefined;
  //   if (Array.isArray(id)) {
  //     throw "Found array of ids instead of a single id";
  //   } else if (id) {
  //     userQuery = trpc.user.getById.useQuery(id);
  //   }
  const [aspect] = useAtom(aspectAtom);
  const user = "qguser";
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
      <div className="mx-auto " style={{ width: aspect.width }}>
        <h1>Title</h1>
        <div className="flex">
          <Image
            className="h-16 w-16 rounded-full object-cover"
            src="/lifeform.jpg"
            alt="a"
            width={1000}
            height={1000}
          />
          <h1 style={{ alignSelf: "flex-end" }}>{user}</h1>
        </div>
        <p className="pt-4">
          Description asdasda sdasdasdas da as dasd da od aoda oasdaosdmas dmas
          dopmasopmdmas mdadas das dopasopda msodmoasodm moasdmop aopsd
          mopasdmopas mopdaopasdasopdopasd poaopsd maspdm apsmdp amsdpm
        </p>
      </div>
    </div>
  );
};

export default Video;
