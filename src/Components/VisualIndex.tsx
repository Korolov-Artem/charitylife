import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { getImageUrl } from "./getImageUrl.ts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArticleType } from "../types/ArticleType.ts";
import { useMemo } from "react";
import Masonry from "react-masonry-css";

const extractImagesFromHTML = (htmlContent: string) => {
  if (!htmlContent) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));
    return images
      .map((img) => img.getAttribute("src"))
      .filter(Boolean) as string[];
  } catch (error) {
    console.error("Failed to parse HTML for images:", error);
    return [];
  }
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 3. Define our responsive breakpoints for the Masonry grid
const breakpointColumnsObj = {
  default: 3, // Massive 4K screens get a max of 3 columns (Huge images!)
  1024: 2, // Standard laptops and tablets get 2 columns
  768: 1, // Mobile phones stay at 1 column
};

const VisualIndex = () => {
  const navigate = useNavigate();

  const {
    data: articles,
    isLoading,
    isError,
  } = useGetArticlesQuery({ pgSize: 50 });

  // 4. Extract and Shuffle Media (Wrapped in useMemo so it only shuffles once per load)
  const allMedia = useMemo(() => {
    if (!articles) return [];

    const mediaItems = articles.flatMap((article: ArticleType) => {
      const items = [];
      if (article.image) {
        items.push({
          id: `${article.id}-cover`,
          articleId: article.id,
          src: getImageUrl(article.image),
          title: article.title,
          theme: article.theme,
        });
      }

      const embeddedImages = extractImagesFromHTML(article.content);
      embeddedImages.forEach((imgSrc, index) => {
        items.push({
          id: `${article.id}-embed-${index}`,
          articleId: article.id,
          src: imgSrc.startsWith("http") ? imgSrc : getImageUrl(imgSrc),
          title: article.title,
          theme: article.theme,
        });
      });
      return items;
    });

    return shuffleArray(mediaItems);
  }, [articles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400">
        Curating Archive...
      </div>
    );
  }

  if (isError || !articles) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        Error loading archive.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 px-6 lg:px-12 font-sans">
      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto mb-16 border-b border-black/10 pb-8">
        <h1 className="text-5xl lg:text-7xl font-serif text-black tracking-tight mb-4">
          Visual Index
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
          An exploration of imagery from the Archive.
        </p>
      </div>

      {/* --- MASONRY GRID --- */}
      <div className="max-w-[1600px] mx-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-6" // Tailwind handles the horizontal gap
          columnClassName="bg-clip-padding flex flex-col gap-6" // Tailwind handles the vertical gap
        >
          {allMedia.map((media, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // Adjusted stagger so they load in much faster
              transition={{
                delay: index * 0.02,
                duration: 0.5,
                ease: "easeOut",
              }}
              key={media.id}
              className="relative group cursor-pointer overflow-hidden bg-zinc-100"
              onClick={() => navigate(`/${media.articleId}`)}
            >
              <img
                src={media.src}
                alt={media.title}
                loading="lazy"
                // w-full with h-auto ensures Pinterest-style variable heights!
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* The Interactive Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD3900] mb-2">
                  {media.theme || "Editorial"}
                </span>
                <h3 className="text-white font-serif text-xl leading-tight line-clamp-3">
                  {media.title}
                </h3>

                <div className="mt-4 flex items-center text-white/70 text-xs font-bold uppercase tracking-widest">
                  <span>Read Story</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    ➔
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default VisualIndex;
