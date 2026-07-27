import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useGetArticlesByThemeQuery,
  useGetRandomArticlesQuery,
} from "../services/articlesApi";
import { getImageUrl } from "./getImageUrl";
import EditorialImage from "./EditorialImage";
import { ArticleType } from "../types/ArticleType";

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

type Props = { article: ArticleType };

const ArticleOutro = ({ article }: Props) => {
  const navigate = useNavigate();

  const { data: themeData } = useGetArticlesByThemeQuery(
    { theme: article.theme, page: 1 },
    { skip: !article.theme }
  );

  const themeSiblings: ArticleType[] = useMemo(
    () =>
      (themeData?.articles ?? []).filter(
        (a: ArticleType) => String(a.id) !== String(article.id)
      ),
    [themeData, article.id]
  );

  // Only hit the archive once the theme has genuinely run dry — the pool below
  // ignores this whenever a sibling exists.
  const { data: randomData } = useGetRandomArticlesQuery(
    { limit: 6 },
    { skip: !themeData || themeSiblings.length > 0 }
  );

  // "Next" is the most recent other piece in the theme; the three below it fill
  // the index. Falls back to the random pool once a theme is exhausted.
  const { next, index } = useMemo(() => {
    const pool = themeSiblings.length
      ? themeSiblings
      : ((randomData ?? []) as ArticleType[]).filter(
          (a) => String(a.id) !== String(article.id)
        );

    const byDate = [...pool].sort(
      (a, b) => +new Date(b.dataPublished) - +new Date(a.dataPublished)
    );

    return { next: byDate[0] ?? null, index: byDate.slice(1, 4) };
  }, [themeSiblings, randomData, article.id]);

  // Scroll position is handled globally by <ScrollManager /> in App.tsx.
  const go = (id: string | number) => navigate(`/${id}`);

  // ArticleView sits outside the site shell, so there is no footer underneath to
  // catch the reader — with nothing to turn to, close with a colophon rather
  // than rendering nothing.
  if (!next) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-24 lg:mt-32 border-t border-rule"
      >
        <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
            <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                The archive, so far
              </span>
              <p className="mt-5 font-serif text-[1.25rem] lg:text-[1.5rem] leading-[1.45] text-ink text-pretty max-w-[34ch]">
                This is everything we've published to date. More is being
                written.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 group font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink hover:text-accent transition-colors inline-flex items-center gap-3"
              >
                Return to the front page
                <span
                  aria-hidden
                  className="w-8 h-px bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-accent"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      {/* Mirrors the hero's split spread, so this opens a new spread rather
          than reading as a footer widget. */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => go(next.id)}
        className="group mt-24 lg:mt-32 w-full border-y border-rule flex flex-col-reverse md:flex-row min-h-[70svh] md:h-[78vh] cursor-pointer"
      >
        <div className="w-full md:w-1/2 flex flex-col justify-between px-6 py-12 sm:px-10 md:px-12 lg:px-16 xl:px-20 border-t md:border-t-0 md:border-r border-rule">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            Next{article.theme ? ` in ${article.theme}` : ""}
          </span>

          <div className="max-w-[34ch] py-10 md:py-0">
            <h2 className="font-display font-normal leading-[1.0] tracking-[-0.02em] text-ink text-balance text-[clamp(2.25rem,5vw,3rem)] lg:text-[clamp(2.75rem,3.4vw,4rem)] group-hover:text-accent transition-colors duration-500">
              {next.title}
            </h2>
            {next.synopsis && (
              <p className="mt-5 font-serif text-[1.0625rem] leading-[1.6] text-ink-soft max-w-[44ch] text-pretty">
                {next.synopsis}
              </p>
            )}
          </div>

          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink inline-flex items-center gap-3">
            Continue reading
            <span
              aria-hidden
              className="w-8 h-px bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-accent"
            />
          </span>
        </div>

        <div className="w-full md:w-1/2 h-[38svh] md:h-auto overflow-hidden">
          {next.image && (
            <EditorialImage
              src={getImageUrl(next.image)}
              mode="fill"
              imgClassName="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
            />
          )}
        </div>
      </motion.section>

      {/* Text-only: thumbnails would compete with the spread above and flatten
          it into a row of equal-weight cards. */}
      {index.length > 0 && (
        <section className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 pt-20 lg:pt-28 pb-24 lg:pb-32">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2">
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft pb-6 border-b border-rule">
                More{article.theme ? ` in ${article.theme}` : " from the archive"}
              </h3>

              <ul>
                {index.map((item, i) => (
                  <li key={item.id}>
                    <button
                      onClick={() => go(item.id)}
                      className="group w-full text-left flex items-baseline gap-5 sm:gap-8 py-6 border-b border-rule"
                    >
                      <span className="font-sans text-[10px] font-semibold tracking-[0.18em] text-ink-soft tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[1.375rem] sm:text-[1.75rem] leading-[1.15] text-ink group-hover:text-accent transition-colors duration-300 flex-1 text-balance">
                        {item.title}
                      </span>
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft shrink-0 hidden sm:block">
                        {formatDate(item.dataPublished)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ArticleOutro;
