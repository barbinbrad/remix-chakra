import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { ClientCacheProvider } from "~/theme";

hydrate(
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>,
  document
);
