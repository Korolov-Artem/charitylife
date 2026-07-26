import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A cover image that refuses to lie about its subject.
 *
 * Two modes, and which one applies is a question about the *container*, not the
 * picture:
 *
 *   natural — the slot has no opinion about its own shape (cards in a grid).
 *             The image's proportions set the box, so nothing is ever cropped
 *             and there is never a margin to explain. This is what a magazine
 *             grid actually does: images keep their shape, the grid accommodates.
 *
 *   fill    — the slot's dimensions are load-bearing (a 100vh hero panel, a
 *             full-bleed band). The image must cover it, so it crops — but
 *             centred on the busiest region of the picture rather than its
 *             geometric middle.
 *
 * There is deliberately no letterbox mode. Floating an image inside a
 * hard-edged box of a different shape reads as a failed load, however the
 * margin is coloured — in print the margin *is* the page, and that continuity
 * is the whole effect. Where an extreme panorama meets a tall slot, `fill`
 * takes the severe crop and `natural` clamps the box instead.
 *
 * Pixel analysis needs an untainted canvas. Same-origin and CORS-enabled images
 * qualify; anything else falls back to a slightly-above-centre crop, which is
 * where subjects sit in most photography.
 */

const SAMPLE = 32;
const DEFAULT_FOCUS = { x: 0.5, y: 0.42 };

// Bounds on how eccentric a card is allowed to get. Everything in a normal
// photographic range passes through untouched; only a true panorama or a tower
// is reined in, and only enough to keep the grid readable.
const MIN_CARD_ASPECT = 0.66;
const MAX_CARD_ASPECT = 2.0;

// Shape of the box before the image reports its own, chosen to be the least
// disruptive placeholder in a portrait-leaning archive.
const PLACEHOLDER_ASPECT = 0.8;

// How far the crop is allowed to chase the focal point. Undamped, a subject at
// 61% across slams the window flush to one edge, which centres the subject but
// looks like the framing slipped. Pulling back toward centre keeps the subject
// in frame while the composition stays balanced.
const FOCUS_DAMPING = 0.65;

const damp = (v: number) => 0.5 + (v - 0.5) * FOCUS_DAMPING;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

type Focus = { x: number; y: number };

/** Energy-weighted centroid of the picture: where the subject probably is. */
const findFocus = (img: HTMLImageElement): Focus => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE;
    canvas.height = SAMPLE;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return DEFAULT_FOCUS;

    ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
    // Throws on a tainted canvas — i.e. a cross-origin image without CORS.
    const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);

    const luma = new Float32Array(SAMPLE * SAMPLE);
    const sat = new Float32Array(SAMPLE * SAMPLE);

    for (let i = 0; i < SAMPLE * SAMPLE; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      luma[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sat[i] = Math.max(r, g, b) - Math.min(r, g, b);
    }

    // Energy = local contrast + colourfulness. Both track "something is
    // happening here" far better than raw brightness does.
    let totalWeight = 0;
    let sumX = 0;
    let sumY = 0;

    for (let y = 1; y < SAMPLE - 1; y++) {
      for (let x = 1; x < SAMPLE - 1; x++) {
        const i = y * SAMPLE + x;
        const dx = Math.abs(luma[i + 1] - luma[i - 1]);
        const dy = Math.abs(luma[i + SAMPLE] - luma[i - SAMPLE]);
        const energy = dx + dy + sat[i] * 0.35;

        // Squared, so a few strong regions outvote a broad wash of texture.
        const weight = energy * energy;
        totalWeight += weight;
        sumX += weight * (x + 0.5);
        sumY += weight * (y + 0.5);
      }
    }

    if (totalWeight <= 0) return DEFAULT_FOCUS;

    return {
      x: clamp(sumX / totalWeight / SAMPLE, 0, 1),
      y: clamp(sumY / totalWeight / SAMPLE, 0, 1),
    };
  } catch {
    return DEFAULT_FOCUS;
  }
};

type Props = {
  src: string;
  alt?: string;
  /** Extra classes for the <img> itself, e.g. hover transforms. */
  imgClassName?: string;
  /**
   * "natural" (default) lets the image set the box's proportions — correct for
   * cards. "fill" makes the image cover a box whose size is already decided.
   */
  mode?: "natural" | "fill";
};

const EditorialImage = ({ src, alt = "", imgClassName = "", mode = "natural" }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [focus, setFocus] = useState<Focus>(DEFAULT_FOCUS);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);

  // crossOrigin is what makes the canvas readable, but on a host that sends no
  // Access-Control-Allow-Origin it fails the *load* outright rather than merely
  // tainting — which would blank every externally-hosted cover. So: ask for it,
  // and if the request dies, remount without it and forgo the analysis.
  const [anonymous, setAnonymous] = useState(true);

  const onLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setFocus(findFocus(img));
    setReady(true);
  }, []);

  // A cached image can finish loading before this effect attaches the handler.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) onLoad();
  }, [onLoad, src]);

  useEffect(() => {
    if (mode !== "fill") return;
    const el = boxRef.current;
    if (!el) return;

    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  const imageAspect = natural && natural.h > 0 ? natural.w / natural.h : null;

  // In natural mode the box takes the picture's shape, so the only crop that can
  // occur is the one the clamp introduces at the extremes.
  const cardAspect =
    imageAspect === null
      ? PLACEHOLDER_ASPECT
      : clamp(imageAspect, MIN_CARD_ASPECT, MAX_CARD_ASPECT);

  const boxAspect =
    mode === "fill" ? (box && box.h > 0 ? box.w / box.h : null) : cardAspect;

  let objectPosition = "50% 42%";

  if (imageAspect !== null && boxAspect !== null) {
    const visible =
      imageAspect > boxAspect ? boxAspect / imageAspect : imageAspect / boxAspect;

    if (visible < 1) {
      if (imageAspect > boxAspect) {
        // Overflow is horizontal: slide the window to sit on the focal point.
        const left = clamp(damp(focus.x) - visible / 2, 0, 1 - visible);
        objectPosition = `${(left / (1 - visible)) * 100}% 50%`;
      } else {
        const top = clamp(damp(focus.y) - visible / 2, 0, 1 - visible);
        objectPosition = `50% ${(top / (1 - visible)) * 100}%`;
      }
    } else {
      objectPosition = "50% 50%";
    }
  }

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden bg-[#eceae6] ${
        mode === "fill" ? "w-full h-full" : "w-full"
      }`}
      style={mode === "fill" ? undefined : { aspectRatio: String(cardAspect) }}
    >
      <img
        // Remount on fallback: mutating crossOrigin alone won't re-request.
        key={anonymous ? "cors" : "plain"}
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin={anonymous ? "anonymous" : undefined}
        onLoad={onLoad}
        onError={() => (anonymous ? setAnonymous(false) : setReady(true))}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
        style={{ objectPosition }}
      />
    </div>
  );
};

export default EditorialImage;
