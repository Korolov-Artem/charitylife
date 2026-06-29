import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetArticlesQuery } from "../services/articlesApi";
import { getImageUrl } from "../Components/getImageUrl";
import { ArticleType } from "../types/ArticleType";
import MediaCarousel from "../Components/MediaCarousel";

const themes = [
  { id: "design", label: "Дизайн", marginClass: "ml-0" },
  { id: "health", label: "Здоровʼя", marginClass: "ml-8" },
  { id: "travel", label: "Подорожі", marginClass: "ml-4" },
  { id: "relationships", label: "Відносини", marginClass: "ml-14" },
  { id: "food", label: "Їжа", marginClass: "ml-6" },
];

const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 1.5 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
};

const FeaturedItem = ({
  article,
  handleNavigate,
}: {
  article: ArticleType;
  handleNavigate: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleNavigate(article.id)}
      className="flex flex-wrap gap-4 cursor-pointer"
    >
      <motion.div
        layout
        initial={false}
        animate={{
          width: isHovered ? "100%" : "5rem",
          height: isHovered ? "180px" : "5rem",
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="shrink-0 overflow-hidden bg-zinc-200"
      >
        {article.image ? (
          <motion.img
            src={getImageUrl(article.image)}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            alt={article.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] uppercase tracking-widest">
            No Image
          </div>
        )}
      </motion.div>

      <motion.div
        layout
        className="flex flex-col justify-center flex-1 min-w-[150px]"
      >
        <motion.h4
          layout
          className="text-sm font-bold leading-snug line-clamp-2 break-all"
          animate={{ color: isHovered ? "#BD3900" : "#000000" }}
          transition={{ duration: 0.3 }}
        >
          {article.title}
        </motion.h4>
        <motion.p
          layout
          className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 truncate"
        >
          {article.theme || "Editorial"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  // 1. ADDED: State to track if the right sidebar is currently being scrolled
  const [isSidebarScrolling, setIsSidebarScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLeftSidebarOpen(isHomePage);
  }, [isHomePage]);

  const { data: articles, isLoading } = useGetArticlesQuery({ pgSize: 10 });
  const featuredArticles = articles ? articles.slice(1) : [];

  const handleNavigate = (id: string) => {
    navigate(`/${id}`);
  };

  const handleThemeNavigate = (themeId: string) => {
    navigate(`/theme/${themeId}`);
  };

  // 2. ADDED: The scroll handler that temporarily locks pointer events
  const handleRightSidebarScroll = () => {
    setIsSidebarScrolling(true);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Unlock pointer events 150ms after the user completely stops scrolling
    scrollTimeout.current = setTimeout(() => {
      setIsSidebarScrolling(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white">
      <div className="max-w-[1600px] mx-auto flex h-screen overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <motion.aside
          initial={false}
          animate={{ width: isLeftSidebarOpen ? 300 : 80 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="relative hidden lg:flex flex-col shrink-0 border-r border-black/105 h-full overflow-hidden bg-[#fafafa] z-30"
        >
          <motion.div
            animate={{
              opacity: !isLeftSidebarOpen ? 1 : 0,
              pointerEvents: !isLeftSidebarOpen ? "auto" : "none",
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 inset-x-0 h-10 flex flex-col items-center justify-center cursor-pointer group z-50"
            onClick={() => setIsLeftSidebarOpen(true)}
          >
            <div className="w-6 h-[2px] bg-black mb-1.5 group-hover:bg-[#BD3900] transition-colors" />
            <div className="w-4 h-[2px] bg-black mb-1.5 group-hover:bg-[#BD3900] transition-colors" />
            <div className="w-6 h-[2px] bg-black group-hover:bg-[#BD3900] transition-colors" />
          </motion.div>

          <div className="w-[300px] pt-8 pl-8 pr-4 h-full flex flex-col justify-between">
            <div>
              <div className="relative h-10 mb-16 flex items-center">
                <motion.div
                  animate={{
                    opacity: isLeftSidebarOpen ? 1 : 0,
                    x: isLeftSidebarOpen ? 0 : -10,
                    pointerEvents: isLeftSidebarOpen ? "auto" : "none",
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-10 flex items-center justify-between pr-4 w-[260px]"
                >
                  <h1
                    className="group text-3xl text-gray-900 font-medium tracking-wider cursor-pointer whitespace-nowrap transition-colors duration-300 hover:text-red-900"
                    onClick={() => navigate("/")}
                  >
                    Charity
                    {/* Fixed a small Tailwind typo here: text-red-[#BD3900] to text-[#BD3900] */}
                    <span className="font-serif italic text-gray-400 transition-colors duration-300 group-hover:text-[#BD3900] mx-2">
                      |
                    </span>
                    Life
                  </h1>

                  {!isHomePage && (
                    <button
                      onClick={() => setIsLeftSidebarOpen(false)}
                      className="text-2xl font-light text-gray-400 hover:text-black transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              </div>

              <motion.div
                animate={{
                  opacity: isLeftSidebarOpen ? 1 : 0,
                  x: isLeftSidebarOpen ? 0 : -20,
                  pointerEvents: isLeftSidebarOpen ? "auto" : "none",
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <motion.nav
                  className="flex flex-col gap-8 mt-[15vh]"
                  variants={navContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {themes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      variants={navItemVariants}
                      className={`${theme.marginClass}`}
                    >
                      <motion.div
                        className="flex items-center cursor-pointer group relative"
                        onClick={() => handleThemeNavigate(theme.id)}
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                      >
                        <motion.div
                          variants={{
                            rest: { width: 0, opacity: 0, left: 0 },
                            hover: { width: 24, opacity: 1, left: -32 },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute h-[2px] bg-[#BD3900]"
                        />
                        <motion.span
                          variants={{
                            rest: { color: "#18181b", x: 0 },
                            hover: { color: "#BD3900", x: 8 },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="text-xl 2xl:text-2xl font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                        >
                          {theme.label}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.nav>
              </motion.div>
            </div>

            <motion.div
              animate={{ opacity: isLeftSidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              {/* 1. All Articles Link (ABOVE the line) */}
              <div
                className="mb-6 flex items-center cursor-pointer group" // Added mb-6 for spacing above the line
                onClick={() => navigate("/allArticles")}
              >
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-[#BD3900] transition-colors duration-300">
                  Browse All Articles ➔
                </span>
              </div>

              {/* 2. Divider Line and Copyright (BELOW the link) */}
              <div className="mr-20 pb-8 border-t border-black/15 pt-8">
                <p className="ml-[1vw] text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  © 2026 Archive
                </p>
              </div>
            </motion.div>
          </div>
        </motion.aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 bg-[#fafafa] overflow-y-auto">
          <motion.header
            initial={false}
            animate={{
              opacity: isHomePage ? 1 : 0,
              height: isHomePage ? "3.5rem" : "0rem",
            }}
            className="border-b-3 border-black/105 flex items-center justify-center bg-[#fafafa] sticky top-0 z-20 overflow-hidden"
          >
            <span className="text-md font-bold uppercase tracking-[0.2em] text-black">
              All Topics
            </span>
          </motion.header>

          <div className="px-6 py-10 lg:px-10">{children}</div>

          {isHomePage && (
            <div className="w-full mt-10 mb-20">
              <h2 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
                Editorial Highlights
              </h2>
              <MediaCarousel />
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <motion.aside
          initial={false}
          animate={{
            width: isHomePage ? 320 : 0,
            opacity: isHomePage ? 1 : 0,
            borderLeftWidth: isHomePage ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="hidden xl:flex flex-col shrink-0 border-black/105 h-full overflow-hidden bg-[#fafafa]"
        >
          {/* 3. ADDED: Changed from standard div to motion.div, added layoutScroll, and onScroll handler */}
          <motion.div
            layoutScroll
            onScroll={handleRightSidebarScroll}
            className="w-[320px] h-full overflow-y-auto no-scrollbar"
          >
            <div className="h-14 sticky top-0 bg-[#fafafa] flex items-center border-b-3 border-black/105 z-10 px-8 mb-6">
              <h3 className="text-md mt-[3vh] pb-[3vh] ml-[5vw] font-bold uppercase tracking-[0.2em] text-black">
                Featured
              </h3>
            </div>

            {/* 4. ADDED: The dynamic pointer-events class based on the scrolling state */}
            <div
              className={`flex flex-col gap-8 px-8 pb-8 transition-all duration-150 ${isSidebarScrolling ? "pointer-events-none" : "pointer-events-auto"}`}
            >
              {isLoading ? (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Loading...
                </p>
              ) : featuredArticles.length > 0 ? (
                featuredArticles.map((article: ArticleType) => (
                  <FeaturedItem
                    key={article.id}
                    article={article}
                    handleNavigate={handleNavigate}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  No featured articles
                </p>
              )}
            </div>
          </motion.div>
        </motion.aside>
      </div>
    </div>
  );
};

export default Layout;
