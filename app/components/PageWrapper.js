"use client";

import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import MobileSidebar from "./MobileSidebar";
export default function PageWrapper({ children }) {
  return (
    <div className="flex min-h-screen">
      <MobileSidebar />

      {/* <Sidebar /> */}
      <main className="flex-1 p-8 md:ml-64 -mr-px">
        {children} <Toaster position="top-center" />
      </main>
    </div>
  );
}
