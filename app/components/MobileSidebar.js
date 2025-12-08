"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-3 fixed top-3 left-3 z-50 bg-gray-800 text-white rounded"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white 
    transform transition-transform duration-300
    w-64 overflow-hidden
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:hidden
    z-50`}
      >
        <Sidebar onNavigate={() => setOpen(false)} mobile />
      </div>

      <div className="hidden md:block fixed top-0 left-0 h-full w-64 overflow-hidden z-30">
        <Sidebar />
      </div>
    </>
  );
}
