import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import { ArticleType } from "../types/ArticleType.ts";
import { motion } from "framer-motion";

const formatDate = (dateString: string) => {
  return new Date(dateString)
    .toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const NewArticle = () => {
  const navigate = useNavigate();
  const {
    data: articles,
    isLoading,
    isError,
  } = useGetArticlesQuery({ pgSize: 10 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 pb-16 h-screen">
        <div className="xl:col-span-7 h-[65vh] bg-[#fafafa] animate-pulse"></div>
        <div className="xl:col-span-5 h-[65vh] bg-[#fafafa] animate-pulse"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 font-sans text-sm tracking-widest uppercase text-zinc-500">
        Error loading articles
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <p className="py-10 text-gray-500 font-sans text-sm tracking-widest uppercase">
        No articles found
      </p>
    );
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);

  const handleNavigate = (id: string) => {
    navigate(`/${id}`);
  };

  console.log(
    "ARTICLES:",
    articles,
    "isLoading:",
    isLoading,
    "isError:",
    isError,
  );

  return (
    <motion.div
      key={articles[0].id} // ← forces animation to re-run when data loads
      className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // ← back to always "visible", key handles the reset
    >
      {/* ---------------- LEFT SIDE: MAIN ARTICLE ---------------- */}
      <motion.div
        variants={itemVariants}
        className="xl:col-span-7 flex flex-col pt-4 h-full"
      >
        <h2
          className="text-4xl lg:text-[4rem] font-serif font-normal text-black leading-[1.05] tracking-tight cursor-pointer hover:text-zinc-600 transition-colors duration-300 mb-6 break-words line-clamp-4"
          onClick={() => handleNavigate(mainArticle.id)}
        >
          {mainArticle.title}
        </h2>

        <div
          className="w-full mt-[2.5vh] relative group overflow-hidden cursor-pointer"
          onClick={() => handleNavigate(mainArticle.id)}
        >
          <div className="absolute top-0 left-0 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10 border border-black/15">
            {mainArticle.theme || "Design"}
          </div>

          {mainArticle.image ? (
            <img
              src={getImageUrl(mainArticle.image)}
              alt={mainArticle.title}
              className="w-full aspect-[4/3] lg:h-[65.5vh] object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center">
              <span className="text-zinc-400 font-sans tracking-widest uppercase text-xs">
                No Image
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <hr className="border-t border-black/20 mt-4 mb-3" />
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-black">
            {formatDate(mainArticle.dataPublished)}
          </div>
        </div>
      </motion.div>

      {/* ---------------- RIGHT SIDE: SECONDARY ARTICLES ---------------- */}
      <div className="xl:col-span-5 flex flex-col gap-12 pt-4 h-full">
        {secondaryArticles.map((article: ArticleType) => (
          <motion.div
            variants={itemVariants}
            key={article.id}
            className="flex flex-col h-full"
          >
            <h3
              className="text-2xl lg:text-3xl font-serif font-normal text-black leading-[1.1] cursor-pointer hover:text-zinc-600 transition-colors mb-4 break-words line-clamp-3"
              onClick={() => handleNavigate(article.id)}
            >
              {article.title}
            </h3>

            <div
              className="w-full relative group overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(article.id)}
            >
              <div className="absolute top-0 left-0 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest z-10 border border-black/15">
                {article.theme || "Feature"}
              </div>

              {article.image ? (
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center"></div>
              )}
            </div>

            <div className="mt-auto">
              <hr className="border-t border-black/20 mt-4 mb-3" />
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-black">
                {formatDate(article.dataPublished)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NewArticle;
