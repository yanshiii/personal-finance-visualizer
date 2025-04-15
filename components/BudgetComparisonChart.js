"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, Cell
} from "recharts";
import { CATEGORIES } from "@/lib/constants";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BudgetComparisonChart({ transactions, budgets, month, year }) {
  const comparisonData = useMemo(() => {
    return CATEGORIES.map(category => {
      // Filter transactions for selected month/year
      const actual = transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.category === category.id && 
                 date.getMonth() === month &&
                 date.getFullYear() === year;
        })
        .reduce((sum, t) => {
          const amount = parseFloat(t.amount.replace(/[₹,]/g, '')) || 0;
          return sum + amount;
        }, 0);

      const budget = budgets[category.id] || 0;
      const percentage = budget > 0 ? (actual / budget) * 100 : 0;
      
      // Determine status colors
      let status = "under";
      if (percentage >= 100) status = "over";
      else if (percentage >= 80) status = "warning";

      return {
        name: category.name,
        actual,
        budget,
        percentage,
        status,
        color: category.color
      };
    }).filter(item => item.budget > 0 || item.actual > 0);
  }, [transactions, budgets, month, year]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-md shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <h3 className="font-semibold">{data.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-500">Budget:</span>
            <span className="font-medium">₹{data.budget.toLocaleString()}</span>
            <span className="text-gray-500">Actual:</span>
            <span className="font-medium">₹{data.actual.toLocaleString()}</span>
            <span className="text-gray-500">Usage:</span>
            <span className={`font-medium ${
              data.status === "over" ? "text-red-600" :
              data.status === "warning" ? "text-amber-600" : "text-green-600"
            }`}>
              {data.percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Budget vs Actual Spending</h3>
        <span className="text-sm text-gray-500">
          {months[month]} {year}
        </span>
      </div>

      {comparisonData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No budget data available for this period
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={32}
              barGap={8}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#f3f4f6" 
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-gray-600 text-sm">{value}</span>
                )}
              />
              
              {/* Budget Bar */}
              <Bar 
                dataKey="budget" 
                name="Budget"
                fill="#e0e7ff"
                radius={[4, 4, 0, 0]}
              />
              
              {/* Actual Spending Bar */}
              <Bar 
                dataKey="actual" 
                name="Actual"
                radius={[4, 4, 0, 0]}
              >
                {comparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.status === "over" ? "#ef4444" :
                      entry.status === "warning" ? "#f59e0b" :
                      entry.color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
