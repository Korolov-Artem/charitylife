import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NewArticle from "../../Components/NewArticle";
import MediaCarousel from "../../Components/MediaCarousel";
import ActivePoll from "../../Components/ActivePoll";
import CuratedQuotes from "../../Components/CuratedQuotes";
import { useGetArticlesQuery } from "../../services/articlesApi";
import { ArticleType } from "../../types/ArticleType";

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";

const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

const HomePage = () => {
  const navigate = useNavigate();
  const { data: articles } = useGetArticlesQuery({ pgSize: 10 });

  // NewArticle spends the first three; the rest become the back of the book
  // rather than a rail repeating what is already on screen.
  const alsoInside: ArticleType[] = useMemo(
    () => (articles ?? []).slice(3, 9),
    [articles],
  );

  return (
    <div className="pb-8">
      <section className={`${GUTTER} pt-10 lg:pt-14`}>
        <div className="flex items-center gap-4 pb-8">
          <span className={`${KICKER} text-accent`}>Головна</span>
          <span aria-hidden className="flex-1 h-px bg-rule" />
          <span className={`${KICKER} text-ink-soft`}>
            {formatDate(new Date().toISOString())}
          </span>
        </div>

        <NewArticle />
      </section>

      <section className="border-t border-rule pt-12 lg:pt-16">
        <div className={GUTTER}>
          <div className="flex items-center gap-4">
            <span className={`${KICKER} text-ink-soft`}>Вибране</span>
            <span aria-hidden className="flex-1 h-px bg-rule" />
          </div>
        </div>

        <MediaCarousel />
      </section>

      {/* Centred on the grid: a ballot is a symmetric object, and anchoring it
          left reads as a misalignment rather than as intent. */}
      <section className={GUTTER}>
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-6 lg:col-start-4">
            <ActivePoll />
          </div>
        </div>
      </section>

      <CuratedQuotes />

      {/* An index below the fold rather than a rail repeating the grid beside it. */}
      {alsoInside.length > 0 && (
        <section className={`${GUTTER} pt-16 lg:pt-24`}>
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2">
              <h2 className={`${KICKER} text-ink-soft pb-6 border-b border-rule`}>
                Також у цьому випуску
              </h2>

              <ul>
                {alsoInside.map((article, i) => (
                  <li key={article.id}>
                    <button
                      onClick={() => navigate(`/${article.id}`)}
                      data-cursor="read"
                      className="group w-full text-left flex items-baseline gap-5 sm:gap-8 py-6 border-b border-rule"
                    >
                      <span className={`${KICKER} text-ink-soft tabular-nums shrink-0`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1">
                        <span className="block font-display text-[1.375rem] sm:text-[1.75rem] leading-[1.15] text-ink text-balance group-hover:text-accent transition-colors duration-300">
                          {article.title}
                        </span>
                        {article.synopsis && (
                          <span className="mt-2 block font-serif text-[0.9375rem] leading-[1.55] text-ink-soft line-clamp-1">
                            {article.synopsis}
                          </span>
                        )}
                      </span>

                      <span className={`${KICKER} text-ink-soft shrink-0 hidden sm:block`}>
                        {article.theme || "Редакція"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
