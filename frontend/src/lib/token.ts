export function getTokenPayload(): {
  user_id: string;
  email: string;
  name: string;
} | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
