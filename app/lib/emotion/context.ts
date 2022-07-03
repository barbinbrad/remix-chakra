import createCache from "@emotion/cache";
import { createContext } from "react";

export interface ServerStyleContextData {
  key: string;
  ids: Array<string>;
  css: string;
}

export function createEmotionCache() {
  return createCache({ key: "css" });
}

export const ServerStyleContext = createContext<
  ServerStyleContextData[] | null
>(null);

export interface ClientStyleContextData {
  reset: () => void;
}

export const ClientStyleContext = createContext<ClientStyleContextData | null>(
  null
);
