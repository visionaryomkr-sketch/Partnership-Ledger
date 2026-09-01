import React from "react";
import { projectStartDate, partners as mockPartners } from "@/data/mockLedger";
import { usePartners, useWorkEntries, useExpenseEntries } from "@/hooks/useLedger";
import { Skeleton } from "@/components/ui/skeleton";

export default function KeyStatsStrip() {
  const { data: partners, isLoading: pLoading } = usePartners();
  const { data: workEntries, isLoading: wLoading } = useWorkEntries();
  const { data: expenseEntries, isLoading: eLoading } = useExpenseEntries();

  const isLoading = pLoading || wLoading || eLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const start = new Date(projectStartDate);
  const now = new Date();
  const days = Math.max(1, Math.floor((now - start) / 86400000));

  // Compute live total hours from work_entries or partners
  const totalHours = workEntries && workEntries.length > 0
    ? workEntries.reduce((s, e) => s + (Number(e.hours) || 0), 0)
    : (partners || mockPartners).reduce((s, p) => s + (Number(p.hours) || 0), 0);

  // Compute live invested capital
  const totalInvested = (partners || mockPartners).reduce(
    (s, p) => s + (Number(p.invested) || 0),
    0
  );

  const stats = [
    { label: "Days Since Start", value: `${days}` },
    { label: "Total Hours Logged", value: `${totalHours}h` },
    { label: "Total ₹ Invested", value: `₹${totalInvested.toLocaleString("en-IN")}` },
    { label: "Current Status", value: "Pre-launch" },
  ];

  return (
    <div className="grid gap-4 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={i}>
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">
            {s.label}
          </p>
          <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-[#16181D]">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}