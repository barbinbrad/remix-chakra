import { Outlet } from "@remix-run/react";

export default function MessagingRoute() {
  return (
    <>
      <h1>Messaging</h1>
      <Outlet />
    </>
  );
}
