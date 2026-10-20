export const OPEN_AREAS_EVENT = "bc:open-areas";
export const openAreasDialog = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_AREAS_EVENT));
};
