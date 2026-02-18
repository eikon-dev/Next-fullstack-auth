export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  const res = await fetch(url, {...options, credentials: "include" });

  if(url === "/api/auth/me" && res.status === 401) {
    return null;
  }

  if(res.status === 204) {
    return null;
  }

  if(res.status === 401) {
    throw new Error("Unauthorized");
  }

  if(!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  return await res.json();
}