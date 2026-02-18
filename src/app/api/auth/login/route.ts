import {prisma} from "@/lib/prisma";
import argon2 from "argon2";
import {startSession} from "@/lib/auth/startSession";

export async function POST(request: Request) {
  const body = await request.json();
  const {email, password} = body;

  if(typeof email !== 'string' || typeof password !== 'string') {
    return Response.json({
      error: 'Missing email or password' }, {
      status: 401
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return Response.json({
      error: 'Missing email or password' }, {
      status: 400
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    }
  });

  if (!user) {
    return Response.json({
      error: 'Invalid credentials' }, {
      status: 401
    });
  }

  const login = await argon2.verify(user.passwordHash, password);

  if (!login) {
    return Response.json({
      error: 'Invalid credentials' }, {
      status: 401
    });
  }

  await startSession(user.id);

  return new Response(null, { status: 204 });
}