import { useGetArticlesByThemeQuery, useGetArticlesQuery } from "../services/articlesApi.ts";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";
import { motion } from "framer-motion";

// --- Editorial Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const Suggestions = ({ theme }: { theme: string }) => {
  const navigate = useNavigate();
  const { id: currentId } = useParams<{ id: string }>();

  // 1. Fetch theme articles (Safely encoding Cyrillic characters for the URL)
  const { data: themeData, isLoading: themeLoading } = useGetArticlesByThemeQuery({
    theme: encodeURIComponent(theme || ""),
    page: 1,
  });

  // 2. Fetch generic fallback articles in parallel to guarantee we always have content
  const { data: fallbackData, isLoading: fallbackLoading } = useGetArticlesQuery({
    pgSize: 5,
  });

  if (themeLoading || fallbackLoading) return null;

  // 3. Safely extract arrays (handles different backend pagination structures like .items or .data)
  const rawTheme = Array.isArray(themeData) ? themeData : themeData?.items || themeData?.data || [];
  const rawFallback = Array.isArray(fallbackData) ? fallbackData : fallbackData?.items || fallbackData?.data || [];

  // 4. Filter out the currently viewed article from both lists so we don't suggest what they just read
  const themeSuggested = rawTheme.filter((a: any) => String(a.id) !== String(currentId));
  const fallbackSuggested = rawFallback.filter((a: any) => String(a.id) !== String(currentId));

  // 5. Smart Merge: Prioritize theme articles, fill any empty slots with fallbacks
  const finalSuggestions = [...themeSuggested];
  if (finalSuggestions.length < 3) {
    const needed = 3 - finalSuggestions.length;
    // Only borrow fallback articles that aren't already in the theme list
    const uniqueFallbacks = fallbackSuggested.filter(
      (fallbackItem: any) => !finalSuggestions.some(themeItem => themeItem.id === fallbackItem.id)
    );
    finalSuggestions.push(...uniqueFallbacks.slice(0, needed));
  }

  // Slice to exactly 3 for the UI grid
  const displayArticles = finalSuggestions.slice(0, 3);

  // Only hide the section if the ENTIRE database has no articles left
  if (displayArticles.length === 0) return null;

  return (
    <section className="bg-[#BD3900] py-32 shadow-[0_0_0_100vmax_#BD3900] [clip-path:inset(0_-100vmax)] mb-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-[#fafafa] text-[10px] font-bold uppercase tracking-[0.4em] whitespace-nowrap">
            Read Next
          </h2>
          <div className="h-[1px] w-full bg-[#fafafa]/20" />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {displayArticles.map((item: any) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group cursor-pointer block"
              onClick={() => navigate(`/${item.id}`)}
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-black/20 mb-8 relative transform-gpu">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.2s] ease-out group-hover:scale-105 will-change-transform"
                />
              </div>

              <div className="relative">
                <h3 className="text-[#fafafa] text-2xl xl:text-3xl font-serif leading-tight line-clamp-3">
                  {item.title}
                </h3>

                <span className="block h-[1px] w-0 bg-[#fafafa] mt-6 transition-all duration-500 ease-out group-hover:w-full" />

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/50 group-hover:text-[#fafafa] transition-colors duration-500">
                  Read Editorial ➔
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Suggestions;
