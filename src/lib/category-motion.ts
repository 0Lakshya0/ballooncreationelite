import type { EmblaCarouselType } from "embla-carousel";

/** Only a real press pauses this row; hover/focus never leave it stuck. */
export function bindCategoryMotion(carousel: EmblaCarouselType): () => void {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let held = false;
  let deadline = 0;
  const clearTimer = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const resume = () => {
    clearTimer();
    if (!media.matches && !document.hidden) carousel.plugins().autoScroll?.play(0);
    else carousel.plugins().autoScroll?.stop();
  };
  const press = () => {
    if (held) {
      // Embla also stops on each additional finger, even after our cap elapsed.
      if (Date.now() >= deadline) resume();
      return;
    }
    held = true;
    deadline = Date.now() + 3000;
    carousel.plugins().autoScroll?.stop();
    timer = setTimeout(resume, 3000);
  };
  const release = () => {
    if (!held) return;
    held = false;
    resume();
  };
  const reInit = () => {
    clearTimer();
    if (held && Date.now() < deadline) {
      carousel.plugins().autoScroll?.stop();
      timer = setTimeout(resume, deadline - Date.now());
    } else resume();
  };
  const visibility = () => {
    if (document.hidden) {
      held = false;
      clearTimer();
      carousel.plugins().autoScroll?.stop();
    } else resume();
  };
  carousel.on("pointerDown", press).on("pointerUp", release).on("reInit", reInit);
  // Includes release outside the strip and cancelled vertical scrolling gestures.
  document.addEventListener("pointerup", release, true);
  document.addEventListener("pointercancel", release, true);
  document.addEventListener("touchend", release, true);
  document.addEventListener("touchcancel", release, true);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("blur", release);
  media.addEventListener("change", reInit);
  return () => {
    clearTimer();
    carousel.off("pointerDown", press).off("pointerUp", release).off("reInit", reInit);
    document.removeEventListener("pointerup", release, true);
    document.removeEventListener("pointercancel", release, true);
    document.removeEventListener("touchend", release, true);
    document.removeEventListener("touchcancel", release, true);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("blur", release);
    media.removeEventListener("change", reInit);
  };
}
