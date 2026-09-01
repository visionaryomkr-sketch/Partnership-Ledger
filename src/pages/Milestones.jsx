import React, { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Trash2,
  User,
  Check,
} from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import SlideOver from "@/components/ledger/SlideOver";
import { Skeleton } from "@/components/ui/skeleton";
import { partners as mockPartners } from "@/data/mockLedger";
import {
  useMilestones,
  useAddMilestone,
  useUpdateMilestoneStatus,
  useDeleteMilestone,
  usePartners,
} from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

const columns = [
  { key: "Completed", title: "Completed", color: "#2D7D46", bg: "bg-[#E8F0EB]", border: "border-[#B7DFCA]" },
  { key: "In Progress", title: "In Progress", color: "#B7791F", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]" },
  { key: "Upcoming", title: "Upcoming", color: "#4A5FE8", bg: "bg-[#EEF2FF]", border: "border-[#C7D2FE]" },
];

export default function Milestones() {
  const { user } = useAuth();
  const { data: milestones, isLoading } = useMilestones();
  const { data: partnersData } = usePartners();
  const addMilestone = useAddMilestone();
  const updateStatus = useUpdateMilestoneStatus();
  const deleteMilestone = useDeleteMilestone();

  const partners = partnersData || mockPartners;

  // Detect active founder
  const detectedFounder = React.useMemo(() => {
    const email = user?.email?.toLowerCase() || "";
    if (email.includes("shubham")) return "Shubham Jain";
    if (email.includes("ashwin")) return "Ashwin Pillai";
    return "OM Kumar";
  }, [user]);

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "Upcoming",
    owners: [detectedFounder],
  });

  const handleToggleOwner = (name) => {
    setForm((prev) => {
      const exists = prev.owners.includes(name);
      if (exists) {
        // Keep at least one owner
        if (prev.owners.length === 1) return prev;
        return { ...prev, owners: prev.owners.filter((o) => o !== name) };
      }
      return { ...prev, owners: [...prev.owners, name] };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      await addMilestone.mutateAsync({
        title: form.title,
        description: form.description,
        targetDate: form.targetDate,
        category: form.category,
        owners: form.owners,
        createdBy: detectedFounder,
      });
      setOpenAdd(false);
      setForm({
        title: "",
        description: "",
        targetDate: "",
        category: "Upcoming",
        owners: [detectedFounder],
      });
    } catch (err) {
      console.error("Failed to add milestone:", err);
    }
  };

  const handleMoveStatus = (id, newStatus) => {
    updateStatus.mutate({ id, newStatus });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete milestone: "${title}"?`)) {
      deleteMilestone.mutate(id);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Milestones & Roadmap
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            Where the project stands and what's next for all three co-founders.
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((col) => (
            <div key={col} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="rounded-2xl border border-[#E8E6E1] bg-white p-5 space-y-3 shadow-sm"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-2 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {columns.map((col) => {
            const items = (milestones || []).filter(
              (m) =>
                m.category === col.key ||
                (col.key === "Upcoming" && m.category === "Pending")
            );

            return (
              <div key={col.key} className="flex flex-col">
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: col.color }}
                    />
                    <h2 className="font-heading text-lg font-semibold text-[#16181D]">
                      {col.title}
                    </h2>
                    <span className="text-sm font-semibold text-[#9498A0]">
                      ({items.length})
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D5D3CC] p-6 text-center text-xs text-[#9498A0] bg-[#FAFAF9]">
                      No {col.title.toLowerCase()} milestones.
                    </div>
                  ) : (
                    items.map((m) => (
                      <div
                        key={m.id}
                        className="group rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-heading text-base font-semibold text-[#16181D] leading-snug">
                              {m.title}
                            </h3>
                            <button
                              onClick={() => handleDelete(m.id, m.title)}
                              className="opacity-0 group-hover:opacity-100 transition text-[#9498A0] hover:text-[#B91C1C] p-1 -mr-1 -mt-1"
                              title="Delete milestone"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {m.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[#62666F]">
                              {m.description}
                            </p>
                          )}

                          {/* Date info */}
                          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[#9498A0]">
                            <Calendar className="h-3.5 w-3.5 text-[#62666F]" />
                            {m.date ? (
                              <span>Completed: <strong>{m.date}</strong></span>
                            ) : m.targetDate ? (
                              <span>Target: <strong>{m.targetDate}</strong></span>
                            ) : (
                              <span>No target date set</span>
                            )}
                          </div>

                          {/* Owners */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {(m.owners || []).map((o) => {
                              const p = partners.find((x) => x.name === o);
                              return (
                                <span
                                  key={o}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F4F2] px-2.5 py-0.5 text-xs font-medium text-[#4A4E57] border border-[#EAE8E4]"
                                >
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ background: p?.color || "#9498A0" }}
                                  />
                                  {o.split(" ")[0]}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive Status Transition Bar */}
                        <div className="mt-4 pt-3 border-t border-[#F0EFEB] flex items-center justify-between text-xs">
                          {col.key === "Upcoming" && (
                            <button
                              onClick={() => handleMoveStatus(m.id, "In Progress")}
                              className="inline-flex items-center gap-1 text-[#B7791F] font-semibold hover:underline"
                            >
                              Start ➔ In Progress
                            </button>
                          )}

                          {col.key === "In Progress" && (
                            <>
                              <button
                                onClick={() => handleMoveStatus(m.id, "Upcoming")}
                                className="inline-flex items-center gap-1 text-[#62666F] hover:underline"
                              >
                                <ArrowLeft className="h-3 w-3" /> Upcoming
                              </button>
                              <button
                                onClick={() => handleMoveStatus(m.id, "Completed")}
                                className="inline-flex items-center gap-1 text-[#1B4332] font-semibold hover:underline"
                              >
                                Mark Done <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}

                          {col.key === "Completed" && (
                            <button
                              onClick={() => handleMoveStatus(m.id, "In Progress")}
                              className="inline-flex items-center gap-1 text-[#62666F] hover:underline"
                            >
                              Reopen (In Progress)
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlideOver to Add a New Milestone */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Milestone"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Milestone Title <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Google Ads launch, Payment Gateway setup"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">Description</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="What deliverables are required to consider this milestone complete?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-[#62666F]">Stage / Status</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1B4332]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#62666F]">Target Date</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              />
            </label>
          </div>

          <div>
            <span className="block text-sm font-medium text-[#62666F] mb-2">
              Assign Co-Founders
            </span>
            <div className="space-y-2">
              {partners.map((p) => {
                const selected = form.owners.includes(p.name);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleToggleOwner(p.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition ${
                      selected
                        ? "border-[#1B4332] bg-[#F4F9F6] text-[#1B4332] font-semibold"
                        : "border-[#E8E6E1] bg-white text-[#62666F] hover:bg-[#FAFAF9]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span>{p.name}</span>
                      <span className="text-xs text-[#9498A0] font-normal">
                        ({p.role})
                      </span>
                    </div>
                    {selected && <Check className="h-4 w-4 text-[#1B4332]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={addMilestone.isPending}
            className="w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] disabled:opacity-50 shadow-sm"
          >
            {addMilestone.isPending ? "Saving to Supabase..." : "Add Milestone"}
          </button>
        </form>
      </SlideOver>
    </>
  );
}