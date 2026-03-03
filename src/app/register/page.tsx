import {getCurrentUser} from "@/lib/auth/getCurrentUser";
import {redirect} from "next/navigation";
import RegisterForm from "@/features/auth/ui/RegisterForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if(user) {
    redirect("/posts");
  }

  return (
    <RegisterForm/>
  );
}
