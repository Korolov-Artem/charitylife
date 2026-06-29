export const getImageUrl = (path: string | undefined) => {
  if (!path) {
    return "";
  }

  let cleanPath = path.replace(/&#x2F;/g, "/");
  cleanPath = cleanPath.replace(/"/g, "");
  cleanPath = cleanPath.trim();

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath
    : `/${cleanPath}`;
  const finalUrl = `http://localhost:3000${normalizedPath}`;

  return finalUrl;
};
