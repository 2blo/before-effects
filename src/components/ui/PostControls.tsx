import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import MenuDropDown from "./Menu";
import { type Post } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { TRPCClientError } from "@trpc/client";

interface PostControlProps extends React.HTMLAttributes<HTMLElement> {
  onDelete: () => void;
  post: Post;
  discrete: boolean;
  alignLeft: boolean;
}

const PostControl: React.FC<PostControlProps> = ({ ...props }) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const deleteMutation = trpc.post.deleteById.useMutation({
    onSuccess() {
      if (sessionData?.user === undefined) {
        throw new TRPCClientError(
          "Unexpected unauthorized error, the server should have thrown an error first."
        );
      } else {
        utils.post.listByUser.invalidate({ userId: sessionData.user.id });
        props.onDelete();
      }
    },
  });
  return (
    <>
      {sessionData?.user?.id === props.post.userId && (
        <MenuDropDown
          discrete={props.discrete}
          alignLeft={props.alignLeft}
          id={props.post.id}
          onDelete={async () => {
            deleteMutation.mutate({ id: props.post.id });
          }}
          onEdit={() => {
            router.push(
              {
                pathname: "/edit",
                query: {
                  id: props.post.id,
                  before: props.post.before,
                  after: props.post.after,
                  title: props.post.title,
                  description: props.post.description,
                  type: props.post.type,
                },
              },
              "/edit"
            );
          }}
        ></MenuDropDown>
      )}
    </>
  );
};

export default PostControl;
