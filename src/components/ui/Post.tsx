import { type NextPage } from "next";
import { trpc, uploadInputSchema, type RouterInputs } from "../../utils/trpc";
import { Layout } from "@ui/layout";
import { Input, TextArea, Warning } from "@ui/Input";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/Button";
import { useRouter } from "next/router";
import { motion, useAnimationControls } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { usePersistForm } from "../../utils/userutils";

type UploadInput = RouterInputs["post"]["upload"];
const FORM_DATA_KEY = "app_form_local_data";

const Upload: NextPage = () => {
  const router = useRouter();

  const getSavedData = () => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const data = localStorage.getItem(FORM_DATA_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (err) {
        console.log(err);
      }
    }
    return undefined;
  };

  const methods = useForm<UploadInput>({
    defaultValues: getSavedData(),
    resolver: zodResolver(uploadInputSchema),
  });

  const { data: sessionData } = useSession();

  const [submitting, setSubmitting] = useState(false);

  const mutation = trpc.post.upload.useMutation({
    onSuccess(data) {
      setSubmitting(true);
      localStorage.removeItem(FORM_DATA_KEY);
      router.push(`/post/${data.id}`);
    },
  });
  const frameAnimationControls = useAnimationControls();
  const loadAnimationControls = useAnimationControls();

  const onSubmit: SubmitHandler<UploadInput> = (d) => {
    mutation.mutate({
      title: d.title,
      description: d.description,
      before: d.before,
      after: d.after,
    });
  };

  usePersistForm<UploadInput>(methods.watch(), FORM_DATA_KEY, !submitting);

  return (
    <FormProvider {...methods}>
      <Layout>
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#110d0d] to-[#450000] py-24 text-white">
          <h1 className="pb-4 text-6xl">New Post</h1>

          <label>
            {"Upload two versions of a Video or Image to "}
            <a
              href="https://www.youtube.com/upload"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              Youtube
            </a>
            {" or "}
            <a
              href="https://www.reddit.com/user/me/submit"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              Reddit
            </a>
            {" respectively, then paste the links below."}
          </label>

          <form
            onSubmit={methods.handleSubmit((d) => onSubmit(d))}
            className="mt-12 w-2/4 flex-col"
          >
            <div className="flex justify-center gap-6">
              <label className="w-full">
                Before Version:
                <Input
                  name="before"
                  validity={methods.formState.errors.before ? "error" : "ok"}
                />
                {methods.formState.errors.before?.message && (
                  <Warning>
                    {methods.formState.errors.before?.message.toString()}
                  </Warning>
                )}
              </label>
              <label className="w-full">
                After Version:
                <Input
                  name="after"
                  validity={methods.formState.errors.after ? "error" : "ok"}
                />
                {methods.formState.errors.after?.message && (
                  <Warning>
                    {methods.formState.errors.after?.message.toString()}
                  </Warning>
                )}
              </label>
            </div>
            <div className="mt-12 mb-6">
              <label>
                Title:
                <Input
                  name="title"
                  validity={methods.formState.errors.title ? "error" : "ok"}
                />
                {methods.formState.errors.title?.message && (
                  <Warning>
                    {methods.formState.errors.title?.message.toString()}
                  </Warning>
                )}
              </label>
            </div>
            <div>
              <label>
                Description:
                <TextArea
                  name="description"
                  className="h-32"
                  validity={
                    methods.formState.errors.description ? "error" : "ok"
                  }
                />
                {methods.formState.errors.description?.message && (
                  <Warning>
                    {methods.formState.errors.description?.message.toString()}
                  </Warning>
                )}
              </label>
            </div>
            <div className="mt-10 mb-10 flex items-center justify-center">
              <motion.svg
                width="100"
                height="100"
                initial={{ opacity: 0 }}
                animate={frameAnimationControls}
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDashoffset={`${(2 * 49 * Math.PI) / 8 / 2}`}
                  initial={{ strokeDasharray: `${(2 * 49 * Math.PI) / 8}` }}
                  animate={loadAnimationControls}
                />
              </motion.svg>
              <Button
                type={sessionData ? "submit" : "button"}
                className="absolute"
                onChildClick={
                  sessionData
                    ? async () => {
                        if (methods.formState.isValid) {
                          await frameAnimationControls.start({
                            y: 80,
                            opacity: 0,
                            transition: { duration: 0 },
                          });

                          frameAnimationControls.start({
                            y: 0,
                            opacity: 1,
                            transition: { delay: 0.3 },
                          });

                          await loadAnimationControls.start({
                            rotate: 360 * 11,
                            transition: {
                              duration: 15,
                              ease: [0.01, 0.82, 0.05, 0.78],
                            },
                          });
                        }
                      }
                    : () => signIn()
                }
                clickAnimation={
                  methods.formState.isValid
                    ? [
                        {
                          y: -20,
                          transition: { duration: 0.2, ease: "circOut" },
                        },
                        {
                          y: 100,
                          opacity: 1,
                          transition: { duration: 0.2, ease: "circIn" },
                        },
                        {
                          y: 140,
                          opacity: 0,
                          transition: { duration: 0.05, ease: "linear" },
                        },
                      ]
                    : [
                        { x: 10, transition: { duration: 0.02 } },
                        { x: -10, transition: { duration: 0.02 } },
                        { x: 0, transition: { duration: 0.1 } },
                      ]
                }
              >
                <input
                  type={sessionData ? "submit" : "button"}
                  value={sessionData ? "Publish" : "Sign in to Publish"}
                />
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </FormProvider>
  );
};

export default Upload;
