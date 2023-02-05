import { type NextPage } from "next";
import Head from "next/head";
import { Splitscreen } from "@ui/SplitScreen";
import { Layout } from "@ui/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Before Effects</title>
        <meta
          name="description"
          content="Compare Before and After versions of Videos and Images."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gradient-to-b from-[#292929] to-[#480000] pt-48 pb-48">
        <div className="flex pb-48">
          <h1 className="m-auto text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(0,70%,40%)]">Be</span>fore Effects
          </h1>
        </div>
        <div className="flex min-h-screen justify-center ">
          <Splitscreen
            contenttype="VIDEO"
            after="a7kTqy96Bz8"
            before="gFcDolkdB9A"
          />
        </div>
      </main>
    </Layout>
  );
};

export default Home;
