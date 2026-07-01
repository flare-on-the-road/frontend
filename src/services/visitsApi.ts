const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export async function recordVisit(payload: {
  visitorKey: string;
  path: string;
  accessToken?: string | null;
}) {
  await fetch(`${API_BASE_URL}/visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(payload.accessToken
        ? { Authorization: `Bearer ${payload.accessToken}` }
        : {}),
    },
    body: JSON.stringify({
      visitorKey: payload.visitorKey,
      path: payload.path,
    }),
    keepalive: true,
  });
}
