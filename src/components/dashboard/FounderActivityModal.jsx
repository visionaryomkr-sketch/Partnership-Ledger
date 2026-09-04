import React from "react";
import {
  Activity,
  Clock,
  Laptop,
  CheckCircle,
  Eye,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Compass,
} from "lucide-react";
import SlideOver from "@/components/ledger/SlideOver";

function formatSeconds(secs) {
  if (!secs || secs <= 0) return "0 mins";
  const m = Math.floor(secs / 60);
  const h = Math.floor(m / 60);
  const remainingM = m % 60;

  if (h > 0) {
    return `${h}h ${remainingM}m`;
  }
  return `${m}m ${secs % 60}s`;
}

function formatSessionDate(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

const PAGE_NAMES = {
  "/": "Dashboard",
  "/work": "Work Log",
  "/expenses": "Expenses",
  "/revenue": "Revenue",
  "/decisions": "Decisions",
  "/milestones": "Milestones",
  "/documents": "Documents",
  "/roles": "Roles",
  "/equity": "Equity",
  "/settings": "Settings",
  "/history": "Audit History",
};

export default function FounderActivityModal({ open, onClose, activityData, partners }) {
  const stats = activityData?.partnersStats || {};
  const sessions = activityData?.recentSessions || [];

  const partnerList = partners || [
    { id: "om", name: "OM Kumar", role: "Developer", color: "#4A5FE8" },
    { id: "shubham", name: "Shubham Jain", role: "Ad Creative", color: "#D14F9C" },
    { id: "ashwin", name: "Ashwin Pillai", role: "Marketing", color: "#E8734A" },
  ];

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Co-Founder Activity & Session Tracker"
    >
      <div className="space-y-6">
        {/* Intro Alert */}
        <div className="rounded-xl border border-[#B7DFCA] bg-[#F4F9F6] p-4 text-xs text-[#1B4332] space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#1B4332]" />
            <span>100% Verifiable Browser Telemetry</span>
          </div>
          <p className="text-[#3F6350] leading-relaxed">
            Session times and page views are recorded directly via live browser heartbeats. If a co-founder claims they checked the app, their exact login timestamp and inspected sections will appear here.
          </p>
        </div>

        {/* 3 Co-Founder Status Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9498A0]">
            Live Presence & Engagement Summary
          </h3>

          <div className="grid gap-3">
            {partnerList.map((p) => {
              const stat = stats[p.name] || {
                isOnline: false,
                lastSeen: "Never logged in",
                timeSpentTodaySeconds: 0,
                totalTimeSpentSeconds: 0,
                sessionCount: 0,
                latestDevice: "No device recorded",
                pagesVisited: [],
              };

              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-[#E8E6E1] bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: p.color }}
                      />
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-[#16181D]">
                          {p.name}
                        </h4>
                        <span className="text-xs text-[#9498A0]">{p.role}</span>
                      </div>
                    </div>

                    {/* Online status badge */}
                    {stat.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-2.5 py-1 text-xs font-bold text-[#1B4332] border border-[#B7DFCA]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4332] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B4332]"></span>
                        </span>
                        Online Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F4F2] px-2.5 py-1 text-xs font-medium text-[#62666F]">
                        <Clock className="h-3 w-3 text-[#9498A0]" />
                        {stat.lastSeen}
                      </span>
                    )}
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-[#F0EFEB] pt-2.5 text-xs">
                    <div>
                      <span className="text-[#9498A0] block">Today's Time</span>
                      <b className="font-heading font-bold text-sm text-[#16181D]">
                        {formatSeconds(stat.timeSpentTodaySeconds)}
                      </b>
                    </div>
                    <div>
                      <span className="text-[#9498A0] block">Total Time Spent</span>
                      <b className="font-heading font-bold text-sm text-[#16181D]">
                        {formatSeconds(stat.totalTimeSpentSeconds)}
                      </b>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[#9498A0] block">Logins</span>
                      <b className="font-heading font-bold text-sm text-[#16181D]">
                        {stat.sessionCount} {stat.sessionCount === 1 ? "session" : "sessions"}
                      </b>
                    </div>
                  </div>

                  {/* Inspected Sections Badges */}
                  <div className="border-t border-[#F0EFEB] pt-2">
                    <span className="text-[11px] font-medium text-[#9498A0] block mb-1.5">
                      Sections Inspected:
                    </span>
                    {stat.pagesVisited && stat.pagesVisited.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {stat.pagesVisited.map((path) => (
                          <span
                            key={path}
                            className="inline-flex items-center gap-1 rounded bg-[#F5F4F2] px-2 py-0.5 text-[11px] font-medium text-[#4A4E57]"
                          >
                            <CheckCircle className="h-3 w-3 text-[#1B4332]" />
                            {PAGE_NAMES[path] || path}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs italic text-[#9498A0]">
                        No pages inspected yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chronological Sessions Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9498A0]">
              Recent Login & Usage History
            </h3>
            <span className="text-xs text-[#9498A0] tabular-nums">
              {sessions.length} recorded {sessions.length === 1 ? "session" : "sessions"}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E8E6E1] p-8 text-center text-xs text-[#9498A0]">
              <Activity className="h-8 w-8 text-[#9498A0] mx-auto mb-2" />
              <p className="font-medium text-[#16181D]">No Sessions Logged Yet</p>
              <p className="mt-1">
                Founder login timestamps and active minutes will populate here automatically as partners open and browse the app.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E6E1] rounded-xl border border-[#E8E6E1] bg-white overflow-hidden">
              {sessions.slice(0, 15).map((s) => {
                const partnerColor =
                  partnerList.find(
                    (p) =>
                      s.partnerName &&
                      s.partnerName.toLowerCase().includes(p.name.split(" ")[0].toLowerCase())
                  )?.color || "#4A5FE8";

                return (
                  <div key={s.id || s.sessionId} className="p-3 text-xs space-y-2 hover:bg-[#FBFBFA]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: partnerColor }}
                        />
                        <b className="text-[#16181D]">{s.partnerName}</b>
                        {s.isOnline && (
                          <span className="rounded bg-[#E8F0EB] px-1.5 py-0.5 text-[10px] font-bold text-[#1B4332]">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[#9498A0] tabular-nums">
                        {formatSessionDate(s.loginAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[#62666F]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#9498A0]" />
                        <span>Active Duration:</span>
                        <b className="font-semibold text-[#16181D]">
                          {formatSeconds(s.durationSeconds)}
                        </b>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#9498A0]">
                        <Laptop className="h-3 w-3" />
                        <span>{s.deviceInfo || "Browser"}</span>
                      </div>
                    </div>

                    {s.pagesViewed && s.pagesViewed.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-[#9498A0]">Pages:</span>
                        {s.pagesViewed.map((path) => (
                          <span
                            key={path}
                            className="rounded bg-[#F5F4F2] px-1.5 py-0.5 text-[10px] font-medium text-[#4A4E57]"
                          >
                            {PAGE_NAMES[path] || path}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
}
