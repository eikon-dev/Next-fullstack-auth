import {LoginForm} from "@/features/auth/ui/LoginForm";
import {getCurrentUser} from "@/lib/auth/getCurrentUser";
import {redirect} from "next/navigation";

export default async function Login() {
  const user = await getCurrentUser();

  if(user) {
    redirect("/posts");
  }

  return (
    <LoginForm/>
  );
}
