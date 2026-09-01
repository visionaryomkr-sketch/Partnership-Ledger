import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import PartnerMiniCard from "@/components/about/PartnerMiniCard";
import KeyStatsStrip from "@/components/about/KeyStatsStrip";
import Timeline from "@/components/about/Timeline";
import { partners as mockPartners, workEntries as mockWorkEntries } from "@/data/mockLedger";
import { usePartners, useWorkEntries, useAppSettings } from "@/hooks/useLedger";

export default function About() {
  const { data: partnersData } = usePartners();
  const { data: workData } = useWorkEntries();
  const { data: settingsData } = useAppSettings();

  const partners = partnersData || mockPartners;
  const workEntries = workData || mockWorkEntries;
  const upfrontPayment = settingsData?.upfront_payment || 50000;

  // Filter OM's work entries dynamically
  const omEntries = workEntries.filter(
    (e) => (e.partner || "").toLowerCase().includes("om")
  );
  const omHours = omEntries.reduce((s, e) => s + (Number(e.hours) || 0), 0);

  return (
    <>
      <PageHeader
        title="About This Partnership"
        description="The people, decisions, and verifiable work behind Jyotish App."
      />
      <div className="space-y-12">
        <KeyStatsStrip />

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">The Partnership</h2>
          <p className="max-w-4xl text-[15px] leading-7 text-[#62666F]">
            <b className="text-[#16181D]">Jyotish App</b> is a Vedic astrology SaaS platform
            (jyotishfuture.in) built by three co-founders. The original idea and business plan—selling
            personalized Vedic astrology reports at ₹199 each, targeting significant customer
            volume through paid ads—came from Shubham and Ashwin. OM took on full technical
            execution of the product.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {partners.map((p) => (
              <PartnerMiniCard key={p.id} partner={p} />
            ))}
          </div>

          <Link
            to="/roles"
            className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#1B4332] hover:underline"
          >
            View full roles & responsibilities <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">Why This Ledger Exists</h2>
          <p className="max-w-4xl text-[15px] leading-7 text-[#62666F]">
            This tool exists because trust and fairness in a founding partnership should be based
            on visible facts, not memory or assumptions. Every hour worked, every rupee spent, and
            every rupee earned is logged here—permanently, by whoever did the work—so that at any
            point, all three partners can see exactly where things stand.
          </p>
        </section>

        <section className="rounded-2xl border border-[#E8E6E1] border-l-4 border-l-[#1B4332] bg-white p-6 shadow-sm md:p-8">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#1B4332]" />
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Current Status & Why the Upfront Payment Matters
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#62666F]">
                As of today, the platform is fully built and technically complete, but has not yet
                launched because paid advertising has not started. The development work represents
                100% of the technical execution completed so far, done entirely by OM Kumar,
                including handling a critical exposed API key that required a full backend security
                overhaul.
              </p>
              <p className="mt-4 text-[15px] leading-7 text-[#62666F]">
                Given that OM has carried 100% of the technical risk and time investment to date
                while marketing has not yet begun, an upfront payment of{" "}
                <b className="text-[#16181D]">₹{Number(upfrontPayment).toLocaleString("en-IN")}</b>{" "}
                to OM is agreed—not as full payment for work worth significantly more at market rate,
                but as fair acknowledgment of completed, verifiable work and immediate
                security-critical effort ahead of revenue. It is intended to be adjusted against OM's
                share once real revenue starts.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 font-heading font-semibold text-[#1B4332] hover:underline"
                >
                  See the work log <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/decisions"
                  className="inline-flex items-center gap-2 font-heading font-semibold text-[#1B4332] hover:underline"
                >
                  View decision record <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-heading text-xl font-semibold">Partnership Timeline</h2>
          <Timeline />
        </section>

        <section className="rounded-2xl bg-[#E8F0EB] p-6">
          <p className="font-heading text-sm font-semibold uppercase tracking-[.05em] text-[#1B4332]">
            Link to evidence
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#16181D]">
            {omEntries.length} entries, {omHours} total hours logged
          </p>
          <p className="mt-2 text-sm text-[#62666F]">
            Every entry is dated, attributed, immutable, and viewable in the Work Log tab.
          </p>
        </section>
      </div>
    </>
  );
}