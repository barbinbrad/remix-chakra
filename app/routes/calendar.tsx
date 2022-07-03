import { Outlet } from "@remix-run/react";

export default function CalendarRoute() {
  return (
    <>
      <h1>Calendar</h1>
      <Outlet />
    </>
  );
}
