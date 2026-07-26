import React, { useMemo } from "react";
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

const truncateQuote = (text: string, maxLength: number = 160) => {
  if (text.length <= maxLength) return text;

  const lastSpace = text.lastIndexOf(" ", maxLength);

  if (lastSpace === -1) {
    return text.substring(0, maxLength) + "…";
  }

  return text.substring(0, lastSpace) + "…";
};

// Adjusted margins so they don't push the boxes off mobile screens!
const chaosCoordinates = [
  "self-start ml-2 lg:ml-12 rotate-[-3deg]",
  "self-center ml-4 lg:ml-24 rotate-[2deg]",
  "self-end mr-2 lg:mr-16 rotate-[-4deg]",
  "self-start ml-6 lg:ml-20 rotate-[4deg]",
  "self-end mr-4 lg:mr-12 rotate-[-2deg]",
  "self-center mr-2 lg:mr-24 rotate-[3deg]",
];

type QuoteItem = {
  id: string;
  articleId: string;
  content: string;
  theme: string;
  title: string;
};

const CuratedQuotes = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading } = useGetArticlesQuery({ pgSize: 20 });

  const quoteItems = useMemo(() => {
    if (!articles) return [];

    const items: QuoteItem[] = [];

    articles.forEach((article: ArticleType) => {
      const extractedQuotes = extractQuotesFromHTML(article.content);

      extractedQuotes.forEach((quoteText, index) => {
        items.push({
          id: `quote-${article.id}-${index}`,
          articleId: article.id,
          content: truncateQuote(quoteText as string, 160),
          theme: article.theme || "Editorial",
          title: article.title,
        });
      });
    });

    return shuffleArray(items).slice(0, 6);
  }, [articles]);

  if (isLoading || quoteItems.length === 0) return null;

  return (
    <div className="w-full mt-32 mb-20 overflow-hidden px-4">
      <div className="mb-20 text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Voices from the Archive
        </h2>
        <div className="w-px h-16 bg-black/20 mx-auto mt-6"></div>
      </div>

      <div className="flex flex-col gap-16 lg:gap-24 relative max-w-4xl mx-auto">
        {quoteItems.map((item, index) => {
          const placementStyle =
            chaosCoordinates[index % chaosCoordinates.length];

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              key={item.id}
              onClick={() => navigate(`/${item.articleId}`)}
              data-cursor="read"
              className={`group cursor-pointer w-[85vw] sm:w-[450px] lg:w-[550px] shrink-0 z-10 hover:z-50 transition-all duration-300 ${placementStyle}`}
            >
              <div className="relative w-full">
                {/* 2. STRICT WRAP: whitespace-pre-wrap physically forces line breaks inside the hardcoded width */}
                <p className="font-serif text-xl lg:text-2xl italic leading-[1.8] lg:leading-[1.8] tracking-wide break-words w-full block">
                  <span className="inline bg-[#E5E5E5] text-[#111827] px-2 py-1 lg:px-3 lg:py-1 box-decoration-clone group-hover:bg-[#18181b] group-hover:text-white transition-colors duration-500 shadow-[2px_2px_12px_rgba(0,0,0,0.06)]">
                    "{item.content}"
                  </span>
                </p>

                {/* Fixed the tape metadata so it doesn't overflow horizontally either */}
                <div className="mt-5 transform translate-x-2 lg:translate-x-8 rotate-[2deg] group-hover:rotate-0 transition-transform duration-500 w-full">
                  <span className="inline-block bg-[#18181b] text-white px-3 py-1.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm group-hover:bg-[#BD3900] transition-colors max-w-[90%] truncate">
                    {item.theme} <span className="mx-2 text-white/40">|</span>{" "}
                    {item.title} <span className="ml-2">➔</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CuratedQuotes;
