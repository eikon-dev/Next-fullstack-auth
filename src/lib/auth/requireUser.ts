import {CurrentUser, getCurrentUser} from "@/lib/auth/getCurrentUser";

type AuthResult = Success | Failure;

type Success = {
  ok: true,
  user: CurrentUser
}

type Failure = {
  ok: false,
  response: Response
}

export async function requireUser(): Promise<AuthResult> {
  const user = await getCurrentUser();

  if(!user) {
    return {
      ok: false,
      response: Response.json({
        error: "unauthorized"} , {
        status: 401
      })
    };
  }

  return {ok: true, user};
}