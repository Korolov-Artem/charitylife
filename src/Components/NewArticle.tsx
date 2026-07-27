import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import { ArticleType } from "../types/ArticleType.ts";
import { motion } from "framer-motion";
import EditorialImage from "./EditorialImage";

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
        <div className="xl:col-span-7 h-[600px] bg-[#eceae6] animate-pulse"></div>
        <div className="xl:col-span-5 h-[600px] bg-[#eceae6] animate-pulse"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
        Помилка завантаження
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <p className="py-10 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
        Матеріалів не знайдено
      </p>
    );
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);

  // A 7/5 split with an empty right-hand column reads as a broken page rather
  // than a sparse one. With nothing to put beside the lead, the lead takes the
  // full measure — which is what a debut issue should look like anyway.
  const isSolo = secondaryArticles.length === 0;

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
      data-cursor="read"
    >
      <motion.div
        variants={itemVariants}
        className={`flex flex-col h-full ${isSolo ? "xl:col-span-12" : "xl:col-span-7"}`}
      >
        <div className="mb-6 flex flex-col">
          <h2
            className="font-display text-4xl lg:text-[4rem] font-normal text-ink leading-[1.02] tracking-[-0.02em] text-balance cursor-pointer hover:text-accent transition-colors duration-300 break-words line-clamp-3"
            onClick={() => handleNavigate(mainArticle.id)}
          >
            {mainArticle.title}
          </h2>
        </div>

        <div
          className={`w-full aspect-[4/5] relative group overflow-hidden cursor-pointer ${
            isSolo ? "xl:aspect-[21/9]" : "xl:aspect-[2/3]"
          }`}
          onClick={() => handleNavigate(mainArticle.id)}
        >
          <div className="absolute top-0 left-0 z-10 bg-paper/85 backdrop-blur-sm px-3 py-2 border border-rule font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink">
            {mainArticle.theme || "Design"}
          </div>

          {mainArticle.image ? (
            <div className="absolute inset-0">
              <EditorialImage
                src={getImageUrl(mainArticle.image)}
                alt={mainArticle.title}
                mode="fill"
                imgClassName="group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#eceae6] flex items-center justify-center">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                Без зображення
              </span>
            </div>
          )}
        </div>

        <div className="flex-none h-[60px] mt-6 flex flex-col justify-end">
          <hr className="border-t border-rule mb-3" />
          <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            {formatDate(mainArticle.dataPublished)}
          </div>
        </div>
      </motion.div>

      {!isSolo && (
      <motion.div
        variants={itemVariants}
        className="xl:col-span-5 flex flex-col justify-between h-full"
      >
        {secondaryArticles.map((article: ArticleType, index: number) => (
          <div
            key={article.id}
            className="flex flex-col xl:contents"
          >
            <div className={`mb-6 flex flex-col ${index > 0 ? "xl:mt-12" : ""}`}>
              <h3
                className="font-display text-2xl lg:text-3xl font-normal text-ink leading-[1.08] tracking-[-0.015em] text-balance cursor-pointer hover:text-accent transition-colors break-words line-clamp-3"
                onClick={() => handleNavigate(article.id)}
              >
                {article.title}
              </h3>
            </div>

            <div
              className="w-full aspect-[4/3] xl:aspect-auto xl:flex-1 relative group overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(article.id)}
            >
              <div className="absolute top-0 left-0 z-10 bg-paper/85 backdrop-blur-sm px-2.5 py-1.5 border border-rule font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
                {article.theme || "Feature"}
              </div>

              {article.image ? (
                <div className="absolute inset-0">
                  <EditorialImage
                    src={getImageUrl(article.image)}
                    alt={article.title}
                    mode="fill"
                    imgClassName="group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-[#eceae6] flex items-center justify-center"></div>
              )}
            </div>

            <div className="flex-none h-[60px] mt-6 flex flex-col justify-end">
              <hr className="border-t border-rule mb-3" />
              <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                {formatDate(article.dataPublished)}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      )}
    </motion.div>
  );
};

export default NewArticle;
