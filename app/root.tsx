import { Box, Heading } from "@chakra-ui/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Flex, VStack } from "@chakra-ui/react";
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
import Navigation from "~/components/Navigation";
import { ChakraThemeProvider } from "~/theme";
import { Mode } from "~/theme";
import { getColorModeSession } from "./theme/theme.server";

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

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

function Document({
  children,
  title = "App title",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData();
  const user = {};

  return (
    <Document>
      <ChakraThemeProvider sessionColorMode={data.mode}>
        <VStack h="100vh" w="100vw" spacing={0}>
          {user && (
            <Flex as="nav" w="full">
              <Navigation />
            </Flex>
          )}
          <Flex h="full">
            <Outlet />
          </Flex>
        </VStack>
      </ChakraThemeProvider>
    </Document>
  );
}

// How ChakraProvider should be used on CatchBoundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraThemeProvider sessionColorMode={Mode.Dark}>
        <Box>
          <Heading as="h1" bg="purple.600">
            [CatchBoundary]: {caught.status} {caught.statusText}
          </Heading>
        </Box>
      </ChakraThemeProvider>
    </Document>
  );
}

// How ChakraProvider should be used on ErrorBoundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <ChakraThemeProvider sessionColorMode={Mode.Dark}>
        <Box>
          <Heading as="h1" bg="blue.500">
            [ErrorBoundary]: There was an error: {error.message}
          </Heading>
        </Box>
      </ChakraThemeProvider>
    </Document>
  );
}
