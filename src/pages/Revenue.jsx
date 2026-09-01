import React from "react";
import RecordsPage from "@/pages/RecordsPage";

export default function Revenue() {
  return (
    <RecordsPage
      type="revenue"
      title="Revenue"
      description="Every rupee received, its source, and who recorded it."
      initial={[]}
    />
  );
}