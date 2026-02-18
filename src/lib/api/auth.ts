import {apiFetch} from "@/lib/api/apiFetch";

export type CurrentUser = {
  id: string
  email: string
}

type LoginInput = {
  email: string;
  password: string;
}

export function me(): Promise<CurrentUser | null> {
  return apiFetch<CurrentUser | null>("/api/auth/me");
}

export function login(input: LoginInput) {
  return apiFetch<void>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function register(input: LoginInput) {
  return apiFetch<void>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function logout() {
  return apiFetch<void>("/api/auth/logout", {
    method: "POST"
  });
}