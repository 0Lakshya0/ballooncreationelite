import { createContext, useContext } from "react";
export const AIConciergeContext = createContext<((question: string) => void) | null>(null);
export const useAIConcierge = () => useContext(AIConciergeContext);
