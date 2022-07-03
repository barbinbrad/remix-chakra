import { useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ClientStyleContext } from "./StylesContext";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

export default function ClientCacheProvider({
  children,
}: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

function createEmotionCache() {
  return createCache({ key: "css" });
}
