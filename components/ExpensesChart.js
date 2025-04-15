// components/ExpensesChart.js
"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from "recharts";

function ExpensesChart({ transactions }) {
  // Process transactions into monthly data
  const monthlyData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Initialize data for all months with zero amounts
    const data = months.map(month => ({ name: month, amount: 0 }));
    
    // Sum up transactions by month
    transactions.forEach(transaction => {
      if (transaction.date) {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();
        // Remove ₹ symbol and convert to number if needed
        let amount = transaction.amount;
        if (typeof amount === 'string') {
          amount = parseFloat(amount.replace('₹', ''));
        }
        data[monthIndex].amount += Number(amount) || 0;
      }
    });
    
    return data;
  }, [transactions]);

  // Stripe-inspired color palette
  const colors = [
    '#635bff', // Primary purple
    '#00d4ff', // Blue
    '#ff5436', // Red
    '#8766ff', // Purple
  ];

  // Get current month for highlighting
  const currentMonth = new Date().getMonth();

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Monthly Expenses</h2>
      <p className="text-sm text-gray-500 mb-6">Your spending patterns throughout the year</p>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barSize={28}
          >
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
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Expenses']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: '14px',
                padding: '8px 12px'
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
            />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {monthlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === currentMonth ? colors[0] : 
                       (index % 4 === 1 ? colors[1] : 
                        index % 4 === 2 ? colors[2] : 
                        index % 4 === 3 ? colors[3] : '#e2e8f0')} 
                  fillOpacity={entry.amount > 0 ? 0.85 : 0.2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center mt-4 space-x-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[0] }}></div>
          <span className="text-xs text-gray-600">Current Month</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[1] }}></div>
          <span className="text-xs text-gray-600">Quarter 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[2] }}></div>
          <span className="text-xs text-gray-600">Quarter 2</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[3] }}></div>
          <span className="text-xs text-gray-600">Quarter 3</span>
        </div>
      </div>
    </div>
  );
}

export default ExpensesChart;
