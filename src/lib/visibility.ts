/** One shared page observer for existing reveals and the integrated decor scenes. */
const listeners = new Map<Element, Set<(visible: boolean) => void>>();
let observer: IntersectionObserver | undefined;
export function observeVisibility(
  element: Element,
  callback: (visible: boolean) => void,
): () => void {
  if (!("IntersectionObserver" in window)) {
    callback(true);
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        listeners.get(entry.target)?.forEach((fn) => fn(entry.isIntersecting)),
      );
    },
    { threshold: 0, rootMargin: "0px 0px 80px 0px" },
  );
  const callbacks = listeners.get(element) ?? new Set();
  callbacks.add(callback);
  listeners.set(element, callbacks);
  observer.observe(element);
  return () => {
    callbacks.delete(callback);
    if (!callbacks.size) {
      observer?.unobserve(element);
      listeners.delete(element);
    }
    if (!listeners.size) {
      observer?.disconnect();
      observer = undefined;
    }
  };
}
