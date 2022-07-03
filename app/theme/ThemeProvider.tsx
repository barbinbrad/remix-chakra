import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { useFetcher } from "@remix-run/react";
import { colors } from "./palette";

export enum Mode {
  Dark = "dark",
  Light = "light",
}

const modes: Array<Mode> = Object.values(Mode);

type ThemeContextType = [Mode | null, Dispatch<SetStateAction<Mode | null>>];
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDarkMode = "(prefers-color-scheme: dark)";
const getPreferredColorMode = () =>
  window.matchMedia(prefersDarkMode).matches ? Mode.Dark : Mode.Light;

function ChakraThemeProvider({
  children,
  sessionColorMode,
}: {
  children: ReactNode;
  sessionColorMode: Mode | null;
}) {
  const [colorMode, setColorMode] = useState<Mode | null>(() => {
    if (sessionColorMode) {
      if (modes.includes(sessionColorMode)) {
        return sessionColorMode;
      } else {
        return null;
      }
    }

    if (typeof window !== "object") {
      return null;
    }

    return getPreferredColorMode();
  });

  const persistColorMode = useFetcher();
  const persistColorModeRef = useRef(persistColorMode);
  const mountRun = useRef(false);

  useEffect(() => {
    persistColorModeRef.current = persistColorMode;
  }, [persistColorMode]);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!colorMode) {
      return;
    }

    persistColorModeRef.current.submit(
      { colorMode },
      { action: "action/set-color-mode", method: "post" }
    );
  }, [colorMode]);

  const theme = useMemo(() => {
    return extendTheme({
      config: {
        initialColorMode: colorMode,
      },
      colors,
      components: {
        Button: {
          variants: {
            solid: (props: { colorScheme: string }) => {
              const { colorScheme: c } = props;
              if (c !== "brand") return {};

              return {
                bg: `${c}.500`,
                color: "gray.900",
              };
            },
          },
        },
        Input: {
          variants: {
            outline: (props: { colorScheme: string }) => {
              const { colorScheme: c } = props;
              if (c !== "brand") return {};

              return {
                field: {
                  borderColor: `${c}.500`,
                  _hover: {
                    borderColor: mode(`${c}.600`, `${c}.300`)(props),
                  },
                },
              };
            },
            filled: (props: { colorScheme: string }) => {
              const { colorScheme: c } = props;
              if (c !== "brand") return {};

              return {
                field: {
                  background: `${c}.500`,
                },
              };
            },
          },
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
    });
  }, []);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={[colorMode, setColorMode]}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
}

function useColorMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useColorMode must be used within a ThemeProvider");
  }
  return context;
}

function isColorMode(value: unknown): value is Mode {
  return typeof value === "string" && modes.includes(value as Mode);
}

export { ChakraThemeProvider, isColorMode, useColorMode };
