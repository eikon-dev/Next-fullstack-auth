import {prisma} from "@/lib/prisma";

type CreateSession = {
  id: string
}

export async function createSession(userId: string): Promise<CreateSession> {
  const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

  const session = await prisma.session.create({
    data: {
      userId: userId,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    }
  })

  return {
    id: session.id
  };
}