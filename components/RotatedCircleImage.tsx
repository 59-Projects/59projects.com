"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Tune these directly while previewing (hot reload picks up changes
 * immediately), rather than through frontmatter, since this is still an
 * experiment.
 */
const NUM_CIRCLES = 6;
// Percentages above 50 push the outer ring's diameter past the container's
// shorter side, so it spills off frame and gets cropped by the container's
// own overflow-hidden, rather than staying fully inside the visible box.
const MAX_RADIUS_PERCENT = 95;
// Radius of the smallest, innermost ring. The rings in between are spaced
// evenly between this and MAX_RADIUS_PERCENT, so these two constants set
// the overall scale (how much of the frame the whole set fills, and how
// small the center circle gets) independently of each other.
const MIN_RADIUS_PERCENT = 6;
const TOTAL_ROTATION_DEG = 180;
const CENTER = { x: 50, y: 50 };
// Every ring travels at this same angular speed.
const ROTATION_RATE_DEG_PER_SEC = 45;

/**
 * "toggle": every ring unwinds back to 0deg together, pauses there, then
 * rewinds back up to its own original angle together, pauses, then
 * repeats. A scripted back-and-forth between two resting poses.
 *
 * "gears": every ring starts at 0deg (a whole, unrotated photo), then spins
 * forever, but ring `i` spins `i` times faster than ring 1, like gears of
 * different sizes on the same drivetrain (so the innermost ring, with the
 * highest index, is the fastest). Because every ring's rate is an integer
 * multiple of the same base rate, they all land back on a multiple of
 * 360deg at the same instant: every time ring 1 completes exactly one full
 * turn, ring `i` has completed exactly `i` full turns, and the whole photo
 * reads as "complete" again for a moment before drifting back out of
 * alignment.
 *
 * "gears-2": every ring eases through one full rotation at the same rate,
 * direction alternating ring by ring (innermost clockwise, next ring out
 * counter-clockwise, and so on), then every ring holds still, fully
 * aligned, for a few seconds before easing into the next rotation.
 *
 * "static": no rotation. Every ring just sits at 0deg, so it reads as the
 * plain, whole photo.
 *
 * Add new styles here as they come up, and to STYLE_ORDER below so the
 * switcher button in RotatedCircleSlideshow picks them up.
 *
 * "toggle" is implemented above but left out of STYLE_ORDER for now, out
 * of the switchable lineup but easy to bring back by adding it back to
 * that list.
 */
export type AnimationStyle = "toggle" | "gears" | "gears-2" | "static";
export const STYLE_ORDER: AnimationStyle[] = ["gears", "gears-2", "static"];
export const STYLE_LABELS: Record<AnimationStyle, string> = {
  toggle: "Toggle",
  gears: "Gears",
  "gears-2": "Gears 2",
  static: "Static",
};

// Eases both the start and end of every rotation in the "toggle" style,
// instead of snapping to full speed immediately and stopping abruptly.
// Swap for a custom cubic-bezier for a snappier or softer feel.
const TOGGLE_EASING = "ease-in-out";

interface RotatedCircleImageProps {
  src: string;
  rotationStyle: AnimationStyle;
  className?: string;
}

const angleForRing = (ring: number) =>
  ring * (TOTAL_ROTATION_DEG / NUM_CIRCLES);

/**
 * One full "toggle" cycle: every ring unwinds back to 0deg together, then
 * every ring rewinds back up to its own original angle together, then
 * repeats. Both phases take the same amount of time, since both are
 * bounded by whichever ring travels furthest (ring NUM_CIRCLES, at
 * TOTAL_ROTATION_DEG).
 *
 * `rewoundCount` of `0` means every ring targets 0deg (unwound);
 * `NUM_CIRCLES` means every ring targets its own angle (rewound). Each step
 * lists how long its transition takes to finish, so the next step can be
 * scheduled right after it completes.
 */
