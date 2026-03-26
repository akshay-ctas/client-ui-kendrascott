"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LogOutContent() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const modal = (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-112.5 bg-white rounded-2xl shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">
            Confirm Logout
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="text-stone-400 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-stone-500">
          Are you sure you want to log out from your account?
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 text-sm font-medium border border-stone-200 rounded-xl hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">Log out</span>
      </button>

      {mounted && isOpen && createPortal(modal, document.body)}
    </>
  );
}
