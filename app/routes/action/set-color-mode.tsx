import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { getColorModeSession } from "~/lib/theme/theme.server";
import { isColorMode } from "~/lib/theme";

export const action: ActionFunction = async ({ request }) => {
  const colorModeSession = await getColorModeSession(request);
  const requestText = await request.text();
  const params = new URLSearchParams(requestText);
  const colorMode = params.get("colorMode");

  if (!isColorMode(colorMode)) {
    return json({
      success: false,
      message: `color mode value of ${colorMode} is not a valid color mode`,
    });
  }

  colorModeSession.setColorMode(colorMode);
  return json(
    { success: true },
    { headers: { "Set-Cookie": await colorModeSession.commit() } }
  );
};

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
