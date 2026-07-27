import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetArticlesQuery } from "../services/articlesApi";
import { getImageUrl } from "../Components/getImageUrl";
import { ArticleType } from "../types/ArticleType";
import EditorialImage from "./EditorialImage";
import { motion } from "framer-motion";

const themesMapping: Record<string, string> = {
  design: "Дизайн",
  health: "Здоровʼя",
  travel: "Подорожі",
  relationships: "Відносини",
  food: "Їжа",
};

const standfirsts: Record<string, string> = {
  design: "Objects, spaces and the thinking behind them.",
  health: "The body, the mind, and the long work of keeping both.",
  travel: "Places worth the distance, and what they ask of you.",
  relationships: "The people we choose, and how we hold on to them.",
  food: "What we cook, who we feed, and why it matters.",
};

const formatDate = (dateString: string) =>
  new Date(dateString)
    .toLocaleDateString("uk-UA", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

const GUTTER = "px-6 sm:px-10 lg:px-16";
const GRID = "grid grid-cols-12 gap-x-6 lg:gap-x-10";

/**
 * The page's pacing, as a repeating score rather than a uniform grid. Each entry
 * consumes articles off the front of the list, so the section alternates dense
 * and open, image-led and text-led, instead of restating the same card N times.
 */
type RowKind = "duo" | "bleed" | "offset" | "stack";
const RHYTHM: { kind: RowKind; take: number }[] = [
  { kind: "duo", take: 2 },
  { kind: "bleed", take: 1 },
  { kind: "offset", take: 1 },
  { kind: "stack", take: 3 },
  { kind: "duo", take: 2 },
];

const Kicker = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.24em] ${className}`}>
    {children}
  </span>
);

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const ThemePage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const displayTheme = themeId ? themesMapping[themeId] || themeId : "Theme";
  const { data: articles, isLoading } = useGetArticlesQuery({ pgSize: 100 });

  // Filtered client-side on purpose: the /articles/theme endpoint is
  // case-sensitive, and the archive holds both "design" and "Design".
  const filtered: ArticleType[] = useMemo(() => {
    const wanted = [themeId?.toLowerCase(), displayTheme.toLowerCase()].filter(Boolean);
    return (articles ?? [])
      .filter((a: ArticleType) => wanted.includes((a.theme ?? "").toLowerCase().trim()))
      .sort(
        (a: ArticleType, b: ArticleType) =>
          +new Date(b.dataPublished) - +new Date(a.dataPublished)
      );
  }, [articles, themeId, displayTheme]);

  const lead = filtered[0];
  const rest = useMemo(() => filtered.slice(1), [filtered]);

  const rows = useMemo(() => {
    const out: { kind: RowKind; items: ArticleType[] }[] = [];
    let cursor = 0;
    let step = 0;

    while (cursor < rest.length) {
      const slot = RHYTHM[step % RHYTHM.length];
      const items = rest.slice(cursor, cursor + slot.take);

      if (items.length) {
        // A pattern starved of articles would render as a broken half-row, so
        // short tails collapse to the layout that reads fine with one item.
        const kind: RowKind =
          (slot.kind === "duo" || slot.kind === "stack") && items.length < 2 ? "offset" : slot.kind;
        out.push({ kind, items });
      }

      cursor += slot.take;
      step++;
    }
    return out;
  }, [rest]);

  const go = (id: string | number) => navigate(`/${id}`);

  if (isLoading) {
    return (
      <div className={`${GUTTER} py-32`}>
        <Kicker className="text-ink-soft animate-pulse">Формуємо добірку</Kicker>
      </div>
    );
  }

  return (
    <div className="bg-paper text-ink min-h-screen pb-24 lg:pb-32">
      {/* Set left and bottom-aligned against the standfirst, so this reads as a
          spread opening rather than a centred page title. */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`${GUTTER} pt-14 lg:pt-20 pb-8 lg:pb-12 border-b border-rule`}
      >
        <div className={`${GRID} items-end`}>
          <div className="col-span-12 lg:col-span-7">
            <Kicker className="text-accent">Розділ</Kicker>
            <h1 className="mt-5 font-display font-normal capitalize leading-[0.92] tracking-[-0.025em] text-[clamp(3rem,9vw,5rem)] lg:text-[clamp(4.5rem,7vw,8rem)]">
              {displayTheme}
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0 lg:pb-3">
            <p className="font-serif text-[1.0625rem] lg:text-[1.125rem] leading-[1.6] text-ink-soft text-pretty max-w-[38ch]">
              {(themeId && standfirsts[themeId]) || "Selected work from the archive."}
            </p>
            <div className="mt-6 pt-4 border-t border-rule">
              <Kicker className="text-ink-soft tabular-nums">
                {filtered.length} {filtered.length === 1 ? "Piece" : "Pieces"}
              </Kicker>
            </div>
          </div>
        </div>
      </motion.header>

      {filtered.length === 0 ? (
        <div className={`${GUTTER} py-32 border-b border-rule`}>
          <p className="font-serif italic text-[1.5rem] text-ink-soft max-w-[34ch]">
            У цьому розділі ще нічого немає.
          </p>
        </div>
      ) : (
        <>
          {/* Full-bleed plate, caption hung on the grid beneath it. */}
          {lead && (
            <motion.section
              {...fade}
              onClick={() => go(lead.id)}
              className="group cursor-pointer border-b border-rule"
            >
              <div className="w-full h-[58svh] lg:h-[80svh] overflow-hidden">
                {lead.image && (
                  <EditorialImage
                    src={getImageUrl(lead.image)}
                    alt={lead.title}
                    mode="fill"
                    imgClassName="transition-transform duration-[1.8s] ease-out group-hover:scale-[1.03]"
                  />
                )}
              </div>

              <div className={`${GUTTER} py-10 lg:py-14`}>
                <div className={GRID}>
                  <div className="col-span-12 lg:col-span-6 lg:col-start-2">
                    <Kicker className="text-accent">Головне</Kicker>
                    <h2 className="mt-4 font-display font-normal leading-[1.02] tracking-[-0.02em] text-[clamp(2rem,5vw,2.75rem)] lg:text-[clamp(2.5rem,3.4vw,3.75rem)] text-balance group-hover:text-accent transition-colors duration-500">
                      {lead.title}
                    </h2>
                  </div>

                  <div className="col-span-12 lg:col-span-3 lg:col-start-9 mt-6 lg:mt-2">
                    <p className="font-serif text-[1.0625rem] leading-[1.65] text-ink-soft text-pretty">
                      {lead.synopsis}
                    </p>
                    <div className="mt-5 pt-4 border-t border-rule">
                      <Kicker className="text-ink-soft">{formatDate(lead.dataPublished)}</Kicker>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {rows.map((row, rowIndex) => (
            <Row key={rowIndex} kind={row.kind} items={row.items} index={rowIndex} go={go} />
          ))}
        </>
      )}
    </div>
  );
};

type RowProps = {
  kind: RowKind;
  items: ArticleType[];
  index: number;
  go: (id: string | number) => void;
};

const Row = ({ kind, items, index, go }: RowProps) => {
  // Mirroring on alternate rows keeps the eye moving down the page instead of
  // settling into one column.
  const mirrored = index % 2 === 1;

  if (kind === "bleed") {
    const a = items[0];
    return (
      <motion.section
        {...fade}
        onClick={() => go(a.id)}
        className="group cursor-pointer border-b border-rule"
      >
        <div className="w-full h-[52svh] lg:h-[72svh] overflow-hidden">
          {a.image && (
            <EditorialImage
              src={getImageUrl(a.image)}
              alt={a.title}
              mode="fill"
              imgClassName="transition-transform duration-[1.8s] ease-out group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className={`${GUTTER} py-8 lg:py-12`}>
          <div className={GRID}>
            <div className={`col-span-12 lg:col-span-5 ${mirrored ? "lg:col-start-7" : "lg:col-start-2"}`}>
              <h3 className="font-display font-normal leading-[1.08] tracking-[-0.015em] text-[1.75rem] lg:text-[2.5rem] text-balance group-hover:text-accent transition-colors duration-400">
                {a.title}
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <Kicker className="text-ink-soft">{formatDate(a.dataPublished)}</Kicker>
                <span aria-hidden className="w-8 h-px bg-rule transition-all duration-500 group-hover:w-14 group-hover:bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (kind === "offset") {
    const a = items[0];
    return (
      <motion.section {...fade} className={`${GUTTER} py-16 lg:py-24 border-b border-rule`}>
        <div className={`${GRID} items-center`}>
          <div
            onClick={() => go(a.id)}
            className={`group cursor-pointer col-span-12 lg:col-span-6 ${
              mirrored ? "lg:col-start-6" : "lg:col-start-2"
            }`}
          >
            <div className="w-full overflow-hidden">
              {a.image && (
                <EditorialImage
                  src={getImageUrl(a.image)}
                  alt={a.title}
                  imgClassName="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
                />
              )}
            </div>
          </div>

          <div
            onClick={() => go(a.id)}
            className={`group cursor-pointer col-span-12 lg:col-span-3 mt-6 lg:mt-0 ${
              mirrored ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-9"
            }`}
          >
            <h3 className="font-display font-normal leading-[1.1] tracking-[-0.015em] text-[1.625rem] lg:text-[2.125rem] text-balance group-hover:text-accent transition-colors duration-400">
              {a.title}
            </h3>
            <p className="mt-4 font-serif text-[1rem] leading-[1.65] text-ink-soft text-pretty line-clamp-4">
              {a.synopsis}
            </p>
            <div className="mt-5 pt-4 border-t border-rule">
              <Kicker className="text-ink-soft">{formatDate(a.dataPublished)}</Kicker>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (kind === "stack") {
    // A text-only run after an image spread: the pacing contrast that stops a
    // long section from reading as one undifferentiated wall of pictures.
    return (
      <motion.section {...fade} className={`${GUTTER} py-14 lg:py-20 border-b border-rule`}>
        <div className={GRID}>
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Kicker className="text-ink-soft pb-5 block border-b border-rule">Також у цьому розділі</Kicker>
            <ul>
              {items.map((a, i) => (
                <li key={a.id}>
                  <button
                    onClick={() => go(a.id)}
                    className="group w-full text-left flex items-baseline gap-5 sm:gap-8 py-6 border-b border-rule"
                  >
                    <span className="font-sans text-[10px] font-semibold tracking-[0.18em] text-ink-soft tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[1.375rem] sm:text-[1.75rem] leading-[1.15] text-balance group-hover:text-accent transition-colors duration-300">
                        {a.title}
                      </span>
                      <span className="mt-2 block font-serif text-[0.9375rem] leading-[1.55] text-ink-soft line-clamp-1">
                        {a.synopsis}
                      </span>
                    </span>
                    <Kicker className="text-ink-soft shrink-0 hidden sm:block">
                      {formatDate(a.dataPublished)}
                    </Kicker>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    );
  }

  // duo — deliberately unequal, and the smaller plate drops down the page so the
  // white space between them does some work.
  const [first, second] = items;
  return (
    <motion.section {...fade} className={`${GUTTER} py-16 lg:py-24 border-b border-rule`}>
      <div className={GRID}>
        <div
          onClick={() => go(first.id)}
          className={`group cursor-pointer col-span-12 lg:col-span-6 ${
            mirrored ? "lg:col-start-7" : "lg:col-start-1"
          }`}
        >
          <div className="w-full overflow-hidden">
            {first.image && (
              <EditorialImage
                src={getImageUrl(first.image)}
                alt={first.title}
                imgClassName="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
              />
            )}
          </div>
          <h3 className="mt-6 font-display font-normal leading-[1.1] tracking-[-0.015em] text-[1.625rem] lg:text-[2.25rem] text-balance max-w-[22ch] group-hover:text-accent transition-colors duration-400">
            {first.title}
          </h3>
          <div className="mt-4">
            <Kicker className="text-ink-soft">{formatDate(first.dataPublished)}</Kicker>
          </div>
        </div>

        {second && (
          <div
            onClick={() => go(second.id)}
            className={`group cursor-pointer col-span-12 lg:col-span-4 mt-12 lg:mt-28 ${
              mirrored ? "lg:col-start-2" : "lg:col-start-8"
            }`}
          >
            <div className="w-full overflow-hidden">
              {second.image && (
                <EditorialImage
                  src={getImageUrl(second.image)}
                  alt={second.title}
                  imgClassName="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
                />
              )}
            </div>
            <h3 className="mt-5 font-display font-normal leading-[1.12] tracking-[-0.01em] text-[1.375rem] lg:text-[1.75rem] text-balance max-w-[24ch] group-hover:text-accent transition-colors duration-400">
              {second.title}
            </h3>
            <div className="mt-3">
              <Kicker className="text-ink-soft">{formatDate(second.dataPublished)}</Kicker>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ThemePage;
