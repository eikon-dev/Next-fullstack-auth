import PostsList from "@/features/posts/ui/PostsList";
import {getCurrentUser} from "@/lib/auth/getCurrentUser";
import {redirect} from "next/navigation";

export default async function Posts() {
  const user = await getCurrentUser();

  if(!user) {
    redirect("/login");
  }

  return (
    <PostsList/>
  );
}
