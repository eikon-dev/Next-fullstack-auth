import {prisma} from "@/lib/prisma";
import argon2 from "argon2";
import {startSession} from "@/lib/auth/startSession";

export async function POST(request: Request) {
  const body = await request.json();
  const {email, password} = body;
  const normalizedEmail = email.trim().toLowerCase();

  if(!normalizedEmail || !password) {
    return Response.json({
      error: 'Missing email or password'}, {
      status: 400
    });
  }

  if(password.length < 8) {
    return Response.json({
      error: 'Password must be at least 8 characters' }, {
      status: 400
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    }
  });

  if(existingUser) {
    return Response.json({
      error: 'Email already registered' }, {
      status: 409
    });
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash
    }
  });

  await startSession(user.id);

  return Response.json({
    user: {
      email: normalizedEmail
    }
    }, {
    status: 201
  });
}