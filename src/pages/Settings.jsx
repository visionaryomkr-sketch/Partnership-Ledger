import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ledger/PageHeader";
import ImpactPreview from "@/components/settings/ImpactPreview";
import AgreementSummary from "@/components/settings/AgreementSummary";
import { partners as mockPartners, changeLog as mockChangeLog } from "@/data/mockLedger";
import {
  usePartners,
  useAppSettings,
  useChangeLog,
  useUpdateHourlyRate,
  useUpdateProfitShares,
} from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

export default function Settings() {
  const { user, currentPartner } = useAuth();
  const { data: partnersData } = usePartners();
  const { data: settingsData } = useAppSettings();
  const { data: changeLogData } = useChangeLog();

  const updateHourlyRate = useUpdateHourlyRate();
  const updateProfitShares = useUpdateProfitShares();

  const partners = partnersData || mockPartners;
  const currentRate = settingsData?.hourly_rate || 1000;
  const changeLog = changeLogData || mockChangeLog;

  const actingFounder = currentPartner?.name || "OM Kumar";

  // Form states
  const [shares, setShares] = useState(partners.map((p) => p.share || 0));
  const [rate, setRate] = useState(currentRate);
  const [confirm, setConfirm] = useState(null); // 'share' | 'rate' | null

  // Filters for change log
  const [logPartner, setLogPartner] = useState("All");
  const [logField, setLogField] = useState("All");

  // Sync state when data loads
  useEffect(() => {
    if (partnersData) {
      setShares(partnersData.map((p) => p.share || 0));
    }
  }, [partnersData]);

  useEffect(() => {
    if (settingsData?.hourly_rate !== undefined) {
      setRate(settingsData.hourly_rate);
    }
  }, [settingsData]);

  const total = shares.reduce((a, b) => a + Number(b), 0);

  const filteredLog = changeLog.filter(
    (c) =>
      (logPartner === "All" || c.who === logPartner) &&
      (logField === "All" || c.field === logField)
  );

  const handleConfirmSave = async () => {
    if (confirm === "share") {
      const sharesMap = {};
      partners.forEach((p, idx) => {
        sharesMap[p.id] = Number(shares[idx]);
      });

      const oldSummary = partners.map((p) => p.share).join(" / ");
      const newSummary = shares.map((s) => Number(s)).join(" / ");

      await updateProfitShares.mutateAsync({
        sharesMap,
        who: actingFounder,
        oldSharesSummary: oldSummary,
        newSharesSummary: newSummary,
      });
    } else if (confirm === "rate") {
      await updateHourlyRate.mutateAsync({
        newRate: Number(rate),
        who: actingFounder,
        oldRate: currentRate,
      });
    }
    setConfirm(null);
  };

  const selectCls =
    "rounded-lg border border-[#E8E6E1] px-3 py-2 text-sm text-[#62666F] outline-none focus:border-[#1B4332]";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Settings
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            Shared assumptions that power every fairness calculation in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#B7DFCA] bg-[#F4F9F6] px-3.5 py-2 text-xs font-semibold text-[#1B4332] shadow-xs">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: currentPartner?.color || "#4A5FE8" }}
          />
          <span>Updating as: <strong>{actingFounder}</strong></span>
          <span className="text-[11px] text-[#62666F] font-normal">({currentPartner?.role})</span>
        </div>
      </div>

      <AgreementSummary partners={partners} rate={currentRate} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profit Share Section */}
        <section className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold">Profit Share %</h2>
          <p className="mt-2 text-sm text-[#62666F]">
            Current agreed split across partners. Any change here directly updates the Supabase
            partners table and logs into the Change Log.
          </p>
          <div className="mt-6 space-y-4">
            {partners.map((p, i) => (
              <label key={p.id} className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-24 rounded-lg border border-[#E8E6E1] px-3 py-2 text-right tabular-nums text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
                    type="number"
                    min="0"
                    max="100"
                    value={shares[i]}
                    onChange={(e) =>
                      setShares(
                        shares.map((x, j) => (j === i ? e.target.value : x))
                      )
                    }
                  />
                  <span className="text-sm font-semibold text-[#62666F]">%</span>
                </div>
              </label>
            ))}
          </div>

          <div
            className={`mt-6 flex justify-between border-t border-[#E8E6E1] pt-4 font-heading font-semibold ${
              total === 100 ? "text-[#2D7D46]" : "text-[#C0392B]"
            }`}
          >
            <span>Total</span>
            <span>{total}%</span>
          </div>

          <button
            disabled={total !== 100 || updateProfitShares.isPending}
            onClick={() => setConfirm("share")}
            className="mt-4 w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
          >
            {updateProfitShares.isPending ? "Saving to Supabase..." : "Save profit share"}
          </button>
        </section>

        {/* Hourly Rate Section */}
        <section className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold">Hourly Rate (₹)</h2>
            <p className="mt-2 text-sm text-[#62666F]">
              Used to compare logged development time fairly against cash investments in calculations.
            </p>
            <div className="mt-6 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9498A0]">
                ₹
              </span>
              <input
                className="w-full rounded-lg border border-[#E8E6E1] pl-8 pr-3 py-3 tabular-nums text-lg font-semibold outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
                type="number"
                min="0"
                step="50"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={updateHourlyRate.isPending}
            onClick={() => setConfirm("rate")}
            className="mt-6 w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] shadow-sm"
          >
            {updateHourlyRate.isPending ? "Saving to Supabase..." : "Save hourly rate"}
          </button>
        </section>
      </div>

      <div className="mt-6">
        <ImpactPreview
          shares={shares.map(Number)}
          rate={Number(rate)}
          savedShares={partners.map((p) => p.share || 0)}
          savedRate={currentRate}
        />
      </div>

      {/* Change Log Section */}
      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold">Change Log</h2>
            <p className="text-xs text-[#62666F]">Audit trail synced from Supabase settings_changelog table.</p>
          </div>
          <div className="flex gap-3">
            <select
              value={logPartner}
              onChange={(e) => setLogPartner(e.target.value)}
              className={selectCls}
            >
              <option>All</option>
              <option>OM Kumar</option>
              <option>Shubham Jain</option>
              <option>Ashwin Pillai</option>
            </select>
            <select
              value={logField}
              onChange={(e) => setLogField(e.target.value)}
              className={selectCls}
            >
              <option>All</option>
              <option>Profit Share</option>
              <option>Hourly Rate</option>
            </select>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
          {filteredLog.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#9498A0]">
              No change log entries found.
            </div>
          ) : (
            filteredLog.map((c, i) => (
              <div
                key={c.id || i}
                className="grid gap-2 border-b border-[#E8E6E1] p-4 text-sm last:border-0 md:grid-cols-4 items-center"
              >
                <b>{c.who}</b>
                <span className="text-[#62666F] font-medium">{c.field}</span>
                <span className="text-[#9498A0] text-xs">{c.when}</span>
                <span className="tabular-nums text-xs">
                  <span className="text-[#9498A0]">{c.old}</span> →{" "}
                  <b className="text-[#16181D] font-semibold">{c.next}</b>
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E6E1]">
            <h3 className="font-heading text-xl font-semibold text-[#16181D]">
              Confirm Fairness Change
            </h3>
            <p className="mt-3 text-sm text-[#62666F]">
              This will update the live Supabase database and record an audit entry in the Change
              Log on behalf of <strong>{actingFounder}</strong>.
            </p>
            <div className="my-6 rounded-xl bg-[#F5F4F2] p-4 text-center tabular-nums">
              {confirm === "rate" ? (
                <>
                  ₹{Number(currentRate).toLocaleString("en-IN")} →{" "}
                  <b className="text-[#1B4332]">
                    ₹{Number(rate).toLocaleString("en-IN")}/hr
                  </b>
                </>
              ) : (
                <>
                  {partners.map((p) => p.share).join(" / ")}% →{" "}
                  <b className="text-[#1B4332]">{shares.join(" / ")}%</b>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-lg border border-[#E8E6E1] p-3 text-sm font-semibold text-[#62666F] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 rounded-lg bg-[#1B4332] p-3 font-semibold text-white shadow-sm hover:bg-[#143A28] active:scale-[.98]"
              >
                Confirm & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}