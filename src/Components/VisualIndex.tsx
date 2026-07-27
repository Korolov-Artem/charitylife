import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { getImageUrl } from "./getImageUrl.ts";
import { useNavigate } from "react-router-dom";
import { plural } from "../plural.ts";
import { motion } from "framer-motion";
import { ArticleType } from "../types/ArticleType.ts";
import { useMemo } from "react";
import Masonry from "react-masonry-css";
import EditorialImage from "./EditorialImage.tsx";

const extractImagesFromHTML = (htmlContent: string) => {
  if (!htmlContent) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return Array.from(doc.querySelectorAll("img"))
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

const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  768: 1,
};

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";
const GRID = "grid grid-cols-12 gap-x-6 lg:gap-x-10";
const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

type MediaItem = {
  id: string;
  articleId: string;
  src: string;
  title: string;
  theme: string;
};

const VisualIndex = () => {
  const navigate = useNavigate();

  const {
    data: articles,
    isLoading,
    isError,
  } = useGetArticlesQuery({ pgSize: 50 });

  const allMedia = useMemo<MediaItem[]>(() => {
    if (!articles) return [];

    const mediaItems = articles.flatMap((article: ArticleType) => {
      const items: MediaItem[] = [];
      if (article.image) {
        items.push({
          id: `${article.id}-cover`,
          articleId: article.id,
          src: getImageUrl(article.image),
          title: article.title,
          theme: article.theme,
        });
      }

      extractImagesFromHTML(article.content).forEach((imgSrc, index) => {
        items.push({
          id: `${article.id}-embed-${index}`,
          articleId: article.id,
          // getImageUrl passes http/data/blob sources straight through.
          src: getImageUrl(imgSrc),
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
      <div className={`${GUTTER} min-h-screen bg-paper pt-24`}>
        <span className={`${KICKER} text-ink-soft animate-pulse`}>
          Формуємо архів
        </span>
      </div>
    );
  }

  if (isError || !articles) {
    return (
      <div className={`${GUTTER} min-h-screen bg-paper pt-24`}>
        <span className={`${KICKER} text-ink-soft`}>Помилка завантаження архіву</span>
      </div>
    );
  }

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
            <span className={`${KICKER} text-accent`}>Візуальний архів</span>
            <h1 className="mt-5 font-display font-normal leading-[0.92] tracking-[-0.025em] text-[clamp(3rem,9vw,5rem)] lg:text-[clamp(4.5rem,7vw,8rem)]">
              Візуальний покажчик
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0 lg:pb-3">
            <p className="font-serif text-[1.0625rem] lg:text-[1.125rem] leading-[1.6] text-ink-soft text-pretty max-w-[38ch]">
              Усі зображення архіву — з обкладинок і зсередини матеріалів.
            </p>
            <div className="mt-6 pt-4 border-t border-rule">
              <span className={`${KICKER} text-ink-soft tabular-nums`}>
                {allMedia.length} {plural(allMedia.length, "зображення", "зображення", "зображень")}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Captions hang beneath the plate, catalogue-style. No hover wash — it
          covers the one thing the page exists to show. */}
      <div className={`${GUTTER} pt-12 lg:pt-16`}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-6 lg:gap-10"
          columnClassName="bg-clip-padding flex flex-col gap-12 lg:gap-16"
        >
          {allMedia.map((media, index) => (
            <motion.figure
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              key={media.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/${media.articleId}`)}
              data-cursor="read"
            >
              <div className="overflow-hidden">
                <EditorialImage
                  src={media.src}
                  alt={media.title}
                  loading="lazy"
                  imgClassName="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
                />
              </div>

              <figcaption className="mt-3 pt-3 border-t border-rule">
                <div className="flex items-baseline gap-3">
                  <span className={`${KICKER} text-ink-soft tabular-nums shrink-0`}>
                    Fig. {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`${KICKER} text-accent truncate`}>
                    {media.theme || "Редакція"}
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-[0.9375rem] leading-[1.4] text-ink-soft line-clamp-1 group-hover:text-accent transition-colors duration-300">
                  {media.title}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default VisualIndex;
