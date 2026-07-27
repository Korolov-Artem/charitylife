import { useEffect, useState } from "react";
import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { ArticleType } from "../types/ArticleType.ts";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import EditorialImage from "./EditorialImage.tsx";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";
const GRID = "grid grid-cols-12 gap-x-6 lg:gap-x-10";
const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

const AllArticles = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [hasMore, setHasMore] = useState(true);
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
        const newUnique = data.filter(
          (n: ArticleType) => !prev.some((p) => p.id === n.id),
        );
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
    <div className="bg-paper text-ink min-h-screen pb-24">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`${GUTTER} pt-14 lg:pt-20 pb-8 lg:pb-12 border-b border-rule`}
      >
        <div className={`${GRID} items-end`}>
          <div className="col-span-12 lg:col-span-7">
            <span className={`${KICKER} text-accent`}>Editorials</span>
            <h1 className="mt-5 font-display font-normal leading-[0.92] tracking-[-0.025em] text-[clamp(3rem,9vw,5rem)] lg:text-[clamp(4.5rem,7vw,8rem)]">
              The Journal
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0 lg:pb-3">
            <p className="font-serif text-[1.0625rem] lg:text-[1.125rem] leading-[1.6] text-ink-soft text-pretty max-w-[38ch]">
              Every piece in the archive, newest first.
            </p>
            <div className="mt-6 pt-4 border-t border-rule">
              <span className={`${KICKER} text-ink-soft tabular-nums`}>
                {articles.length} {articles.length === 1 ? "Piece" : "Pieces"}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className={GUTTER}>
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="group relative border-b border-rule cursor-pointer"
            onClick={() => navigate(`/${article.id}`)}
            onMouseEnter={() => setHoveredArticleId(article.id)}
            onMouseLeave={() => setHoveredArticleId(null)}
            data-cursor="read"
          >
            <div className={`${GRID} items-baseline py-8 lg:py-10`}>
              <span
                className={`${KICKER} col-span-2 lg:col-span-1 text-ink-soft tabular-nums`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="col-span-10 lg:col-span-2 flex flex-row lg:flex-col gap-2 lg:gap-1.5 min-w-0">
                <span className={`${KICKER} text-ink-soft whitespace-nowrap`}>
                  {formatDate(article.dataPublished)}
                </span>
                <span className={`${KICKER} text-accent truncate`}>
                  {article.theme || "Editorial"}
                </span>
              </div>

              <h2 className="col-span-12 lg:col-span-7 mt-4 lg:mt-0 font-display font-normal text-[2rem] lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.05] tracking-[-0.02em] text-balance group-hover:text-accent transition-colors duration-300 line-clamp-3 break-words">
                {article.title}
              </h2>
            </div>

            {/* The plate rides in from the right margin — no shadow, because a
                shadow would make it float above a page that has none. */}
            <AnimatePresence>
              {hoveredArticleId === article.id && article.image && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-52 xl:w-60 z-10 pointer-events-none"
                >
                  <EditorialImage
                    src={getImageUrl(article.image)}
                    alt={article.title}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div ref={targetRef} className={`${GUTTER} h-32 flex items-center pt-8`}>
        {isFetching && (
          <span className={`${KICKER} text-ink-soft animate-pulse`}>
            Loading ledger
          </span>
        )}
        {!hasMore && articles.length > 0 && (
          <div className="flex items-center gap-4 w-full">
            <span aria-hidden className="w-8 h-[3px] bg-accent" />
            <span className={`${KICKER} text-ink-soft`}>End of Journal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticles;
