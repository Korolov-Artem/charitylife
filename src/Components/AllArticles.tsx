import { useEffect, useState } from "react";
import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { ArticleType } from "../types/ArticleType.ts";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import { motion } from "framer-motion";

const AllArticles = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [hasMore, setHasMore] = useState(true);
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
      className="max-w-7xl mx-auto pb-20"
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-6 pt-4">
        <h1 className="text-5xl font-serif tracking-tight text-black">
          All Articles
        </h1>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group cursor-pointer flex flex-col"
            onClick={() => navigate(`/${article.id}`)}
          >
            {/* Image Container with Aspect Ratio and Hover Effect */}
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200 mb-6 shrink-0 relative">
              {article.image ? (
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] uppercase tracking-widest">
                  No Image
                </div>
              )}
            </div>

            {/* Article Info */}
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              {article.theme || "Editorial"}
            </p>
            <h2 className="font-serif text-2xl leading-snug line-clamp-3 group-hover:text-[#BD3900] transition-colors duration-300">
              {article.title}
            </h2>
          </div>
        ))}
      </div>

      {/* INFINITE SCROLL OBSERVER */}
      <div
        ref={targetRef}
        className="h-32 flex items-center justify-center mt-10"
      >
        {isFetching && (
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
            Loading more...
          </p>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            End of Archive
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AllArticles;
