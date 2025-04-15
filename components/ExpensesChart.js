// components/ExpensesChart.js
"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, 
  PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell 
} from "recharts"; 
import { CATEGORIES } from "@/lib/constants";

export default function ExpensesChart({ transactions }) {
  // Existing monthly data processing
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const data = months.map(month => ({ name: month, amount: 0 }));
    
    transactions.forEach(transaction => {
      if (transaction.date) {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();
        const amount = parseFloat(transaction.amount.replace('₹', '')) || 0;
        data[monthIndex].amount += amount;
      }
    });
    
    return data;
  }, [transactions]);

  // Stripe-inspired color scheme
  const colors = ['#635bff', '#00d4ff', '#ff5436', '#8766ff'];
  const currentMonth = new Date().getMonth();

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Financial Overview</h2>
        <p className="text-sm text-gray-500">Monthly and category-wise spending analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Expenses Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={value => `₹${value}`}
                />
                <Tooltip 
                  formatter={value => [`₹${value}`, 'Expenses']}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                >
                  {monthlyData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={index === currentMonth ? colors[0] : colors[index % 4]}
                      fillOpacity={index === currentMonth ? 0.9 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORIES.map(cat => ({
                    name: cat.name,
                    value: transactions
                      .filter(t => t.category === cat.id)
                      .reduce((sum, t) => sum + parseFloat(t.amount.replace('₹', '')), 0)
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={value => `₹${value}`}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6">
        {CATEGORIES.map((cat, index) => (
          <div key={cat.id} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: cat.color }}
            ></div>
            <span className="text-sm text-gray-600">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
