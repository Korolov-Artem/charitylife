import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRandomArticlesQuery } from "../services/articlesApi";
import { getImageUrl } from "./getImageUrl";
import { ArticleType } from "../types/ArticleType";
import EditorialImage from "./EditorialImage";
import { motion, PanInfo } from "framer-motion";

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

const MediaCarousel = () => {
  const { data: randomArticles, isLoading } = useGetRandomArticlesQuery({
    limit: 10,
  });
  const articles: ArticleType[] = randomArticles || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // A single slide has nowhere to advance to: the timer would just cycle the
  // one card back onto itself, and a lone pagination dot is noise.
  const isStatic = articles.length < 2;

  useEffect(() => {
    if (articles.length < 2 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length, isHovered]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 50;

    if (info.offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
    } else if (info.offset.x > swipeThreshold) {
      setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft animate-pulse">
        Завантаження
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div
      // touch-pan-y prevents the browser from cancelling the drag gesture on mobile
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
              data-cursor="read"
              className={`absolute w-[80%] sm:w-[60%] lg:w-[45%] max-w-3xl h-full ${
                isStatic ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
              }`}
              drag={isStatic ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              // Neighbours stay the same size and stay in colour: a contact sheet,
              // not a coverflow. Only opacity recedes, which is enough to say
              // "there is more of this strip" without the 2008 affordance.
              animate={{
                x: `calc(${offset * 100}% + ${offset * 1.5}rem)`,
                opacity: isVisible ? (isActive ? 1 : 0.45) : 0,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 0.8,
              }}
              onClick={() => {
                if (isActive) navigate(`/${article.id}`);
                else setCurrentIndex(idx);
              }}
              style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
              <div className="group bg-paper h-full flex flex-col pointer-events-none">
                {/* No scrim: nothing is set over the photograph, so darkening it
                    only muddies the picture. */}
                <div className="relative flex-1 overflow-hidden">
                  {article.image ? (
                    <EditorialImage
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      mode="fill"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#eceae6]" />
                  )}
                </div>

                <div className="h-28 pt-4 flex flex-col justify-start border-t border-rule">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                      {article.theme || "Editorial"}
                    </span>
                    <span aria-hidden className="w-5 h-px bg-rule" />
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                      {formatDate(article.dataPublished)}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl lg:text-[1.875rem] font-normal text-ink leading-[1.1] tracking-[-0.015em] text-balance line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={`gap-2 mt-8 z-20 relative ${isStatic ? "hidden" : "flex"}`}>
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="p-3 group outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={`h-px transition-all duration-500 ${
                currentIndex === idx
                  ? "bg-accent w-12"
                  : "bg-rule w-6 group-hover:bg-ink-soft group-hover:w-8"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;
