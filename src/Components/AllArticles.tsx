import { useEffect, useState } from "react";
import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { ArticleType } from "../types/ArticleType.ts";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateString: string) => {
  return new Date(dateString)
    .toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
};

const AllArticles = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Track which article is currently being hovered
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);

  const { targetRef, isIntersecting } = useIntersectionObserver();
  const navigate = useNavigate();

  const { data, isFetching } = useGetArticlesQuery({
    pgNumber: pageNumber,
    pgSize: 10,
  });

  useEffect(() => {
    if (!data) return;
    if (data.length === 0) {
      setHasMore(false);
    } else {
      setArticles((prev) => {
        const newUnique = data.filter((n) => !prev.some((p) => p.id === n.id));
        return [...prev, ...newUnique];
      });
    }
  }, [data]);

  useEffect(() => {
    if (isIntersecting && hasMore && !isFetching) {
      setPageNumber((prev) => prev + 1);
    }
  }, [isIntersecting, hasMore, isFetching]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto pb-20 px-6 lg:px-0"
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-6 pt-10">
        <div>
          <h1 className="text-5xl lg:text-6xl font-serif tracking-tight text-black">
            The Journal
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            A chronological ledger of all publications
          </p>
        </div>
      </div>

      {/* TYPOGRAPHIC LEDGER (List View) */}
      <div className="flex flex-col border-t border-black/10">
        {articles.map((article) => (
          <div
            key={article.id}
            // INCREASED vertical padding (py-10 lg:py-12) to give larger text room to breathe
            className="group relative border-b border-black/10 py-10 lg:py-12 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            onClick={() => navigate(`/${article.id}`)}
            onMouseEnter={() => setHoveredArticleId(article.id)}
            onMouseLeave={() => setHoveredArticleId(null)}
          >
            {/* LEFT: Meta Data (Date & Theme) */}
            <div className="md:w-1/4 flex flex-row md:flex-col justify-between md:justify-start gap-2 z-10 min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold whitespace-nowrap">
                {formatDate(article.dataPublished)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#BD3900] font-bold truncate">
                {article.theme || "Editorial"}
              </span>
            </div>

            {/* CENTER: Typography Headline */}
            <div className="md:w-3/4 z-10 min-w-0">
              {/* INCREASED text size to text-4xl lg:text-5xl xl:text-6xl to fill the empty layout space */}
              <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-black leading-tight group-hover:text-gray-500 transition-colors duration-300 pr-12 line-clamp-3 break-words">
                {article.title}
              </h2>
            </div>

            {/* THE MICRO-INTERACTION: Floating Image on Hover */}
            <AnimatePresence>
              {hoveredArticleId === article.id && article.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-48 xl:w-56 aspect-[3/4] z-0 pointer-events-none shadow-2xl"
                >
                  <img
                    src={getImageUrl(article.image)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* INFINITE SCROLL OBSERVER */}
      <div
        ref={targetRef}
        className="h-32 flex items-center justify-center mt-10"
      >
        {isFetching && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 animate-pulse">
            Loading ledger...
          </p>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            End of Journal
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AllArticles;
