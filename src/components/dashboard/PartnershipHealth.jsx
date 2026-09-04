import React, { useState } from "react";
import { Activity, CheckCircle2, Clock, ChevronRight, Eye } from "lucide-react";
import { usePartners, useDecisions, useMilestones, useFounderActivity } from "@/hooks/useLedger";
import FounderActivityModal from "@/components/dashboard/FounderActivityModal";

export default function PartnershipHealth() {
  const { data: partnersData } = usePartners();
  const { data: decisionsData } = useDecisions();
  const { data: milestonesData } = useMilestones();
  const { data: activityData } = useFounderActivity();

  const [openActivity, setOpenActivity] = useState(false);

  const partners = partnersData || [];
  const decisions = decisionsData || [];
  const milestones = milestonesData || [];
  const stats = activityData?.partnersStats || {};

  const openDecisions = decisions.filter(
    (d) => !d.status || d.status === "Proposed" || d.status === "In Review"
  ).length;
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed" || m.category === "Completed"
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E8E6E1] bg-white px-6 py-4 shadow-sm">
        <button
          onClick={() => setOpenActivity(true)}
          className="flex items-center gap-2 font-heading text-sm font-medium text-[#62666F] hover:text-[#1B4332] transition"
          title="Click to view real-time co-founder activity log"
        >
          <Activity className="h-4 w-4 text-[#1B4332]" />
          Partnership Health:
        </button>

        {partners.map((p) => {
          const partnerStat = stats[p.name] || {};
          const isOnline = partnerStat.isOnline;
          const displayStatus = partnerStat.lastSeen || p.lastActive || "Never logged in";

          return (
            <button
              key={p.id}
              onClick={() => setOpenActivity(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition cursor-pointer ${
                isOnline
                  ? "bg-[#E8F0EB] text-[#1B4332] font-semibold border border-[#B7DFCA] hover:bg-[#D4E7DC]"
                  : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
              }`}
              title={`Click to inspect login sessions for ${p.name}`}
            >
              {isOnline ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4332] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B4332]"></span>
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              )}
              <span>
                {p.name.split(" ")[0]}: {displayStatus}
              </span>
            </button>
          );
        })}

        <span className="flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-3 py-1 text-xs font-medium text-[#1B4332]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {completedMilestones} milestones completed
        </span>

        <span className="flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#B7791F]">
          <Clock className="h-3.5 w-3.5" />
          {openDecisions} open decision{openDecisions !== 1 ? "s" : ""}
        </span>

        {/* Action button to open full activity log */}
        <button
          onClick={() => setOpenActivity(true)}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] hover:underline"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Activity Logs</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Activity Tracker Drawer */}
      <FounderActivityModal
        open={openActivity}
        onClose={() => setOpenActivity(false)}
        activityData={activityData}
        partners={partners}
      />
    </>
  );
}