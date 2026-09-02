import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PageHeader from "@/components/ledger/PageHeader";
import Filters from "@/components/ledger/Filters";
import LedgerTable from "@/components/ledger/LedgerTable";
import SlideOver from "@/components/ledger/SlideOver";
import EntryForm from "@/components/ledger/EntryForm";
import EmptyState from "@/components/ledger/EmptyState";
import WorkLogSummary from "@/components/records/WorkLogSummary";
import ExpenseSummary from "@/components/records/ExpenseSummary";
import RevenueSummary from "@/components/records/RevenueSummary";
import WeeklyGroupedTable from "@/components/records/WeeklyGroupedTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useWorkEntries,
  useAddWorkEntry,
  useExpenseEntries,
  useAddExpenseEntry,
  useUpdateExpenseStatus,
  useRevenueEntries,
  useAddRevenueEntry,
} from "@/hooks/useLedger";

export default function RecordsPage({ type, title, description, initial }) {
  const queryPartner = new URLSearchParams(window.location.search).get("partner");
  const [partner, setPartner] = useState(queryPartner || "All partners");
  const [category, setCategory] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weeklyView, setWeeklyView] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(null);
  const [preview, setPreview] = useState(null);

  // Live Supabase queries
  const workQuery = useWorkEntries();
  const expenseQuery = useExpenseEntries();
  const revenueQuery = useRevenueEntries();

  const isLoading =
    (type === "work" && workQuery.isLoading) ||
    (type === "expense" && expenseQuery.isLoading) ||
    (type === "revenue" && revenueQuery.isLoading);

  // Live Supabase mutations
  const addWork = useAddWorkEntry();
  const addExpense = useAddExpenseEntry();
  const updateExpense = useUpdateExpenseStatus();
  const addRevenue = useAddRevenueEntry();

  // Determine current active dataset
  let rows = [];
  if (type === "work" && workQuery.data) rows = workQuery.data;
  if (type === "expense" && expenseQuery.data) rows = expenseQuery.data;
  if (type === "revenue" && revenueQuery.data) rows = revenueQuery.data;

  let shown = rows;
  if (partner !== "All partners") {
    shown = shown.filter(
      (r) => (r.partner || "").toLowerCase().trim() === partner.toLowerCase().trim()
    );
  }
  if (type !== "revenue" && category !== "All categories") {
    shown = shown.filter((r) => r.category === category);
  }
  if (type === "expense" && statusFilter !== "All statuses") {
    shown = shown.filter((r) => r.status === statusFilter);
  }
  if (startDate) {
    shown = shown.filter((r) => (r.date || "") >= startDate);
  }
  if (endDate) {
    shown = shown.filter((r) => (r.date || "") <= endDate);
  }
  shown = [...shown].sort((a, b) => b.date.localeCompare(a.date));

  const save = async (form) => {
    try {
      if (type === "work") {
        await addWork.mutateAsync(form);
      } else if (type === "expense") {
        await addExpense.mutateAsync(form);
      } else if (type === "revenue") {
        await addRevenue.mutateAsync(form);
      }
      setOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const toggleStatus = (r) => {
    if (type === "expense") {
      const nextStatus = r.status === "Pending" ? "Adjusted" : "Pending";
      updateExpense.mutate({ id: r.id, status: nextStatus });
    }
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#1B4332] px-4 py-2.5 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98]"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </button>
        }
      />
      {isLoading ? (
        <div className="space-y-6 mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-[#E8E6E1] bg-white p-5 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#E8E6E1] bg-white p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#F0EFEB] last:border-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            {type === "work" && (
              <WorkLogSummary
                rows={shown}
                category={category}
                setCategory={setCategory}
                weeklyView={weeklyView}
                setWeeklyView={setWeeklyView}
              />
            )}
            {type === "expense" && (
              <ExpenseSummary
                rows={shown}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            )}
            {type === "revenue" && <RevenueSummary rows={shown} />}
          </div>
          <Filters
            partner={partner}
            setPartner={setPartner}
            showCategory={false}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          {shown.length ? (
            weeklyView && type === "work" ? (
              <WeeklyGroupedTable rows={shown} onNote={setNote} />
            ) : (
              <LedgerTable
                type={type}
                rows={shown}
                onStatus={toggleStatus}
                onNote={setNote}
                onPreview={setPreview}
              />
            )
          ) : (
            <EmptyState onAdd={() => setOpen(true)} />
          )}
        </>
      )}
      <SlideOver open={open} onClose={() => setOpen(false)} title={`Add ${title} entry`}>
        <EntryForm type={type} onSave={save} />
      </SlideOver>
      <SlideOver open={!!note} onClose={() => setNote(null)} title="Add a clarification">
        <p className="mb-4 text-sm text-[#62666F]">
          The original entry stays unchanged. This note will be appended to its history in the ledger.
        </p>
        <textarea className="mb-4 w-full rounded-lg border border-[#E8E6E1] p-3" rows="5" />
        <button
          onClick={() => {
            setNote(null);
            toast({ title: "Note appended" });
          }}
          className="w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white"
        >
          Save note
        </button>
      </SlideOver>
      <SlideOver open={!!preview} onClose={() => setPreview(null)} title="Receipt preview">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E6E1] bg-[#F5F4F2]">
          <p className="font-heading font-semibold">{preview?.proof}</p>
          <p className="mt-2 text-sm text-[#62666F]">Receipt document preview</p>
        </div>
      </SlideOver>
    </>
  );
}