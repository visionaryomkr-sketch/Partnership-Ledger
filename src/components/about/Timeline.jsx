import React from "react";
import { useTimeline } from "@/hooks/useLedger";
import { Skeleton } from "@/components/ui/skeleton";
import { timeline as mockTimeline } from "@/data/mockLedger";

export default function Timeline() {
  const { data: timelineData, isLoading } = useTimeline();

  const events = timelineData || mockTimeline;

  if (isLoading) {
    return (
      <div className="space-y-6 pl-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-72" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E8E6E1]" />
      {events.map((event, i) => (
        <div key={event.id || i} className="relative flex gap-4 pb-8 last:pb-0">
          <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#1B4332] bg-white" />
          <div>
            <p className="text-[13px] text-[#9498A0]">{event.date}</p>
            <h4 className="mt-0.5 font-heading text-base font-semibold text-[#16181D]">
              {event.title}
            </h4>
            <p className="mt-1 text-sm text-[#62666F] leading-relaxed">
              {event.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}