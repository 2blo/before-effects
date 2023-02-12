import { type NextPage } from "next";
import { trpc, uploadInputSchema, type RouterInputs } from "../utils/trpc";
import { Layout } from "@ui/layout";
import { Input, TextArea, Warning } from "@ui/Input";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/Button";
import { useRouter } from "next/router";

type uploadInput = RouterInputs["post"]["upload"];

const Upload: NextPage = () => {
  const methods = useForm<uploadInput>({
    resolver: zodResolver(uploadInputSchema),
  });

  const router = useRouter();

  const mutation = trpc.post.upload.useMutation({
    onSuccess(data) {
      router.push(`/post/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<uploadInput> = (d) => {
    mutation.mutate({
      title: d.title,
      description: d.description,
      before: d.before,
      after: d.after,
    });
  };

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#110d0d] to-[#450000] py-24 text-white">
        <h1 className="pb-16">New Post</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((d) => onSubmit(d))}
            className="w-2/4 flex-col "
          >
            <div className="flex justify-center gap-6">
              <label className="w-full">
                Before Version:
                <Input name="before" />
                {methods.formState.errors.before?.message && (
                  <Warning>
                    {methods.formState.errors.before?.message.toString()}
                  </Warning>
                )}
              </label>
              <label className="w-full">
                After Version:
                <Input name="after" />
                {methods.formState.errors.after?.message && (
                  <Warning>
                    {methods.formState.errors.after?.message.toString()}
                  </Warning>
                )}
              </label>
            </div>
            <div className="mt-16 mb-6">
              <label>
                Title:
                <Input name="title" />
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
                <TextArea name="description" className="h-32" />
                {methods.formState.errors.description?.message && (
                  <Warning>
                    {methods.formState.errors.description?.message.toString()}
                  </Warning>
                )}
              </label>
            </div>
            <div className="mt-16 flex justify-center">
              <Button
                clickAnimation={
                  methods.formState.isValid
                    ? undefined
                    : [
                        { x: 10, transition: { duration: 0.02 } },
                        { x: -10, transition: { duration: 0.02 } },
                        { x: 0, transition: { duration: 0.1 } },
                      ]
                }
              >
                <input type="submit" value="Submit" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default Upload;
