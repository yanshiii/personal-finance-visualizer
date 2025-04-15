"use client";

import { useMemo } from "react";
import { CATEGORIES } from "@/lib/constants";

export default function SummaryCards({ transactions }) {
  const totals = useMemo(() => {
    const total = transactions.reduce((sum, t) => {
      let amount = t.amount;
      if (typeof amount === "string") {
        amount = parseFloat(amount.replace("₹", ""));
      }
      return sum + (Number(amount) || 0);
    }, 0);

    const recent = [...transactions].slice(-3).reverse();

    const topCategory = CATEGORIES.reduce(
      (max, cat) => {
        const catTotal = transactions
          .filter((t) => t.category === cat.id)
          .reduce((sum, t) => {
            let amount = t.amount;
            if (typeof amount === "string") {
              amount = parseFloat(amount.replace("₹", ""));
            }
            return sum + (Number(amount) || 0);
          }, 0);
        return catTotal > max.value ? { name: cat.name, value: catTotal } : max;
      },
      { name: "", value: 0 }
    );

    return { total, recent, topCategory };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Expenses Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-sm font-medium mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold">₹{totals.total.toLocaleString()}</p>
      </div>

      {/* Top Category Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium mb-2">Top Category</h3>
        <p className="text-2xl font-bold text-gray-900">
          {totals.topCategory.name || "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          ₹{totals.topCategory.value.toLocaleString()}
        </p>
      </div>

      {/* Recent Transactions Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {totals.recent.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent transactions.</p>
          ) : (
            totals.recent.map((t, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-900 truncate">{t.description}</span>
                <span className="text-gray-500">
                  ₹{typeof t.amount === "string" ? t.amount.replace("₹", "") : t.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
