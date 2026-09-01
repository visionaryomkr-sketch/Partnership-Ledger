import React from "react";
import RecordsPage from "@/pages/RecordsPage";

export default function WorkLog() {
  return (
    <RecordsPage
      type="work"
      title="Work Log"
      description="A permanent record of time, output, and supporting proof."
      initial={[]}
    />
  );
}