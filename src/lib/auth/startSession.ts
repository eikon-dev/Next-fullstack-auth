import {cookies} from "next/headers";
import {createSession} from "@/lib/auth/createSession";

export async function startSession(userId: string) {
  const cookiesStore = await cookies();

  const { id } = await createSession(userId);

  cookiesStore.set("session", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}