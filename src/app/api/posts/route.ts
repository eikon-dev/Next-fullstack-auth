import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/auth/requireUser";

export async function GET(request: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const scope = new URL(request.url).searchParams.get("scope");
  const isMe = scope === "me";

  const where = (isMe) ? {
    authorId: auth.user.id } : {
    published: true
  };

  const posts = await prisma
    .post
    .findMany({
      where,
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

  return Response.json({posts}, {status: 200});
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const {title, content} = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return Response.json({
        error: "Title is required" }, {
        status: 400
      }
    );
  }

  const normalizedTitle = title.trim();

  const post = await prisma.post.create({
    data: {
      title: normalizedTitle,
      content,
      authorId: auth.user.id,
      published: false
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true
    }
  });

  return Response.json({post}, {status: 201});
}