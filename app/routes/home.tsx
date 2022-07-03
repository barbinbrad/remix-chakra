import { Outlet } from "@remix-run/react";

export default function HomeRoute() {
  return (
    <>
      <h1>Home</h1>
      <Outlet />
    </>
  );
}