const TOGGLE_CYCLE_DURATION_SEC =
  TOTAL_ROTATION_DEG / ROTATION_RATE_DEG_PER_SEC;
const TOGGLE_CYCLE_STEPS: { rewoundCount: number; durationSec: number }[] = [
  { rewoundCount: 0, durationSec: TOGGLE_CYCLE_DURATION_SEC },
  { rewoundCount: NUM_CIRCLES, durationSec: TOGGLE_CYCLE_DURATION_SEC },
];

// Ring 1's spin rate. Ring `i` spins at `i * SPIN_BASE_RATE_DEG_PER_SEC`,
// so this is effectively the rate of the outermost, slowest ring, and also
// the rate at which the whole set re-syncs (every 360 / this-many degrees
// per second, i.e. once per full turn of ring 1).
const SPIN_BASE_RATE_DEG_PER_SEC = 20;

// "gears-2" spends this long easing through one full rotation...
const GEARS_2_ROTATION_DURATION_SEC = 360 / SPIN_BASE_RATE_DEG_PER_SEC;
// ...then holds still, fully aligned, for this long before easing into the
// next rotation.
const GEARS_2_PAUSE_SEC = 2.5;
const GEARS_2_CYCLE_DURATION_MS =
  (GEARS_2_ROTATION_DURATION_SEC + GEARS_2_PAUSE_SEC) * 1000;
// What fraction of the cycle is spent actually rotating vs. paused; this is
// where the pause keyframe sits in the 0..1 offset range below.
const GEARS_2_ROTATION_FRACTION =
  GEARS_2_ROTATION_DURATION_SEC /
  (GEARS_2_ROTATION_DURATION_SEC + GEARS_2_PAUSE_SEC);

/**
 * Stacks the same photo on top of itself as a series of concentric circles,
 * each with its own rotation, all sharing one center point. Since the
 * clip-path circle and the rotation share that same origin, each circle's
 * outline stays fixed on screen while the pixels inside it spin.
 *
 * Each layer is rendered as a square sized to the container's own diagonal
 * (rather than exactly matching the container's rectangle), so that no
 * matter how far it's rotated, its edges never swing inside the visible
 * area. The circle clip is then cut in pixels sized off the container's
 * shorter side, so it reads as a clean mask over a fully-covered photo
 * instead of getting cropped by the layer's own rotating edges.
 */
