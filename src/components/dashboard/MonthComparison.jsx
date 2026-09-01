import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import CountUp from "@/components/ledger/CountUp";
import { useWorkEntries, useExpenseEntries, useRevenueEntries } from "@/hooks/useLedger";

function Stat({ label, current, prefix = "", isPreLaunch = false }) {
  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm">
      <p className="text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">{label}</p>
      <div className="mt-2 font-heading text-3xl font-bold tabular-nums">
        <CountUp value={current} prefix={prefix} />
      </div>
      <div className="mt-2 flex items-center gap-1 text-sm">
        {isPreLaunch ? (
          <span className="text-[#1B4332] font-medium text-xs bg-[#E8F0EB] px-2 py-0.5 rounded-full">
            Pre-launch mode
          </span>
        ) : (
          <span className="text-[#2D7D46] font-medium text-xs">Live verified total</span>
        )}
      </div>
    </div>
  );
}

export default function MonthComparison() {
  const { data: workData } = useWorkEntries();
  const { data: expenseData } = useExpenseEntries();
  const { data: revenueData } = useRevenueEntries();

  const totalHours = (workData || []).reduce((s, e) => s + (Number(e.hours) || 0), 0);
  const totalInvested = (expenseData || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalRevenue = (revenueData || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold">Active Financial & Time Metrics</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total Hours Logged"
          current={totalHours}
          isPreLaunch={totalHours === 0}
        />
        <Stat
          label="Total ₹ Invested"
          current={totalInvested}
          prefix="₹"
          isPreLaunch={totalInvested === 0}
        />
        <Stat
          label="Total Revenue"
          current={totalRevenue}
          prefix="₹"
          isPreLaunch={totalRevenue === 0}
        />
      </div>
    </section>
  );
}