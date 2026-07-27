import { useMemo, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetArticleByIdQuery } from "../services/articlesApi";
import { getImageUrl } from "../Components/getImageUrl";
import ArticleOutro from "./ArticleOutro";
import EditorialImage from "./EditorialImage";
import { motion, useScroll, useSpring } from "framer-motion";

// --- THE SPREAD ENGINE ---
const parseSpreadLayout = (htmlContent: string) => {
  if (!htmlContent) return [];

  const cleanHtmlContent = htmlContent.replace(/&nbsp;/g, " ");
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtmlContent, "text/html");

  const rows: { text: string; media: string | null }[] = [];
  let currentTextNode = document.createElement("div");

  Array.from(doc.body.children).forEach((node) => {
    const media = node.tagName === "IMG" ? node : node.querySelector("img, iframe");

    if (media) {
      const src = media.getAttribute("src");
      media.remove();

      if (node.textContent?.trim() || node.innerHTML.replace(/<[^>]*>?/gm, '').trim()) {
        currentTextNode.appendChild(node.cloneNode(true));
      }

      if (src) {
        rows.push({
          text: currentTextNode.innerHTML,
          media: src
        });
        currentTextNode = document.createElement("div");
      }
    } else {
      currentTextNode.appendChild(node.cloneNode(true));
    }
  });

  if (currentTextNode.innerHTML.trim()) {
    rows.push({ text: currentTextNode.innerHTML, media: null });
  }

  return rows.filter(row => row.text.trim() || row.media);
};

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "2-digit" })
    .toUpperCase();

const resolveMedia = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : getImageUrl(src);

// --- THE PROSE STYLESHEET ---
// Body sits at 19px / 1.75 so a 5-column measure still lands at ~62 characters.
// Pull quotes are differentiated by italic, air and hairlines — not by scale.
const PROSE = [
  "font-serif text-ink text-[1.0625rem] sm:text-[1.125rem] lg:text-[1.1875rem]",
  "leading-[1.75] tracking-[0.003em] text-pretty hyphens-auto",

  // paragraphs
  "[&_p]:mb-[1.5em] [&_p:last-child]:mb-0",

  // subheads — display serif for A-heads, sans caps for B-heads
  "[&_h2]:font-display [&_h2]:font-normal [&_h2]:text-[1.875rem] lg:[&_h2]:text-[2.25rem]",
  "[&_h2]:leading-[1.12] [&_h2]:tracking-[-0.015em] [&_h2]:mt-[2.5em] [&_h2]:mb-[0.85em]",
  "[&_h3]:font-sans [&_h3]:text-[0.6875rem] [&_h3]:font-semibold [&_h3]:uppercase",
  "[&_h3]:tracking-[0.22em] [&_h3]:text-ink-soft [&_h3]:mt-[3em] [&_h3]:mb-[1.1em]",

  // inline
  "[&_strong]:font-semibold [&_em]:italic",

  // lists
  "[&_ul]:my-[1.6em] [&_ul]:pl-[1.15em] [&_ol]:my-[1.6em] [&_ol]:pl-[1.15em]",
  "[&_ul>li]:list-disc [&_ol>li]:list-decimal [&_li]:mb-[0.55em] [&_li]:pl-[0.35em]",
  "[&_li]:marker:text-accent",

  // links — the hover belongs inside the arbitrary selector. `hover:[&_a]:…`
  // reads as "when the *container* is hovered, colour every descendant link",
  // which lights up the whole article at once.
  "[&_a]:underline [&_a]:decoration-1 [&_a]:decoration-rule [&_a]:underline-offset-[0.25em]",
  "[&_a:hover]:text-accent [&_a:hover]:decoration-accent [&_a]:transition-colors [&_a]:duration-300",

  // rules & inline media
  "[&_hr]:my-[3em] [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-rule",
  "[&_img]:w-full [&_img]:h-auto [&_img]:my-[2.5em]",

  // pull quotes — 1.2x body, narrower measure, hairlines above and below
  "[&_blockquote]:font-serif [&_blockquote]:font-light [&_blockquote]:italic",
  "[&_blockquote]:text-[1.25rem] lg:[&_blockquote]:text-[1.4375rem]",
  "[&_blockquote]:leading-[1.45] [&_blockquote]:tracking-[-0.005em] [&_blockquote]:text-ink",
  "[&_blockquote]:max-w-[34ch] [&_blockquote]:mx-auto [&_blockquote]:text-center",
  "[&_blockquote]:my-[2.75em] [&_blockquote]:py-[1.35em]",
  "[&_blockquote]:border-x-0 [&_blockquote]:border-y [&_blockquote]:border-rule",
  "[&_blockquote_p]:mb-0",
].join(" ");

// Opening flourish: two-line drop cap + small-caps entry line, first block only.
const OPENING = [
  "[&>p:first-of-type]:first-letter:font-display",
  "[&>p:first-of-type]:first-letter:float-left",
  "[&>p:first-of-type]:first-letter:text-[4.35em]",
  "[&>p:first-of-type]:first-letter:leading-[0.8]",
  "[&>p:first-of-type]:first-letter:mt-[0.02em]",
  "[&>p:first-of-type]:first-letter:mr-[0.06em]",
  "[&>p:first-of-type]:first-letter:text-accent",
  "[&>p:first-of-type]:first-line:uppercase",
  "[&>p:first-of-type]:first-line:tracking-[0.07em]",
].join(" ");

