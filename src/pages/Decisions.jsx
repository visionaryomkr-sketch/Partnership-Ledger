import React, { useState } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import SlideOver from "@/components/ledger/SlideOver";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDecisions,
  useAddDecision,
  useVoteDecision,
  useDeleteDecision,
  usePartners,
} from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

export default function Decisions() {
  const { user, currentPartner } = useAuth();
  const { data, isLoading } = useDecisions();
  const { data: partnersData } = usePartners();
  const addDecision = useAddDecision();
  const voteDecision = useVoteDecision();
  const deleteDecision = useDeleteDecision();

  const entries = data || [];
  const partners = partnersData && partnersData.length > 0
    ? partnersData
    : [
        { id: 'om', name: 'OM Kumar', role: 'Developer' },
        { id: 'shubham', name: 'Shubham Jain', role: 'Ad Creative' },
        { id: 'ashwin', name: 'Ashwin Pillai', role: 'Marketing' },
      ];

  const activeFounder = currentPartner?.name || "OM Kumar";
  const [openAdd, setOpenAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    proposer: activeFounder,
  });

  // State for Objection/Disagreement modal
  const [objectionModal, setObjectionModal] = useState({
    open: false,
    decisionId: null,
    reason: "",
  });

  const handleCreateDecision = async () => {
    if (!addForm.title.trim()) return;
    try {
      await addDecision.mutateAsync({
        date: new Date().toISOString().slice(0, 10),
        title: addForm.title,
        description: addForm.description,
        proposer: addForm.proposer || activeFounder,
      });
      setOpenAdd(false);
      setAddForm({ title: "", description: "", proposer: activeFounder });
    } catch (err) {
      console.error("Failed to save decision:", err);
    }
  };

  const handleVote = async (decisionId, voteType, note = "") => {
    try {
      await voteDecision.mutateAsync({
        decisionId,
        partnerName: activeFounder,
        voteType,
        note,
      });
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const submitObjection = async () => {
    if (!objectionModal.decisionId) return;
    await handleVote(objectionModal.decisionId, "disagree", objectionModal.reason);
    setObjectionModal({ open: false, decisionId: null, reason: "" });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Decisions Log
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            Co-founder agreements, approvals, and shared resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Verified Founder Identity Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-[#B7DFCA] bg-[#F4F9F6] px-3.5 py-2 text-xs font-semibold text-[#1B4332] shadow-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: currentPartner?.color || "#4A5FE8" }}
            />
            <span>Voting as: <strong>{activeFounder}</strong></span>
            <span className="text-[11px] text-[#62666F] font-normal">({currentPartner?.role})</span>
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98]"
          >
            <Plus className="h-4 w-4" />
            Add Decision
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-4 border-t border-[#E8E6E1] flex gap-3">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8E6E1] bg-white p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0EB] text-[#1B4332]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-[#16181D]">
            No Decisions Logged Yet
          </h3>
          <p className="mt-2 max-w-md text-sm text-[#62666F] leading-relaxed">
            When co-founders propose strategic decisions, equity revisions, or budget allocations, they will appear here for all partners to vote and reach consensus.
          </p>
          <button
            onClick={() => setOpenAdd(true)}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-sm transition hover:bg-[#143A28] active:scale-[.98]"
          >
            <Plus className="h-4 w-4" />
            Propose First Decision
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((d) => {
          // Normalize votes mapping
          const votes = d.votes || {};
          const founders = ["OM Kumar", "Shubham Jain", "Ashwin Pillai"];

          const agreeCount = founders.filter((f) => votes[f]?.status === "agree").length;
          const disagreeCount = founders.filter((f) => votes[f]?.status === "disagree").length;
          const pendingCount = founders.filter((f) => !votes[f] || votes[f]?.status === "pending").length;

          // Status Badge Logic
          const isApproved = d.status === "Approved" || agreeCount === 3;
          const isRejected = d.status === "Rejected" || disagreeCount > 0;

          // Current active founder's stance on this decision
          const myVote = votes[activeFounder]?.status || "pending";
          const myNote = votes[activeFounder]?.note || "";

          return (
            <div
              key={d.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                isApproved
                  ? "border-[#B7DFCA] bg-gradient-to-b from-white to-[#F6FAF8]"
                  : isRejected
                  ? "border-[#F8D7DA] bg-gradient-to-b from-white to-[#FFF8F8]"
                  : "border-[#E8E6E1]"
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-[#9498A0]">{d.date}</span>
                  <span className="text-xs text-[#62666F]">•</span>
                  <span className="text-xs font-medium text-[#62666F]">
                    Proposed by{" "}
                    <strong className="text-[#16181D]">
                      {d.proposer || d.agreedBy?.[0] || "OM Kumar"}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Overall Decision Status Tag */}
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-3 py-1 text-xs font-semibold text-[#1B4332] border border-[#B7DFCA]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved (Unanimous 3/3)
                    </span>
                  ) : isRejected ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#B91C1C] border border-[#FCA5A5]">
                      <XCircle className="h-3.5 w-3.5" />
                      Disputed / Objections ({disagreeCount} Disagreed)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E] border border-[#FDE68A]">
                      <Clock className="h-3.5 w-3.5" />
                      Under Review ({agreeCount}/3 Agreed)
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete decision: "${d.title}"? (A permanent snapshot will be preserved in Audit History)`)) {
                        deleteDecision.mutate({ id: d.id, actor: activeFounder });
                      }
                    }}
                    title="Delete Decision"
                    className="p-1.5 rounded-lg text-[#9498A0] hover:text-[#B91C1C] hover:bg-[#FEF2F2] transition active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="mt-4 font-heading text-xl font-bold text-[#16181D]">
                {d.title}
              </h3>
              <div className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#4A4E57] whitespace-pre-line font-normal">
                {d.description}
              </div>

              {/* 3 Co-Founders Stance Strip */}
              <div className="mt-5 border-t border-[#E8E6E1] pt-4">
                <p className="text-xs font-semibold tracking-wider text-[#9498A0] uppercase mb-3">
                  Co-Founders Stance
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {founders.map((name) => {
                    const partnerInfo = partners.find((p) => p.name === name) || {
                      name,
                      role: "Partner",
                      color: "#4A5FE8",
                    };
                    const vote = votes[name]?.status || "pending";
                    const note = votes[name]?.note || "";

                    return (
                      <div
                        key={name}
                        className={`rounded-xl border p-3 flex flex-col justify-between ${
                          vote === "agree"
                            ? "border-[#C6E6D5] bg-[#F4F9F6]"
                            : vote === "disagree"
                            ? "border-[#FECDD3] bg-[#FFF5F6]"
                            : "border-[#E8E6E1] bg-[#FAFAF9]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                              style={{ background: partnerInfo.color }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#16181D] truncate">
                                {name}
                              </p>
                              <p className="text-[11px] text-[#9498A0] truncate">
                                {partnerInfo.role}
                              </p>
                            </div>
                          </div>

                          {/* Individual Badge */}
                          {vote === "agree" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#E8F0EB] px-2 py-0.5 text-xs font-semibold text-[#1B4332]">
                              <CheckCircle2 className="h-3 w-3" />
                              Agreed
                            </span>
                          ) : vote === "disagree" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#FEE2E2] px-2 py-0.5 text-xs font-semibold text-[#B91C1C]">
                              <XCircle className="h-3 w-3" />
                              Disagreed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#F3F4F6] px-2 py-0.5 text-xs font-medium text-[#6B7280]">
                              <Clock className="h-3 w-3 text-[#9CA3AF]" />
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Note/Reason if provided */}
                        {note && (
                          <div className="mt-2.5 rounded-lg bg-white/80 p-2 text-xs text-[#62666F] border border-black/5 flex items-start gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#9498A0]" />
                            <span className="italic">"{note}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Voting Actions for Active Founder */}
              <div className="mt-5 rounded-xl bg-[#F8F8F7] border border-[#E8E6E1] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#62666F]">
                    Your stance as <strong>{activeFounder}</strong>:
                  </span>
                  {myVote === "agree" ? (
                    <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Agreed
                    </span>
                  ) : myVote === "disagree" ? (
                    <span className="text-xs font-bold text-[#B91C1C] flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Disagreed {myNote ? `("${myNote}")` : ""}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#92400E] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Awaiting your decision
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {myVote !== "agree" && (
                    <button
                      onClick={() => handleVote(d.id, "agree")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#143A28] active:scale-[.97]"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      I Agree (सहमत)
                    </button>
                  )}

                  {myVote !== "disagree" && (
                    <button
                      onClick={() =>
                        setObjectionModal({
                          open: true,
                          decisionId: d.id,
                          reason: "",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#FCA5A5] px-3.5 py-1.5 text-xs font-semibold text-[#B91C1C] shadow-sm transition hover:bg-[#FEF2F2] active:scale-[.97]"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      I Disagree / Object
                    </button>
                  )}

                  {myVote === "agree" && (
                    <button
                      onClick={() =>
                        setObjectionModal({
                          open: true,
                          decisionId: d.id,
                          reason: "",
                        })
                      }
                      className="text-xs font-medium text-[#B91C1C] hover:underline px-2 py-1"
                    >
                      Change to Disagree
                    </button>
                  )}

                  {myVote === "disagree" && (
                    <button
                      onClick={() => handleVote(d.id, "agree")}
                      className="text-xs font-medium text-[#1B4332] hover:underline px-2 py-1"
                    >
                      Change to Agree
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* SlideOver to Propose New Decision */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Propose a New Decision"
      >
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">Proposing Co-Founder</span>
            <select
              value={addForm.proposer}
              onChange={(e) => setAddForm({ ...addForm, proposer: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2.5 text-sm"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">Decision Title</span>
            <input
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Profit split revised to 40/30/30"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">Description / Terms</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              rows={4}
              placeholder="Detail what is being agreed upon, timelines, and implications for each co-founder."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            />
          </label>

          <div className="rounded-lg bg-[#F8FAF9] border border-[#B7DFCA] p-3 text-xs text-[#1B4332]">
            <strong>Note:</strong> As the proposer, <strong>{addForm.proposer}</strong> will
            automatically be marked as <strong>Agreed</strong>. The other 2 co-founders can then
            review and cast their votes directly on the card.
          </div>

          <button
            onClick={handleCreateDecision}
            className="w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98]"
          >
            Submit Proposal
          </button>
        </div>
      </SlideOver>

      {/* Modal / SlideOver to Enter Objection Reason */}
      <SlideOver
        open={objectionModal.open}
        onClose={() => setObjectionModal({ open: false, decisionId: null, reason: "" })}
        title="Reason for Disagreement / Counter-Proposal"
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              Voting <strong>Disagree</strong> indicates you do not accept this decision in its
              current form. Please explain your counter-proposal or concerns for your co-founders.
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Your Objection / Counter-Proposal Note:
            </span>
            <textarea
              className="mt-2 w-full rounded-lg border border-[#E8E6E1] p-3 text-sm outline-none focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
              rows={5}
              placeholder="e.g. I agree with the milestone but think we should cap the budget at ₹35,000 until first revenues..."
              value={objectionModal.reason}
              onChange={(e) =>
                setObjectionModal({ ...objectionModal, reason: e.target.value })
              }
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setObjectionModal({ open: false, decisionId: null, reason: "" })
              }
              className="flex-1 rounded-lg border border-[#E8E6E1] p-3 text-sm font-semibold text-[#62666F] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submitObjection}
              className="flex-1 rounded-lg bg-[#B91C1C] p-3 font-heading font-semibold text-white shadow-sm hover:bg-[#991B1B] active:scale-[.98]"
            >
              Confirm Disagree
            </button>
          </div>
        </div>
      </SlideOver>
    </>
  );
}