import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";

export type CurrentUser = {
  id: string
  email: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get("session")?.value;

  if(!sessionId) {
    return null;
  }

  const now = new Date();

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        }
      },
    },
  })

  if(!session) {
    return null;
  }

  if(session.revokedAt) {
    return null;
  }

  if(session.expiresAt <= now) {
    return null;
  }

  if(!session.user) {
    return null;
  }

  return session.user;
}