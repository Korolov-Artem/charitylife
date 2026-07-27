import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetArticlesQuery } from "../services/articlesApi";
import { ArticleType } from "../types/ArticleType";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const extractQuotesFromHTML = (htmlContent: string) => {
  if (!htmlContent) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const quotes = Array.from(doc.querySelectorAll("blockquote"));

    return quotes
      .map((q) => q.textContent?.replace(/\s+/g, " ").trim())
      .filter((text) => text && text.length > 20);
  } catch (error) {
    console.error("Failed to parse HTML for quotes:", error);
    return [];
  }
};

const truncateQuote = (text: string, maxLength: number = 180) => {
  if (text.length <= maxLength) return text;
  const lastSpace = text.lastIndexOf(" ", maxLength);
  return lastSpace === -1
    ? text.substring(0, maxLength) + "…"
    : text.substring(0, lastSpace) + "…";
};

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";
const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

type QuoteItem = {
  id: string;
  articleId: string;
  content: string;
  theme: string;
  title: string;
};

/**
 * Scatter for the quotes wall: unbalanced per card, balanced in aggregate.
 *
 * Two anchored left, two right, one centred, with mirrored offsets. Every quote
 * looks placed by hand while the block's centre of mass still lands on the page
 * axis — an odd count across only two anchors can never even out.
 *
 * Offsets and rotation are lg-only; on a phone there is no room to lean.
 */
const PLACEMENTS = [
  { align: "self-start", nudge: "lg:-translate-x-10 lg:-rotate-2" },
  { align: "self-end", nudge: "lg:translate-x-10 lg:rotate-[2.5deg]" },
  { align: "self-center", nudge: "lg:-rotate-1" },
  { align: "self-end", nudge: "lg:translate-x-5 lg:rotate-2" },
  { align: "self-start", nudge: "lg:-translate-x-5 lg:-rotate-[2.5deg]" },
];

const CuratedQuotes = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading } = useGetArticlesQuery({ pgSize: 20 });

  const quoteItems = useMemo(() => {
    if (!articles) return [];

    const items: QuoteItem[] = [];

    articles.forEach((article: ArticleType) => {
      extractQuotesFromHTML(article.content).forEach((quoteText, index) => {
        items.push({
          id: `quote-${article.id}-${index}`,
          articleId: article.id,
          content: truncateQuote(quoteText as string, 180),
          theme: article.theme || "Editorial",
          title: article.title,
        });
      });
    });

    return shuffleArray(items).slice(0, 5);
  }, [articles]);

  if (isLoading || quoteItems.length === 0) return null;

  return (
    // A wall of quotes pinned by hand. The scatter is the point; the only thing
    // that has to be square is the block itself, which `mx-auto` centres.
    <section className={`${GUTTER} pt-20 lg:pt-28 overflow-hidden`}>
      <div className="flex items-center gap-4 pb-12 lg:pb-16">
        <span className={`${KICKER} text-ink-soft`}>Голоси з архіву</span>
        <span aria-hidden className="flex-1 h-px bg-rule" />
      </div>

      <div className="mx-auto w-full max-w-4xl flex flex-col items-center gap-16 lg:gap-24">
        {quoteItems.map((item, index) => {
          const place = PLACEMENTS[index % PLACEMENTS.length];

          return (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(`/${item.articleId}`)}
              data-cursor="read"
              className={`group cursor-pointer w-full sm:w-[26rem] lg:w-[32rem] ${place.align}`}
            >
              {/* The tilt lives here, not on the motion element: framer-motion
                  writes `transform` inline for the entry animation, which would
                  overwrite a Tailwind rotate on the same node.
                  Straightens under the cursor, like picking a card off a wall. */}
              <div
                className={`relative transition-transform duration-500 ease-out lg:group-hover:rotate-0 lg:group-hover:translate-x-0 ${place.nudge}`}
              >
                <span
                  aria-hidden
                  className="absolute -left-1 lg:-left-8 -top-6 lg:-top-8 font-display text-[4rem] lg:text-[6rem] leading-none text-accent/25 select-none pointer-events-none"
                >
                  “
                </span>

                <p className="relative font-serif font-light italic text-[1.375rem] sm:text-[1.625rem] lg:text-[1.875rem] leading-[1.45] tracking-[-0.005em] text-ink text-pretty group-hover:text-accent transition-colors duration-500">
                  {item.content}
                </p>

                <footer className="mt-7 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="w-8 h-px bg-rule transition-all duration-500 group-hover:w-16 group-hover:bg-accent"
                  />
                  <cite className="not-italic flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className={`${KICKER} text-accent`}>{item.theme}</span>
                    <span className="font-serif text-[0.9375rem] text-ink-soft">
                      {item.title}
                    </span>
                  </cite>
                </footer>
              </div>
            </motion.blockquote>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedQuotes;
