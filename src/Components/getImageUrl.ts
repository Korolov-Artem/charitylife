export const getImageUrl = (path: string | undefined) => {
  if (!path) {
    return "";
  }

  let cleanPath = path.replace(/&#x2F;/g, "/");
  cleanPath = cleanPath.replace(/"/g, "");
  cleanPath = cleanPath.trim();

  // Already-resolvable sources pass through untouched. data: and blob: matter
  // here because the editor can inline images, and prefixing a host onto one
  // produces a guaranteed 404 rather than a picture.
  if (
    cleanPath.startsWith("http") ||
    cleanPath.startsWith("data:") ||
    cleanPath.startsWith("blob:")
  ) {
    return cleanPath;
  }

  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath
    : `/${cleanPath}`;
  const finalUrl = `http://localhost:3000${normalizedPath}`;

  return finalUrl;
};
