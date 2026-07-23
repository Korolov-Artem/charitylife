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
        <div className="xl:col-span-7 h-[600px] bg-[#fafafa] animate-pulse"></div>
        <div className="xl:col-span-5 h-[600px] bg-[#fafafa] animate-pulse"></div>
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

  return (
    <motion.div
      key={articles[0].id}
      className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ---------------- LEFT SIDE: MAIN ARTICLE ---------------- */}
      <motion.div
        variants={itemVariants}
        // h-full combined with flex-col ensures children distribute naturally from top to bottom
        className="xl:col-span-7 flex flex-col h-full"
      >
        {/* Removed min-height restriction so titles sit naturally at the absolute top */}
        <div className="mb-6 flex flex-col">
          <h2
            className="text-4xl lg:text-[4rem] font-serif font-normal text-black leading-[1.05] tracking-tight cursor-pointer hover:text-zinc-600 transition-colors duration-300 break-words line-clamp-3"
            onClick={() => handleNavigate(mainArticle.id)}
          >
            {mainArticle.title}
          </h2>
        </div>

        <div
          className="w-full aspect-[4/5] xl:aspect-[2/3] relative group overflow-hidden cursor-pointer"
          onClick={() => handleNavigate(mainArticle.id)}
        >
          <div className="absolute top-0 left-0 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10 border border-black/15">
            {mainArticle.theme || "Design"}
          </div>

          {mainArticle.image ? (
            <img
              src={getImageUrl(mainArticle.image)}
              alt={mainArticle.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-zinc-100 flex items-center justify-center">
              <span className="text-zinc-400 font-sans tracking-widest uppercase text-xs">
                No Image
              </span>
            </div>
          )}
        </div>

        <div className="flex-none h-[60px] mt-6 flex flex-col justify-end">
          <hr className="border-t border-black/20 mb-3" />
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-black">
            {formatDate(mainArticle.dataPublished)}
          </div>
        </div>
      </motion.div>

      {/* ---------------- RIGHT SIDE: SECONDARY ARTICLES ---------------- */}
      <motion.div
        variants={itemVariants}
        className="xl:col-span-5 flex flex-col justify-between h-full"
      >
        {secondaryArticles.map((article: ArticleType, index: number) => (
          <div
            key={article.id}
            className="flex flex-col xl:contents"
          >
            {/* Removed forced spacing; top-right article hugs the top edge just like the left side */}
            <div className={`mb-6 flex flex-col ${index > 0 ? "xl:mt-12" : ""}`}>
              <h3
                className="text-2xl lg:text-3xl font-serif font-normal text-black leading-[1.1] cursor-pointer hover:text-zinc-600 transition-colors break-words line-clamp-3"
                onClick={() => handleNavigate(article.id)}
              >
                {article.title}
              </h3>
            </div>

            <div
              className="w-full aspect-[4/3] xl:aspect-auto xl:flex-1 relative group overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(article.id)}
            >
              <div className="absolute top-0 left-0 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest z-10 border border-black/15">
                {article.theme || "Feature"}
              </div>

              {article.image ? (
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-zinc-100 flex items-center justify-center"></div>
              )}
            </div>

            <div className="flex-none h-[60px] mt-6 flex flex-col justify-end">
              <hr className="border-t border-black/20 mb-3" />
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-black">
                {formatDate(article.dataPublished)}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NewArticle;
