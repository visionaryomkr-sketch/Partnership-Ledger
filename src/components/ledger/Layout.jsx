import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { DesktopNav, MobileBottomNav } from "@/components/ledger/Nav";
import Footer from "@/components/ledger/Footer";
import { LogOut } from "lucide-react";
import { useSessionTracker } from "@/hooks/useSessionTracker";

export default function Layout() {
  useSessionTracker();
  const location = useLocation();
  const { user, currentPartner, logout } = useAuth();
  const displayName = currentPartner?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Partner";

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24 lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-[#E8E6E1] bg-[#FAFAF9]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="font-heading text-lg font-bold text-[#16181D]">
              Partnership Ledger
            </span>
            <DesktopNav />
          </div>

          {/* Desktop User Info */}
          <div className="hidden items-center gap-3 text-sm sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-[#E8E6E1] bg-white px-3 py-1 shadow-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: currentPartner?.color || "#4A5FE8" }}
              />
              <span className="font-heading font-medium text-[#16181D]">
                {displayName}
              </span>
              {currentPartner?.role && (
                <span className="rounded bg-[#E8F0EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#1B4332]">
                  {currentPartner.role}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="font-heading font-medium text-[#1B4332] transition hover:text-[#143A28] active:scale-[.98]"
            >
              Logout
            </button>
          </div>

          {/* Mobile User Tag */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E8E6E1] bg-white px-2.5 py-1 text-xs shadow-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: currentPartner?.color || "#4A5FE8" }}
              />
              <span className="font-heading font-medium text-[#16181D] max-w-[100px] truncate">
                {displayName.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg bg-white border border-[#E8E6E1] text-[#62666F] active:scale-95"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.24 }}
          className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Rendered at root level outside header so fixed bottom-0 docks to phone viewport */}
      <MobileBottomNav />
    </div>
  );
}