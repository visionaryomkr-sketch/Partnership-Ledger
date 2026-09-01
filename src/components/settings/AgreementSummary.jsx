import React from "react";
import { usePartners, useAppSettings } from "@/hooks/useLedger";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgreementSummary({ partners: propPartners, rate: propRate }) {
  const { data: partnersData, isLoading: partnersLoading } = usePartners();
  const { data: settingsData, isLoading: settingsLoading } = useAppSettings();

  const isLoading = (partnersLoading && !propPartners) || (settingsLoading && propRate === undefined);

  if (isLoading) {
    return (
      <section className="mb-6 rounded-2xl border border-[#E8E6E1] border-l-4 border-l-[#1B4332] bg-white p-6 shadow-sm animate-pulse">
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-4" />
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-72" />
        </div>
      </section>
    );
  }

  const partners = propPartners || partnersData || [];
  const rate = propRate !== undefined ? propRate : (settingsData?.hourly_rate || 1000);
  const upfront = settingsData?.upfront_payment || 50000;

  const split = partners.map((p) => `${p.name.split(" ")[0]} ${p.share || 0}%`).join(" · ");

  return (
    <section className="mb-6 rounded-2xl border border-[#E8E6E1] border-l-4 border-l-[#1B4332] bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold">Partnership Agreement Summary</h2>
      <p className="mt-2 text-sm text-[#62666F]">The core agreed terms, at a glance.</p>
      <ul className="mt-4 space-y-2 text-[15px] text-[#16181D]">
        <li className="flex gap-2">
          <span className="text-[#1B4332]">•</span> Profit split: <b>{split}</b>
        </li>
        <li className="flex gap-2">
          <span className="text-[#1B4332]">•</span> Hourly rate for dev work: <b>₹{Number(rate).toLocaleString("en-IN")}/hr</b>
        </li>
        <li className="flex gap-2">
          <span className="text-[#1B4332]">•</span> Upfront payment agreed: <b>₹{Number(upfront).toLocaleString("en-IN")} to OM</b>, adjustable against future share
        </li>
        <li className="flex gap-2">
          <span className="text-[#1B4332]">•</span> Infrastructure costs reimbursed from first revenue before profit distribution
        </li>
        <li className="flex gap-2">
          <span className="text-[#1B4332]">•</span> All entries are permanent and immutable — corrections via notes only
        </li>
      </ul>
    </section>
  );
}