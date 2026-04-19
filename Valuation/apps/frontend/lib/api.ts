export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export const apiUrl = (path: string) => {
  if (!path.startsWith("/")) path = "/" + path;
  return `${apiBase}${path}`;
};
