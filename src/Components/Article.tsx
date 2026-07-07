import { useEffect, useRef } from "react";
import { useGetArticleByIdQuery } from "../services/articlesApi.ts";
import { useParams } from "react-router-dom";
import Suggestions from "./Suggestions.tsx";
import { getImageUrl } from "./getImageUrl.ts";
import { motion } from "framer-motion";

// Converts escaped HTML from the database back into real HTML tags
// AND cleans up invisible non-breaking spaces that break layouts!
const decodeHTML = (html: string) => {
  if (typeof document === "undefined" || !html) return html;

  const txt = document.createElement("textarea");
  txt.innerHTML = html;

  // 1. Extract the raw text from the textarea
  let decodedString = txt.value;

  // 2. Replace all HTML and Unicode non-breaking spaces with standard spaces
  decodedString = decodedString.replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ");

  return decodedString;
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const textFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const topRef = useRef<HTMLDivElement>(null);

  const { data: article, isLoading, isError } = useGetArticleByIdQuery(id);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [id, isLoading]);

  if (isLoading)
    return (
      <div
        ref={topRef}
        className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-xs"
      >
        Loading Article...
      </div>
    );

  if (isError || !article)
    return (
      <div className="h-screen flex items-center justify-center">
        Error loading article.
      </div>
    );

  return (
    <motion.div
      key={id}
      className="bg-[#fafafa] min-h-screen pb-20 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div ref={topRef} className="absolute top-0 w-full h-0" />

      {/* --- ARTICLE HEADER: Author & Date --- */}
      <motion.div
        variants={textFadeUp}
        className="max-w-4xl mx-auto flex justify-between items-end mb-12 border-b border-black/10 pb-6 pt-10 px-6 lg:px-0"
      >
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Written by
          </span>
          <p className="text-sm font-bold uppercase tracking-tight">
            {article.author}
          </p>
        </div>
        <p className="text-sm font-serif italic text-[#BD3900]">
          {new Date(article.dataPublished).toLocaleDateString("uk-UA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* --- TITLE: Centered and Narrow --- */}
      <motion.div
        variants={textFadeUp}
        className="max-w-4xl mx-auto text-center mb-16 px-6 lg:px-0"
      >
        <h1 className="text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tight break-words">
          {article.title}
        </h1>
      </motion.div>

      {/* --- HERO IMAGE: Full Width with Reveal --- */}
      <motion.div
        variants={imageReveal}
        className="w-full aspect-video mb-16 overflow-hidden bg-zinc-100"
      >
        <img
          src={getImageUrl(article.image)}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* --- CAPTION / CREDITS --- */}
      <motion.div
        variants={textFadeUp}
        className="max-w-3xl mx-auto text-center mb-16 px-6 lg:px-0"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Photography by Editorial Archive / Image Credits
        </p>
      </motion.div>

      {/* --- BODY CONTENT: Quill Ready --- */}
      <motion.div
        variants={textFadeUp}
        // ADDED 'w-full' to enforce the container limits.
        // ADDED 'break-words' to safely break stubborn Wikipedia text without chopping normal words.
        className="w-full max-w-3xl mx-auto px-6 text-lg lg:text-xl leading-[1.8] font-light text-zinc-800 break-words
                [&>p]:mb-8

                /* Link styling: Safe hover state so only the hovered link turns black */
                [&_a]:text-[#BD3900] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1 [&_a:hover]:text-black [&_a]:transition-colors

                [&>p:first-of-type]:first-letter:text-7xl [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-[#BD3900]
                [&>img]:w-full [&>img]:my-16 [&>img]:object-cover [&>img]:bg-zinc-100
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#BD3900] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:my-12 [&>blockquote]:text-2xl [&>blockquote]:text-black
                [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:mt-16 [&>h2]:mb-6
                [&>h3]:text-2xl [&>h3]:font-serif [&>h3]:mt-12 [&>h3]:mb-4"
        dangerouslySetInnerHTML={{ __html: decodeHTML(article.content) }}
      />

      {/* --- FOOTER SUGGESTIONS --- */}
      <div className="mt-32">
        <Suggestions theme={article.theme} />
      </div>
    </motion.div>
  );
};

export default Article;
