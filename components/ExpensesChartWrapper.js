"use client";

import dynamic from "next/dynamic";
import ClientOnlyComponent from "./ClientOnlyComponent"; // Import ClientOnlyComponent

const Chart = dynamic(() => import("./ExpensesChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading chart...</span>
    </div>
  ),
});

export default function ExpensesChartWrapper() {
  return (
    <ClientOnlyComponent>
      <Chart />
    </ClientOnlyComponent>
  );
}
