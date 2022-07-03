import { Outlet } from "@remix-run/react";

export default function ProfilesRoute() {
  return (
    <>
      <h1>Profiles</h1>
      <Outlet />
    </>
  );
}