export function RotatedCircleImage({
  src,
  rotationStyle,
  className,
}: RotatedCircleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const [rewoundCount, setRewoundCount] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const hasSize = width > 0 && height > 0;

  useEffect(() => {
    if (rotationStyle !== "toggle") return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let stepIndex = 0;

    const runStep = () => {
      if (cancelled) return;
      const step = TOGGLE_CYCLE_STEPS[stepIndex];
      setRewoundCount(step.rewoundCount);
      timeoutId = setTimeout(() => {
        stepIndex = (stepIndex + 1) % TOGGLE_CYCLE_STEPS.length;
        runStep();
      }, step.durationSec * 1000);
    };

    // Double rAF so the browser paints the initial rotated state on its own
    // frame first, then the transition to 0deg on the next one actually
    // animates instead of the two states collapsing into a single paint.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        setTransitionsEnabled(true);
        runStep();
      });
      return () => cancelAnimationFrame(raf2);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      clearTimeout(timeoutId);
    };
  }, [rotationStyle]);

  useEffect(() => {
    const isGears = rotationStyle === "gears" || rotationStyle === "gears-2";
    if (!isGears || !hasSize) return;

    const animations = layerRefs.current
      .map((el, ring) => {
        if (!el || ring === 0) return null;

        if (rotationStyle === "gears") {
          const rate = ring * SPIN_BASE_RATE_DEG_PER_SEC;
          const durationMs = (360 / rate) * 1000;
          return el.animate(
            [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
            { duration: durationMs, iterations: Infinity, easing: "linear" }
          );
        }

        // "gears-2": same rate for every ring, direction alternates
        // starting with the innermost ring (highest index) going
        // clockwise. Since every ring shares the same rate, they all land
        // back on a multiple of 360deg (fully aligned) at the same
        // instant regardless of direction, so this eases through one
        // full rotation, holds there once aligned, then eases into the
        // next rotation. The end keyframe (360deg) and the next
        // iteration's start keyframe (0deg) are visually identical, so
        // the loop restarts seamlessly with no visible snap.
        const direction = (NUM_CIRCLES - ring) % 2 === 0 ? 1 : -1;
        return el.animate(
          [
            {
              transform: "rotate(0deg)",
              easing: "ease-in-out",
              offset: 0,
            },
            {
              transform: `rotate(${360 * direction}deg)`,
              offset: GEARS_2_ROTATION_FRACTION,
            },
            {
              transform: `rotate(${360 * direction}deg)`,
              offset: 1,
            },
          ],
          { duration: GEARS_2_CYCLE_DURATION_MS, iterations: Infinity }
        );
      })
      .filter((animation): animation is Animation => animation !== null);

    return () => animations.forEach((animation) => animation.cancel());
  }, [rotationStyle, hasSize]);

  const layers = Array.from({ length: NUM_CIRCLES + 1 }, (_, i) => {
    const angle = i === 0 ? 0 : angleForRing(i);
    // Ring 1 gets MAX_RADIUS_PERCENT, the last ring gets MIN_RADIUS_PERCENT,
    // and everything between is spaced evenly across that range.
    const radiusPercent =
      i === 0
        ? null
        : MAX_RADIUS_PERCENT -
          ((i - 1) / (NUM_CIRCLES - 1)) *
            (MAX_RADIUS_PERCENT - MIN_RADIUS_PERCENT);
    const target = i === 0 ? 0 : i <= rewoundCount ? angle : 0;
    return { i, angle, radiusPercent, target };
  });

  // Diagonal ensures the square fully covers the container at any rotation
  // angle, since a rotating rectangle's silhouette never exceeds a circle
  // whose diameter equals that rectangle's own diagonal.
  const squareSide = hasSize ? Math.ceil(Math.hypot(width, height)) : 0;
  const squareOffsetLeft = hasSize ? (width - squareSide) / 2 : 0;
  const squareOffsetTop = hasSize ? (height - squareSide) / 2 : 0;
  const shorterSide = hasSize ? Math.min(width, height) : 0;

  return (
    <div
      ref={containerRef}
      className={clsx("relative overflow-hidden", className)}
    >
      {hasSize
        ? layers.map(({ i, angle, radiusPercent, target }) => {
            const toggleDurationSec = angle / ROTATION_RATE_DEG_PER_SEC;
            const radiusPx =
              radiusPercent === null
                ? null
                : (radiusPercent / 100) * shorterSide;
            return (
              <div
                key={i}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="absolute"
                style={{
                  left: squareOffsetLeft,
                  top: squareOffsetTop,
                  width: squareSide,
                  height: squareSide,
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transformOrigin: `${CENTER.x}% ${CENTER.y}%`,
                  // For "gears", this is only the pre-JS fallback pose
                  // (everything starts at 0deg); the Web Animations API
                  // call above takes over the actual spinning once mounted.
                  transform: `rotate(${
                    rotationStyle === "toggle"
                      ? transitionsEnabled
                        ? target
                        : angle
                      : 0
                  }deg)`,
                  transition:
                    rotationStyle === "toggle" &&
                    transitionsEnabled &&
                    toggleDurationSec > 0
                      ? `transform ${toggleDurationSec}s ${TOGGLE_EASING}`
                      : undefined,
                  clipPath:
                    radiusPx === null
                      ? undefined
                      : `circle(${radiusPx}px at ${CENTER.x}% ${CENTER.y}%)`,
                  zIndex: i,
                }}
              />
            );
          })
        : null}
    </div>
  );
}
