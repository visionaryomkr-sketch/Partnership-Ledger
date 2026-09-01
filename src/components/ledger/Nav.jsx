import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Clock3,
  Receipt,
  IndianRupee,
  MoreHorizontal,
  ChevronDown,
  PieChart,
  Gavel,
  Flag,
  FileText,
  Users,
  Settings,
  Info,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const primary = [
  ["/", "Dashboard", LayoutDashboard],
  ["/work", "Work Log", Clock3],
  ["/expenses", "Expenses", Receipt],
  ["/revenue", "Revenue", IndianRupee],
];

const secondary = [
  ["/equity", "Equity", PieChart],
  ["/decisions", "Decisions", Gavel],
  ["/milestones", "Milestones", Flag],
  ["/documents", "Documents", FileText],
  ["/roles", "Roles", Users],
  ["/settings", "Settings", Settings],
  ["/about", "About", Info],
];

export function DesktopNav() {
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const secondaryActive = secondary.some(([to]) => to === location.pathname);

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {primary.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#E8F0EB] text-[#1B4332]"
                : "text-[#62666F] hover:bg-[#F5F4F2] hover:text-[#16181D]"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
      <div
        className="relative"
        onMouseEnter={() => setDropdown(true)}
        onMouseLeave={() => setDropdown(false)}
      >
        <button
          onClick={() => setDropdown(!dropdown)}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors ${
            secondaryActive
              ? "bg-[#E8F0EB] text-[#1B4332]"
              : "text-[#62666F] hover:bg-[#F5F4F2] hover:text-[#16181D]"
          }`}
        >
          Partnership <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {dropdown && (
          <div className="absolute left-0 top-full w-48 pt-1 z-50">
            <div className="rounded-xl border border-[#E8E6E1] bg-white p-1.5 shadow-xl">
              {secondary.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#E8F0EB] text-[#1B4332]"
                        : "text-[#62666F] hover:bg-[#F5F4F2] hover:text-[#16181D]"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function MobileBottomNav() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const { currentPartner, logout } = useAuth();
  const secondaryActive = secondary.some(([to]) => to === location.pathname);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E8E6E1] bg-white/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)] lg:hidden">
        <div className="grid grid-cols-5 items-center">
          {primary.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-1 transition-all ${
                  isActive
                    ? "font-semibold text-[#1B4332]"
                    : "text-[#9498A0] hover:text-[#62666F]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? "bg-[#E8F0EB]" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] leading-none tracking-tight">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setMobileMenu(true)}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              secondaryActive || mobileMenu
                ? "font-semibold text-[#1B4332]"
                : "text-[#9498A0] hover:text-[#62666F]"
            }`}
          >
            <div
              className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                secondaryActive ? "bg-[#E8F0EB]" : ""
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-[11px] leading-none tracking-tight">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#FAFAF9] lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-[#E8E6E1] px-6">
              <span className="font-heading text-lg font-bold text-[#16181D]">
                Partnership Sections
              </span>
              <button
                onClick={() => setMobileMenu(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8E6E1] text-[#62666F] shadow-sm active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9498A0] mb-3">
                Ledger Modules
              </p>
              {secondary.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#E8F0EB] text-[#1B4332] shadow-sm"
                        : "bg-white text-[#62666F] border border-[#E8E6E1] hover:bg-[#F5F4F2]"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}

              <div className="pt-6 border-t border-[#E8E6E1] mt-6">
                <div className="flex items-center justify-between rounded-xl bg-white border border-[#E8E6E1] p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: currentPartner?.color || "#4A5FE8" }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#16181D]">
                        {currentPartner?.name || "Co-Founder"}
                      </p>
                      <p className="text-xs text-[#9498A0]">
                        {currentPartner?.role || "Partner"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-[#F5F4F2] px-3 py-2 text-xs font-semibold text-[#C0392B] transition active:scale-95"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Nav() {
  return <DesktopNav />;
}