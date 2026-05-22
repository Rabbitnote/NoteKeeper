export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (res.status === 401) {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/auth/login";
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
