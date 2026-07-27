import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll behaviour for a non-data router.
 *
 * React Router ships <ScrollRestoration>, but only for createBrowserRouter.
 * We're on <BrowserRouter>, so this covers the same ground:
 *
 *   PUSH / REPLACE  → top of the new page
 *   POP (back/fwd)  → the offset the reader left that entry at
 *
 * Positions are keyed by location.key and kept in sessionStorage, so they
 * survive a reload but never leak between tabs.
 */

const STORAGE_KEY = "scrollPositions";
const RESTORE_TIMEOUT_MS = 1500;

type Positions = Record<string, number>;

const readPositions = (): Positions => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Positions) : {};
  } catch {
    return {};
  }
};

const writePosition = (key: string, y: number) => {
  try {
    const all = readPositions();
    all[key] = y;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Private mode or quota. Restoration is a nicety — never fail the app for it.
  }
};

type Props = {
  /**
   * "auto" (default) jumps. "smooth" animates, which on a route change means
   * animating through the *incoming* page's content — fine for same-page moves,
   * usually wrong for navigation.
   */
  behavior?: ScrollBehavior;
};

const ScrollManager = ({ behavior = "auto" }: Props) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const activeKey = useRef(location.key);
  const lastY = useRef(0);

  // Take ownership of scroll position; the browser's own guess fights our restore.
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Tracking is a bare ref assignment, so there is nothing to throttle. Writes
  // are flushed on pagehide/visibilitychange rather than rAF, which is suspended
  // in a hidden document and would lose anyone backgrounding the tab mid-article.
  useEffect(() => {
    const onScroll = () => {
      lastY.current = window.scrollY;
    };
    const flush = () => writePosition(activeKey.current, lastY.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
      flush();
    };
  }, []);

  // useLayoutEffect, not useEffect: this runs before paint, so the reader never
  // sees a frame of the new page rendered at the old scroll offset.
  useLayoutEffect(() => {
    // Bank the outgoing entry from lastY, not window.scrollY: the incoming DOM
    // has already committed, and if it is shorter the browser has clamped the
    // live position. Retargeting activeKey immediately keeps a scroll event
    // fired by that clamp from corrupting the entry we just left.
    if (activeKey.current !== location.key) {
      writePosition(activeKey.current, lastY.current || window.scrollY);
      activeKey.current = location.key;
      lastY.current = 0;
    }

    const saved = navigationType === "POP" ? readPositions()[location.key] : undefined;
    const target = saved ?? 0;

    if (target === 0) {
      window.scrollTo({ top: 0, left: 0, behavior });
      return;
    }

    // The restored page's content may still be in flight, leaving the document
    // too short to reach the saved offset. Re-attempt as it grows, then stop.
    let cancelled = false;
    const deadline = Date.now() + RESTORE_TIMEOUT_MS;

    const attempt = () => {
      if (cancelled) return;

      const reachable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      window.scrollTo({ top: Math.min(target, reachable), left: 0, behavior: "auto" });

      if (window.scrollY < target - 1 && Date.now() < deadline) {
        requestAnimationFrame(attempt);
      }
    };

    attempt();
    return () => {
      cancelled = true;
    };
  }, [location.key, navigationType, behavior]);

  return null;
};

export default ScrollManager;
