export function normalizeProfileImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (
    imageUrl.startsWith("blob:") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("/api/files/")
  ) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.pathname.startsWith("/api/files/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return imageUrl;
  }

  return imageUrl;
}