const Kicker = ({ children }: { children: ReactNode }) => (
  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em]">
    {children}
  </span>
);

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading } = useGetArticleByIdQuery(id ?? "");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const layoutRows = useMemo(() => {
    return article ? parseSpreadLayout(article.content) : [];
  }, [article]);

  // Counted off the parsed rows, not the raw HTML: the editor emits &nbsp;
  // between words, so a \s+ split on article.content always yields one "word".
  const readingTime = useMemo(() => {
    const words = layoutRows
      .map((row) => {
        const el = document.createElement("div");
        el.innerHTML = row.text;
        return el.textContent ?? "";
      })
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  }, [layoutRows]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
        Завантаження матеріалу
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="bg-paper min-h-screen font-sans text-ink selection:bg-accent selection:text-paper relative">

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Always home, never history: readers arrive here from search, a shared
          link or a sibling article, and navigate(-1) sends each of them
          somewhere different — or off the site entirely. */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 md:top-8 md:left-8 z-[100] font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-ink bg-paper/80 backdrop-blur-md px-4 py-2.5 border border-rule hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300"
      >
        ← Index
      </button>

      <header className="w-full min-h-[100svh] md:h-screen flex flex-col-reverse md:flex-row border-b border-rule">

        {/* Type side — content anchored bottom-left, never centered */}
        <div className="w-full md:w-1/2 flex flex-col justify-between px-6 py-14 sm:px-10 md:px-12 lg:px-16 xl:px-20 border-t md:border-t-0 md:border-r border-rule flex-1 md:h-full">
          <div className="hidden md:block h-6" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="max-w-[38ch]"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-7 text-ink-soft">
              <Kicker>
                <span className="text-accent">{article.theme || "Editorial"}</span>
              </Kicker>
              <span aria-hidden className="w-6 h-px bg-rule" />
              <Kicker>{readingTime} Min Read</Kicker>
            </div>

            <h1 className="font-display font-normal leading-[0.98] tracking-[-0.02em] text-ink text-balance text-[clamp(2.75rem,7vw,4rem)] lg:text-[clamp(3.5rem,4.6vw,5.25rem)] mb-7">
              {article.title}
            </h1>

            {article.synopsis && (
              <p className="font-serif text-[1.0625rem] lg:text-[1.1875rem] leading-[1.6] text-ink-soft max-w-[46ch] text-pretty">
                {article.synopsis}
              </p>
            )}
          </motion.div>

          <div className="mt-10 md:mt-0 flex items-center justify-between text-ink-soft">
            <Kicker>{formatDate(article.dataPublished)}</Kicker>
            <span aria-hidden className="hidden md:inline-block font-sans text-[10px] tracking-[0.24em] uppercase">
              Гортайте ↓
            </span>
          </div>
        </div>

        {/* Image side */}
        <div className="w-full md:w-1/2 h-[52svh] md:h-full overflow-hidden">
          {article.image && (
            <EditorialImage
              src={getImageUrl(article.image)}
              alt={article.title}
              mode="fill"
            />
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16">
        {layoutRows.map((row, index) => {
          const isFirst = index === 0;
          const mediaRight = index % 2 === 0;

          const body = (
            <div
              className={`${PROSE} ${isFirst ? OPENING : ""}`}
              dangerouslySetInnerHTML={{ __html: row.text }}
            />
          );

          // Text-only movement: one column, centred on the reading measure.
          if (!row.media) {
            return (
              <section
                key={index}
                className="grid grid-cols-12 gap-x-6 lg:gap-x-10 pt-16 lg:pt-28 pb-4 lg:pb-8"
              >
                <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 max-w-[68ch]">
                  {body}
                </div>
              </section>
            );
          }

          // Text + plate: fixed grid lines so every edge lines up down the page.
          return (
            // No items-start here: the figure must stretch to the row height,
            // otherwise its sticky child has no travel.
            <section
              key={index}
              className="grid grid-cols-12 gap-x-6 lg:gap-x-10 pt-16 lg:pt-28 pb-4 lg:pb-8"
            >
              <div
                className={`col-span-12 lg:col-span-5 max-w-[64ch] ${
                  mediaRight ? "lg:col-start-2" : "lg:col-start-7 lg:row-start-1"
                }`}
              >
                {body}
              </div>

              <figure
                className={`col-span-12 mt-12 lg:mt-0 lg:col-span-4 ${
                  mediaRight ? "lg:col-start-8" : "lg:col-start-2 lg:row-start-1"
                }`}
              >
                <div className="lg:sticky lg:top-24">
                  <motion.div
                    initial={{ clipPath: "inset(6% 6% 6% 6%)", opacity: 0.6 }}
                    whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-80px" }}
                    className="w-full overflow-hidden"
                  >
                    <EditorialImage
                      src={resolveMedia(row.media)}
                      imgClassName="transition-transform duration-[1.6s] ease-out hover:scale-[1.04]"
                    />
                  </motion.div>

                  <figcaption className="mt-3 pt-3 border-t border-rule font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    Fig. {String(index + 1).padStart(2, "0")} — {article.theme || "Archive"}
                  </figcaption>
                </div>
              </figure>
            </section>
          );
        })}

        {/* On the reading measure, not the page centre — it belongs to the text
            block it closes. */}
        <section className="grid grid-cols-12 gap-x-6 lg:gap-x-10 pt-14 lg:pt-20">
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4">
            <span aria-hidden className="inline-block w-[0.7em] h-[0.7em] bg-accent align-middle" />
            <span className="sr-only">Кінець статті</span>
          </div>
        </section>
      </main>

      <ArticleOutro article={article} />
    </div>
  );
};

export default ArticleView;
