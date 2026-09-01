import React from "react";
import RecordsPage from "@/pages/RecordsPage";

export default function Expenses() {
  return (
    <RecordsPage
      type="expense"
      title="Expenses & Investments"
      description="Cash contributions and business costs, traceable to their source documents."
      initial={[]}
    />
  );
}