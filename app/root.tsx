import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import type { LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { useContext, useEffect } from "react";
import Navigation from "~/components/Navigation";
import { ClientStyleContext, ServerStyleContext } from "~/lib/emotion/context";
import { ChakraThemeProvider, Mode } from "~/lib/theme";
import { getColorModeSession } from "~/lib/theme/theme.server";

export type LoaderData = {
  mode: Mode | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const colorModeSession = await getColorModeSession(request);

  const data: LoaderData = {
    mode: colorModeSession.getColorMode(),
  };

  return data;
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverSyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const data = useLoaderData();

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />

          <Meta />
          <Links />
          {serverSyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ChakraThemeProvider sessionColorMode={data?.mode || Mode.Light}>
            {children}
          </ChakraThemeProvider>
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
        </body>
      </html>
    );
  }
);

export default function App() {
  const user = {};

  return (
    <Document>
      <VStack h="100vh" w="100vw" spacing={0}>
        {user && (
          <Flex as="nav" w="full">
            <Navigation />
          </Flex>
        )}
        <Flex w="full">
          <Outlet />
        </Flex>
      </VStack>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("Boundary:", error);
  return (
    <Document>
      <VStack h="100vh" justify="center">
        <Heading>There was an error</Heading>
        <Text>{error.message}</Text>
        <hr />
        <Text>
          Hey, developer, you should replace this with what you want your users
          to see.
        </Text>
      </VStack>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  let message;
  switch (caught.status) {
    case 401:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </Text>
      );
      break;
    case 404:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that does not exist.
        </Text>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document>
      <VStack h="100vh" justify="center">
        <Heading>
          {caught.status}: {caught.statusText}
        </Heading>
        {message}
      </VStack>
    </Document>
  );
}
