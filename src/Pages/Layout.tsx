import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

/**
 * The publication shell.
 *
 * Deliberately not a three-column app frame: fixed rails ate 46% of a 1512px
 * window and pinned the content to a 812px column, which read as a portal
 * rather than a magazine. Navigation is now a masthead that recedes, and the
 * page itself scrolls — so mobile browsers can still collapse their chrome and
 * scroll restoration has a document to restore.
 *
 * No measure is imposed on children. Each page owns its own gutters, which lets
 * a section page run full-bleed and a login form stay narrow.
 */

const themes = [
  { id: "design", label: "Дизайн", indent: "lg:ml-0" },
  { id: "health", label: "Здоровʼя", indent: "lg:ml-16" },
  { id: "travel", label: "Подорожі", indent: "lg:ml-8" },
  { id: "relationships", label: "Відносини", indent: "lg:ml-28" },
  { id: "food", label: "Їжа", indent: "lg:ml-12" },
];

const KICKER =
  "font-sans text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isIndexOpen, setIsIndexOpen] = useState(false);

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const userRole = useSelector((state: any) => state.auth.role);

  // Close the index on navigation, so a chosen section isn't hidden behind it.
  useEffect(() => {
    setIsIndexOpen(false);
  }, [location.pathname]);

  // The overlay covers the page; letting the page scroll underneath it is
  // disorienting and loses the reader's position.
  useEffect(() => {
    if (!isIndexOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isIndexOpen]);

  useEffect(() => {
    if (!isIndexOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsIndexOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isIndexOpen]);

  const go = (path: string) => {
    setIsIndexOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    go("/");
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-paper">
      <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur-md border-b border-rule">
        <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between gap-6">
          <button
            onClick={() => go("/")}
            className="group font-display text-[1.625rem] lg:text-[1.75rem] leading-none text-ink hover:text-accent transition-colors duration-300 whitespace-nowrap"
          >
            Charity
            <span className="font-serif italic text-ink-soft group-hover:text-accent transition-colors duration-300 mx-1.5">
              |
            </span>
            Life
          </button>

          <nav className="flex items-center gap-5 lg:gap-8">
            <button
              onClick={() => go("/allArticles")}
              className={`${KICKER} hidden lg:block text-ink-soft hover:text-accent`}
            >
              Публікації
            </button>
            <button
              onClick={() => go("/archive")}
              className={`${KICKER} hidden lg:block text-ink-soft hover:text-accent`}
            >
              Архів
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className={`${KICKER} hidden sm:block text-ink-soft hover:text-accent`}
              >
                Вийти
              </button>
            ) : (
              <button
                onClick={() => go("/login")}
                className={`${KICKER} hidden sm:block text-ink-soft hover:text-accent`}
              >
                Увійти
              </button>
            )}

            <button
              onClick={() => setIsIndexOpen(true)}
              aria-expanded={isIndexOpen}
              className={`${KICKER} flex items-center gap-2.5 text-ink hover:text-accent`}
            >
              Зміст
              <span aria-hidden className="flex flex-col gap-[3px]">
                <span className="block w-4 h-px bg-current" />
                <span className="block w-4 h-px bg-current" />
              </span>
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isIndexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-paper overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16">
              <div className="h-16 flex items-center justify-between border-b border-rule">
                <span className={`${KICKER} text-ink-soft`}>Зміст</span>
                <button
                  onClick={() => setIsIndexOpen(false)}
                  className={`${KICKER} text-ink hover:text-accent`}
                >
                  Закрити ✕
                </button>
              </div>

              <nav className="py-12 lg:py-16">
                {themes.map((theme, i) => (
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 * i,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={theme.indent}
                  >
                    <button
                      onClick={() => go(`/theme/${theme.id}`)}
                      className="group flex items-center gap-6 py-2 lg:py-3"
                    >
                      <span
                        aria-hidden
                        className="hidden lg:block w-0 group-hover:w-16 h-px bg-accent transition-all duration-500"
                      />
                      <span className="font-display text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] tracking-[-0.02em] text-ink group-hover:text-accent transition-colors duration-300">
                        {theme.label}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-rule py-10 flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-16">
                <div className="flex flex-col items-start gap-3">
                  <span className={`${KICKER} text-ink-soft`}>Розділи</span>
                  <button
                    onClick={() => go("/allArticles")}
                    className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                  >
                    Читати публікації
                  </button>
                  <button
                    onClick={() => go("/archive")}
                    className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                  >
                    Візуальний архів
                  </button>
                </div>

                {userRole === "admin" && (
                  <div className="flex flex-col items-start gap-3">
                    <span className={`${KICKER} text-accent`}>Редакція</span>
                    <button
                      onClick={() => go("/publish")}
                      className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                    >
                      Створити статтю
                    </button>
                    <button
                      onClick={() => go("/publish-poll")}
                      className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                    >
                      Створити опитування
                    </button>
                  </div>
                )}

                <div className="flex flex-col items-start gap-3">
                  <span className={`${KICKER} text-ink-soft`}>Обліковий запис</span>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                    >
                      Вийти
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => go("/login")}
                        className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                      >
                        Увійти
                      </button>
                      <button
                        onClick={() => go("/register")}
                        className="font-serif text-[1.0625rem] text-ink hover:text-accent transition-colors"
                      >
                        Зареєструватися
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-rule py-8">
                <span className={`${KICKER} text-ink-soft`}>© 2026 Архів</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No measure here on purpose — pages set their own gutters. */}
      <main className="w-full">{children}</main>

      <footer className="mt-20 border-t border-rule">
        <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 py-14 lg:py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-12">
            {/* Masthead & standfirst */}
            <div className="col-span-12 lg:col-span-4">
              <button
                onClick={() => go("/")}
                className="group font-display text-[1.625rem] leading-none text-ink hover:text-accent transition-colors duration-300"
              >
                Charity
                <span className="font-serif italic text-ink-soft group-hover:text-accent transition-colors duration-300 mx-1.5">
                  |
                </span>
                Life
              </button>

              <p className="mt-5 font-serif text-[1rem] leading-[1.65] text-ink-soft text-pretty max-w-[34ch]">
                Незалежний редакційний архів про дизайн, здоровʼя, подорожі,
                відносини та їжу — тексти й фотографія, які виходять поволі
                й лишаються назавжди.
              </p>
            </div>

            {/* Розділи */}
            <nav className="col-span-6 lg:col-span-2 lg:col-start-6">
              <h2 className={`${KICKER} text-ink-soft pb-4 border-b border-rule`}>
                Розділи
              </h2>
              <ul className="mt-4 flex flex-col items-start gap-2.5">
                {themes.map((theme) => (
                  <li key={theme.id}>
                    <button
                      onClick={() => go(`/theme/${theme.id}`)}
                      className="font-serif text-[1rem] text-ink hover:text-accent transition-colors duration-300"
                    >
                      {theme.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Читати */}
            <nav className="col-span-6 lg:col-span-2">
              <h2 className={`${KICKER} text-ink-soft pb-4 border-b border-rule`}>
                Читати
              </h2>
              <ul className="mt-4 flex flex-col items-start gap-2.5">
                <li>
                  <button
                    onClick={() => go("/allArticles")}
                    className="font-serif text-[1rem] text-ink hover:text-accent transition-colors duration-300"
                  >
                    Журнал
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => go("/archive")}
                    className="font-serif text-[1rem] text-ink hover:text-accent transition-colors duration-300"
                  >
                    Візуальний покажчик
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => go("/")}
                    className="font-serif text-[1rem] text-ink hover:text-accent transition-colors duration-300"
                  >
                    Головна
                  </button>
                </li>
              </ul>
            </nav>

            {/* Контакти */}
            <div className="col-span-12 lg:col-span-3 lg:col-start-10">
              <h2 className={`${KICKER} text-ink-soft pb-4 border-b border-rule`}>
                Контакти
              </h2>

              <dl className="mt-4 flex flex-col gap-5">
                <div>
                  <dt className={`${KICKER} text-ink-soft`}>Загальні запити</dt>
                  <dd className="mt-1.5">
                    <a
                      href="mailto:info@charitylife.org"
                      className="font-serif text-[1rem] text-ink hover:text-accent underline decoration-1 decoration-rule hover:decoration-accent underline-offset-4 transition-colors duration-300"
                    >
                      info@charitylife.org
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className={`${KICKER} text-ink-soft`}>Цілі та партнерство</dt>
                  <dd className="mt-1.5">
                    <a
                      href="mailto:aims@charitylife.org"
                      className="font-serif text-[1rem] text-ink hover:text-accent underline decoration-1 decoration-rule hover:decoration-accent underline-offset-4 transition-colors duration-300"
                    >
                      aims@charitylife.org
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Foot of the page */}
        <div className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-4">
            <span className={`${KICKER} text-ink-soft`}>
              © 2026 Charity | Life
            </span>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className={`${KICKER} text-ink-soft hover:text-accent`}
            >
              Догори ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
