import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";

export async function POST() {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore
    .get("session")?.value;

  if(!sessionId) {
    return new Response(null, {status: 204});
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    }
  });

  if(!session) {
    return new Response(null, {status: 204});
  }

  await prisma.session.update({
    where: {
      id: sessionId
    },
    data: {
      revokedAt: new Date()
    }
  });

  cookiesStore.delete("session");

  return new Response(null, {status: 204});
}