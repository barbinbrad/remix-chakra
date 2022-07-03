import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = {}; // TODO
  if (user) {
    return redirect("/home/overview");
  }
  return redirect("sign-in");
};
