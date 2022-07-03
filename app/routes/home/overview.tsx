import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return { title: "Teamworks Overview" };
};

export default function HomeOverviewRoute() {
  return <p>Hello</p>;
}
