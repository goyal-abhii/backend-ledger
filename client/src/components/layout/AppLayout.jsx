import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/** Shared chrome for authenticated pages: top nav + routed content. */
export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}
