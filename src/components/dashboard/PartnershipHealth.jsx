import React from "react";
import { Activity, CheckCircle2, Clock } from "lucide-react";
import { usePartners, useDecisions, useMilestones } from "@/hooks/useLedger";

export default function PartnershipHealth() {
  const { data: partnersData } = usePartners();
  const { data: decisionsData } = useDecisions();
  const { data: milestonesData } = useMilestones();

  const partners = partnersData || [];
  const decisions = decisionsData || [];
  const milestones = milestonesData || [];

  const openDecisions = decisions.filter(
    (d) => !d.status || d.status === "Proposed" || d.status === "In Review"
  ).length;
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed" || m.category === "Completed"
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E8E6E1] bg-white px-6 py-4 shadow-sm">
      <span className="flex items-center gap-2 font-heading text-sm font-medium text-[#62666F]">
        <Activity className="h-4 w-4 text-[#1B4332]" />
        Partnership Health:
      </span>
      {partners.map((p) => (
        <span
          key={p.id}
          className="flex items-center gap-1.5 rounded-full bg-[#F5F4F2] px-3 py-1 text-xs text-[#62666F]"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name.split(" ")[0]}: {p.lastActive || "Active"}
        </span>
      ))}
      <span className="flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-3 py-1 text-xs font-medium text-[#1B4332]">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {completedMilestones} milestones completed
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#B7791F]">
        <Clock className="h-3.5 w-3.5" />
        {openDecisions} open decision{openDecisions !== 1 ? "s" : ""}
      </span>
    </div>
  );
}