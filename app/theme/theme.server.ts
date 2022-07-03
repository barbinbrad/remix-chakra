import { createCookieSessionStorage } from "@remix-run/node";
import { isColorMode } from "./ThemeProvider";
import type { Mode } from "./ThemeProvider";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const colorModeStorage = createCookieSessionStorage({
  cookie: {
    name: "color_mode",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getColorModeSession(request: Request) {
  const session = await colorModeStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getColorMode: () => {
      const colorModeValue = session.get("colorMode");
      return isColorMode(colorModeValue) ? colorModeValue : null;
    },
    setColorMode: (colorMode: Mode) => session.set("colorMode", colorMode),
    commit: () => colorModeStorage.commitSession(session),
  };
}

export { getColorModeSession };
