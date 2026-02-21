export const getImageUrl = (path: string | undefined) => {
    if (!path) {
        console.log("getImageUrl: No path provided");
        return "";
    }

    console.log("getImageUrl: Original path:", path);

    let cleanPath = path.replace(/&#x2F;/g, "/");
    cleanPath = cleanPath.replace(/"/g, "");
    cleanPath = cleanPath.trim();

    console.log("getImageUrl: Cleaned path:", cleanPath);

    if (cleanPath.startsWith("http")) {
        return cleanPath;
    }

    const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    const finalUrl = `http://localhost:3000${normalizedPath}`;

    console.log("getImageUrl: Final URL:", finalUrl);
    return finalUrl;
}