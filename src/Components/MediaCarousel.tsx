import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRandomArticlesQuery } from "../services/articlesApi";
import { getImageUrl } from "./getImageUrl";
import { ArticleType } from "../types/ArticleType";
import { motion, PanInfo } from "framer-motion";

const MediaCarousel = () => {
  const { data: randomArticles, isLoading } = useGetRandomArticlesQuery({
    limit: 10,
  });
  const articles = randomArticles || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Pauses auto-play if hovered
  useEffect(() => {
    if (articles.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length, isHovered]);

  // --- NEW: THE SWIPE LOGIC ---
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // How many pixels the user must drag to trigger a slide change
    const swipeThreshold = 50;

    if (info.offset.x < -swipeThreshold) {
      // User dragged left -> Go to Next Slide
      setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
    } else if (info.offset.x > swipeThreshold) {
      // User dragged right -> Go to Previous Slide
      setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
    }
  };

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
      // ADDED: touch-pan-y prevents the browser from canceling the drag gesture on mobile
      className="w-full flex flex-col items-center overflow-hidden py-10 touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[450px] lg:h-[600px] flex items-center justify-center">
        {articles.map((article: ArticleType, idx: number) => {
          const total = articles.length;
          let offset = idx - currentIndex;

          if (offset > total / 2) offset -= total;
          else if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          return (
            <motion.div
              key={article.id}
              className="absolute w-[80%] sm:w-[60%] lg:w-[45%] max-w-3xl h-full cursor-grab active:cursor-grabbing"

              // --- NEW: FRAMER MOTION GESTURES ---
              drag="x" // Enables horizontal dragging
              dragConstraints={{ left: 0, right: 0 }} // Snaps back to center
              dragElastic={0.6} // Gives it a nice "heavy" rubber-band resistance
              onDragEnd={handleDragEnd} // Fires our swipe math when they let go

              animate={{
                x: `calc(${offset * 100}% + ${offset * 1.5}rem)`,
                scale: isActive ? 1 : 1 - Math.abs(offset) * 0.1,
                opacity: isVisible ? (isActive ? 1 : 0.6) : 0,
                filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 0.8,
              }}
              onClick={() => {
                // If clicked, navigate. If side card is clicked, bring to center.
                if (isActive) navigate(`/${article.id}`);
                else setCurrentIndex(idx);
              }}
              style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
              {/* --- THE CARD --- */}
              <div className="bg-[#fafafa] h-full flex flex-col pointer-events-none">
                <div className="relative flex-1 overflow-hidden bg-zinc-200">
                  {article.image ? (
                    <img
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isActive ? "hover:scale-105" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-[10px]">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="h-32 px-6 lg:px-12 flex items-center justify-center text-center bg-[#fafafa]">
                  <h3 className="text-2xl lg:text-3xl font-serif text-black leading-tight line-clamp-2 transition-colors group-hover:text-[#BD3900]">
                    {article.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- PAGINATION DOTS --- */}
      <div className="flex gap-2 mt-8 z-20 relative">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="p-3 group outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={`h-[2px] transition-all duration-500 ${
                currentIndex === idx
                  ? "bg-[#BD3900] w-12"
                  : "bg-gray-300 w-6 group-hover:bg-gray-500 group-hover:w-8"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;
