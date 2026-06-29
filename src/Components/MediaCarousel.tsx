import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRandomArticlesQuery } from "../services/articlesApi";
import { getImageUrl } from "./getImageUrl";
import { ArticleType } from "../types/ArticleType";
import { motion } from "framer-motion";

const MediaCarousel = () => {
  const { data: randomArticles, isLoading } = useGetRandomArticlesQuery({
    limit: 10,
  });
  const articles = randomArticles || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (articles.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length, isHovered]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Loading Highlights...
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div
      className="w-full flex flex-col items-center overflow-hidden py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- SLIDER VIEWPORT --- */}
      <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
        {articles.map((article: ArticleType, idx: number) => {
          const total = articles.length;
          let offset = idx - currentIndex;

          if (offset > total / 2) offset -= total;
          else if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          return (
            <motion.div
              key={article.id}
              className="absolute w-[80%] sm:w-[60%] lg:w-[45%] max-w-2xl h-full cursor-pointer"
              animate={{
                // Pushes side cards exactly outside the center card with a clean 5% gap
                x: `${offset * 105}%`,
                // REMOVED: scale logic. The cards are now all perfectly flat.
                scale: 1,
                opacity: isVisible ? (isActive ? 1 : 0.3) : 0,
                // ADDED: Grayscale to side items to match your site's hover theme!
                filter: isActive
                  ? "grayscale(0%) blur(0px)"
                  : "grayscale(100%) blur(1px)",
                zIndex: isActive ? 10 : 5,
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                if (isActive) navigate(`/${article.id}`);
                else setCurrentIndex(idx);
              }}
              style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
              {/* --- THE CARD --- */}
              {/* REMOVED: rounded-2xl, shadow-xl, border. Added matching bg-[#fafafa] */}
              <div className="bg-[#fafafa] h-full flex flex-col">
                {/* Image Container - Sharp corners */}
                <div className="relative flex-1 overflow-hidden bg-zinc-100">
                  {article.image ? (
                    <img
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-[10px]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Title Container - bg matches the layout background */}
                <div className="h-28 px-6 lg:px-10 flex items-center justify-center text-center bg-[#fafafa]">
                  <h3 className="text-xl lg:text-2xl font-serif text-black leading-snug line-clamp-2 transition-colors hover:text-[#BD3900]">
                    {article.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- PAGINATION DOTS --- */}
      <div className="flex gap-1 mt-8 z-20 relative">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="p-3 group outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* Swapped rounded circles for flat, sharp lines to match the editorial vibe */}
            <div
              className={`h-1 transition-all duration-500 ${
                currentIndex === idx
                  ? "bg-[#BD3900] w-12"
                  : "bg-gray-300 w-6 group-hover:bg-gray-400 group-hover:w-8"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;
