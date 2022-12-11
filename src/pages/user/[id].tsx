import { useRouter } from "next/router";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";

const UserPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  let userQuery = undefined;
  if (Array.isArray(id)) {
    throw "Found array of ids instead of a single id";
  } else if (id) {
    userQuery = trpc.user.getById.useQuery(id);
  }

  return (
    <div>
      <h1>SSG</h1>
      <h1>{userQuery && userQuery.data?.name}</h1>
    </div>
  );
};

export default UserPage;
