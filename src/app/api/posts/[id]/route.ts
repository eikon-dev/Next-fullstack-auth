import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/auth/requireUser";
import {parseIdParam} from "@/lib/api/parseIdParam";

type RouteContext = {
  params: {
    id: string
  } | Promise<{id: string}>
}

export async function DELETE(response: Response, context: RouteContext) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const idNumber = parseIdParam(id);
  if (!idNumber.ok) return idNumber.response;

  const userPost = await prisma.post.findFirst({
    where: {
      id: idNumber.id,
      authorId: auth.user.id
    },
    select: {
      id: true
    },
  });

  if (!userPost) {
    return Response.json({
      error: 'Post not found' }, {
      status: 404
    });
  }

  await prisma.post.delete({where: {id: idNumber.id}});

  return new Response(null, {status: 204});
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const idNumber = parseIdParam(id);
  if (!idNumber.ok) return idNumber.response;

  const body = await request.json();

  if (typeof body.published !== 'boolean') {
    return Response.json({
      error: 'Bad Request' }, {
      status: 400
    });
  }

  const post = await prisma.post.updateMany({
    where: {
      id: idNumber.id,
      authorId: auth.user.id
    },
    data: {
      published: body.published
    }
  });

  if (post.count === 0) {
    return Response.json({
      error: 'Post not found' }, {
      status: 404
    });
  }

  return new Response(null, {status: 204});
}