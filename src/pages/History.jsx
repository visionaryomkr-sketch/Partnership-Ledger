import React, { useState } from "react";
import {
  History as HistoryIcon,
  Trash2,
  Edit3,
  PlusCircle,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  FileText,
  AlertTriangle,
  X,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import StatCard from "@/components/ledger/StatCard";
import SlideOver from "@/components/ledger/SlideOver";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditHistory, usePartners } from "@/hooks/useLedger";

export default function History() {
  const { data: auditData, isLoading } = useAuditHistory();
  const { data: partnersData } = usePartners();

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [entityFilter, setEntityFilter] = useState("All");
  const [partnerFilter, setPartnerFilter] = useState("All");
  const [inspectEvent, setInspectEvent] = useState(null);

  const partners = partnersData || [
    { id: "om", name: "OM Kumar", color: "#4A5FE8" },
    { id: "shubham", name: "Shubham Jain", color: "#D14F9C" },
    { id: "ashwin", name: "Ashwin Pillai", color: "#E8734A" },
  ];

  const events = auditData || [];

  // Metrics
  const totalEvents = events.length;
  const deletedCount = events.filter((e) => e.action === "DELETED").length;
  const updatedCount = events.filter((e) => e.action === "UPDATED").length;
  const createdCount = events.filter((e) => e.action === "CREATED").length;

  // Filtered list
  const filtered = events.filter((e) => {
    if (actionFilter !== "All" && e.action !== actionFilter) return false;
    if (entityFilter !== "All" && e.entityType !== entityFilter) return false;
    if (partnerFilter !== "All" && (e.actor || "").toLowerCase().trim() !== partnerFilter.toLowerCase().trim()) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = (e.title || "").toLowerCase().includes(q);
      const matchActor = (e.actor || "").toLowerCase().includes(q);
      const matchEntity = (e.entityType || "").toLowerCase().includes(q);
      const matchDetails = JSON.stringify(e.details || {}).toLowerCase().includes(q);
      if (!matchTitle && !matchActor && !matchEntity && !matchDetails) return false;
    }
    return true;
  });

  const getPartnerColor = (name) => {
    const p = partners.find((p) => (p.name || "").toLowerCase().trim() === (name || "").toLowerCase().trim());
    return p?.color || "#1B4332";
  };

  const getActionBadge = (action) => {
    switch (action) {
      case "DELETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-bold text-[#B91C1C] border border-[#FCA5A5]">
            <Trash2 className="h-3 w-3" />
            DELETED
          </span>
        );
      case "UPDATED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-bold text-[#92400E] border border-[#FDE68A]">
            <Edit3 className="h-3 w-3" />
            UPDATED
          </span>
        );
      case "CREATED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-2.5 py-1 text-xs font-bold text-[#1B4332] border border-[#B7DFCA]">
            <PlusCircle className="h-3 w-3" />
            CREATED
          </span>
        );
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Just now";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Audit History Log
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            An immutable, transparent record of every addition, modification, and deletion across the partnership.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-[#E8F0EB] px-3.5 py-1.5 text-xs font-semibold text-[#1B4332] border border-[#B7DFCA]">
          <ShieldCheck className="h-4 w-4" />
          <span>Tamper-Proof Audit Trail</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Audit Events" value={totalEvents} />
        <div className="rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2]/50 p-5 shadow-sm">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#B91C1C]">
            Deletions Archived
          </p>
          <div className="mt-2 flex items-baseline gap-2 font-heading text-3xl font-bold text-[#B91C1C]">
            <Trash2 className="h-6 w-6 text-[#B91C1C]" />
            <span>{deletedCount}</span>
          </div>
          <p className="mt-1 text-xs text-[#991B1B]">Full snapshots preserved</p>
        </div>
        <StatCard label="Modifications Logged" value={updatedCount} />
        <StatCard label="New Records Added" value={createdCount} />
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E8E6E1] bg-white p-4 shadow-sm mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9498A0]" />
            <input
              type="text"
              placeholder="Search by title, partner, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E8E6E1] pl-9 pr-4 py-2 text-sm text-[#16181D] outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9498A0] hover:text-[#16181D]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["All", "DELETED", "UPDATED", "CREATED"].map((act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                  actionFilter === act
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
                }`}
              >
                {act === "DELETED" ? "🗑️ Deleted" : act === "UPDATED" ? "✏️ Updated" : act === "CREATED" ? "➕ Created" : "All Actions"}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0EFEB] text-sm">
          <span className="text-xs font-semibold text-[#9498A0] uppercase">Filters:</span>

          {/* Entity Dropdown */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-1.5 text-xs font-medium text-[#62666F] outline-none focus:border-[#1B4332]"
          >
            <option value="All">All Entities</option>
            <option value="Decision">Decisions</option>
            <option value="Work Entry">Work Entries</option>
            <option value="Expense">Expenses</option>
            <option value="Revenue">Revenue</option>
            <option value="Milestone">Milestones</option>
            <option value="Document">Documents</option>
            <option value="Settings">Settings / Rates</option>
          </select>

          {/* Partner Dropdown */}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-1.5 text-xs font-medium text-[#62666F] outline-none focus:border-[#1B4332]"
          >
            <option value="All">All Partners</option>
            {partners.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {(actionFilter !== "All" || entityFilter !== "All" || partnerFilter !== "All" || search) && (
            <button
              onClick={() => {
                setActionFilter("All");
                setEntityFilter("All");
                setPartnerFilter("All");
                setSearch("");
              }}
              className="text-xs text-[#B91C1C] hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit History List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border border-[#E8E6E1] bg-white p-5 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-96" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E6E1] bg-white p-12 text-center">
          <HistoryIcon className="h-10 w-10 text-[#9498A0] mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-[#16181D]">
            No Audit Records Found
          </h3>
          <p className="mt-1 text-sm text-[#62666F] max-w-md mx-auto">
            {totalEvents === 0
              ? "All future additions, edits, and deletions across the Partnership Ledger will automatically be archived here permanently."
              : "No history logs match your active filters. Try resetting the filters above."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
          <div className="divide-y divide-[#E8E6E1]">
            {filtered.map((item) => {
              const isDelete = item.action === "DELETED";
              const hasSnapshot = item.details && Object.keys(item.details).length > 0;

              return (
                <article
                  key={item.id}
                  className={`p-5 transition hover:bg-[#FBFBFA] ${
                    isDelete ? "bg-[#FEF2F2]/10" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getActionBadge(item.action)}
                      <span className="rounded-md bg-[#F5F4F2] px-2.5 py-0.5 text-xs font-semibold text-[#62666F]">
                        {item.entityType}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#16181D]">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: getPartnerColor(item.actor) }}
                        />
                        <span className="font-semibold">{item.actor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#9498A0] tabular-nums">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-bold text-[#16181D]">
                        {item.title}
                      </h4>
                      {isDelete && (
                        <p className="text-xs font-medium text-[#B91C1C]">
                          ⚠️ Record was deleted by {item.actor}. Archived snapshot is preserved below.
                        </p>
                      )}
                    </div>

                    {hasSnapshot && (
                      <button
                        onClick={() => setInspectEvent(item)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 whitespace-nowrap ${
                          isDelete
                            ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] hover:bg-[#FEE2E2]"
                            : "bg-[#F5F4F2] text-[#16181D] hover:bg-[#E8E6E1]"
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isDelete ? "View Deleted Data" : "Inspect Snapshot"}</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Snapshot Drawer Modal */}
      <SlideOver
        open={Boolean(inspectEvent)}
        onClose={() => setInspectEvent(null)}
        title={
          inspectEvent?.action === "DELETED"
            ? "Archived Deleted Record Snapshot"
            : "Audit Event Snapshot"
        }
      >
        {inspectEvent && (
          <div className="space-y-5">
            {/* Header pill */}
            <div className="rounded-xl border p-4 bg-[#FBFBFA]">
              <div className="flex items-center justify-between mb-2">
                {getActionBadge(inspectEvent.action)}
                <span className="text-xs text-[#9498A0] tabular-nums">
                  {formatDate(inspectEvent.createdAt)}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#16181D]">
                {inspectEvent.title}
              </h3>
              <p className="mt-1 text-xs text-[#62666F]">
                Actor: <b>{inspectEvent.actor}</b> · Entity: <b>{inspectEvent.entityType}</b>
              </p>
            </div>

            {/* Key details preview */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9498A0] mb-2">
                Archived Data Content
              </h4>

              {inspectEvent.details?.description && (
                <div className="mb-4 rounded-lg bg-[#F5F4F2] p-4 text-sm text-[#16181D] whitespace-pre-line border border-[#E8E6E1]">
                  <b className="block text-xs uppercase text-[#9498A0] mb-1">
                    Original Description:
                  </b>
                  {inspectEvent.details.description}
                </div>
              )}

              {/* Formatted JSON Raw Inspector */}
              <div className="rounded-xl bg-[#16181D] text-[#E8E6E1] p-4 text-xs font-mono overflow-x-auto max-h-96">
                <pre>{JSON.stringify(inspectEvent.details, null, 2)}</pre>
              </div>
            </div>

            <p className="text-xs text-[#9498A0] border-t border-[#E8E6E1] pt-3">
              🔒 This audit entry is permanent and cannot be modified or deleted by any user.
            </p>
          </div>
        )}
      </SlideOver>
    </>
  );
}
