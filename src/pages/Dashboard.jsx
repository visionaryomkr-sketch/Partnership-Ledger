import React from "react";
import CountUp from "@/components/ledger/CountUp";
import PartnerCard from "@/components/dashboard/PartnerCard";
import ContributionChart from "@/components/dashboard/ContributionChart";
import NetPosition from "@/components/dashboard/NetPosition";
import MonthComparison from "@/components/dashboard/MonthComparison";
import CategoryDonut from "@/components/dashboard/CategoryDonut";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import RevenueSourceBreakdown from "@/components/dashboard/RevenueSourceBreakdown";
import PendingReimbursements from "@/components/dashboard/PendingReimbursements";
import PartnershipHealth from "@/components/dashboard/PartnershipHealth";
import Tag from "@/components/ledger/Tag";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePartners,
  useWorkEntries,
  useExpenseEntries,
  useRevenueEntries,
} from "@/hooks/useLedger";

const categoryColors = {
  Development: "#4A5FE8",
  "Ad Creative": "#D14F9C",
  Marketing: "#E8734A",
};

const expenseColors = {
  Hosting: "#4A5FE8",
  "Ads Spend": "#E8734A",
  "Tools/Software": "#D14F9C",
  "Design Assets": "#B7791F",
  Domain: "#2D7D46",
};

export default function Dashboard() {
  const { data: partnersData, isLoading: pLoading } = usePartners();
  const { data: workData, isLoading: wLoading } = useWorkEntries();
  const { data: expenseData, isLoading: eLoading } = useExpenseEntries();
  const { data: revenueData, isLoading: rLoading } = useRevenueEntries();

  const isLoading = pLoading || wLoading || eLoading || rLoading;

  const partners = partnersData || [];
  const workEntries = workData || [];
  const expenseEntries = expenseData || [];
  const revenueEntries = revenueData || [];

  const totalRevenue = revenueEntries.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  // Dynamic Revenue Sources
  const revenueSources = React.useMemo(() => {
    if (!revenueEntries || revenueEntries.length === 0) return [];
    const sourceColors = { "Direct Sale": "#2D7D46", Organic: "#4A5FE8", "Ads-driven": "#B7791F" };
    const map = {};
    revenueEntries.forEach((r) => {
      map[r.source] = (map[r.source] || 0) + (Number(r.amount) || 0);
    });
    return Object.entries(map).map(([source, amount]) => ({
      source,
      amount,
      color: sourceColors[source] || "#62666F",
    }));
  }, [revenueEntries]);

  // Dynamic Hours by Category
  const hoursByCategory = React.useMemo(() => {
    const counts = {};
    workEntries.forEach((w) => {
      const cat = w.category || "Development";
      counts[cat] = (counts[cat] || 0) + (Number(w.hours) || 0);
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || "#62666F",
    }));
  }, [workEntries]);

  // Dynamic Expenses by Category
  const expenseByCategory = React.useMemo(() => {
    const counts = {};
    expenseEntries.forEach((e) => {
      const cat = e.category || "Infrastructure";
      counts[cat] = (counts[cat] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(counts).map(([category, amount]) => ({
      category,
      amount,
      color: expenseColors[category] || "#62666F",
    }));
  }, [expenseEntries]);

  // Compute live partners data completely from real workEntries and real expenseEntries
  const livePartners = React.useMemo(() => {
    return partners.map((p) => {
      const partnerWork = workEntries.filter(
        (w) => (w.partner || "").toLowerCase().trim() === (p.name || "").toLowerCase().trim()
      );
      const liveHours = partnerWork.reduce((s, w) => s + (Number(w.hours) || 0), 0);

      const partnerExpenses = expenseEntries.filter(
        (e) => (e.partner || "").toLowerCase().trim() === (p.name || "").toLowerCase().trim()
      );
      const liveInvested = partnerExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

      // Hourly rate default ₹1,000/hr + invested cash
      const liveContribution = liveHours * 1000 + liveInvested;

      return {
        ...p,
        hours: liveHours,
        invested: liveInvested,
        contribution: liveContribution,
        entriesThisWeek: partnerWork.length,
      };
    });
  }, [partners, workEntries, expenseEntries]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <section>
        <div className="flex items-center gap-2">
          <p className="font-heading text-sm font-medium text-[#62666F]">TOTAL REVENUE</p>
          {totalRevenue === 0 && (
            <span className="rounded-full bg-[#E8F0EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B4332]">
              Pre-launch
            </span>
          )}
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-[48px] font-bold leading-none text-[#16181D]">
          <CountUp value={totalRevenue} prefix="₹" />
        </h1>
        <p className="mt-3 text-[15px] text-[#62666F]">
          {totalRevenue === 0
            ? "Platform is technically built and ready for public launch. Real sales will appear here."
            : "Verified revenue recorded across all sources in Supabase."}
        </p>
      </section>

      <PartnershipHealth />

      <section className="grid gap-4 md:grid-cols-3">
        {livePartners.map((p) => (
          <PartnerCard key={p.id} p={p} />
        ))}
      </section>

      <MonthComparison />

      <div className="grid gap-6 lg:grid-cols-2">
        <ContributionChart data={livePartners} />
        <CategoryDonut data={hoursByCategory} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseBreakdown data={expenseByCategory} />
        <RevenueSourceBreakdown data={revenueSources} />
      </div>

      <NetPosition partners={livePartners} />

      <PendingReimbursements />

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold">Recent Activity</h2>
        <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm min-h-[100px] flex flex-col justify-center">
          {workEntries.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#9498A0]">
              No recent activity recorded yet.
            </p>
          ) : (
            workEntries.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-2 border-b border-[#E8E6E1] p-4 last:border-0 sm:flex-row sm:items-center"
              >
                <div className="min-w-[140px] font-medium">{r.partner}</div>
                <Tag>{r.category}</Tag>
                <div className="flex-1 text-[#62666F]">{r.title}</div>
                <b className="font-heading tabular-nums">{r.hours}h</b>
                <span className="text-[13px] text-[#9498A0] sm:w-24 sm:text-right">
                  {r.time || r.date}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}