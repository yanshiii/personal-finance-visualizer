"use client";

import { useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryChart({ transactions }) {
  // Debug - log transactions to inspect the data
  useEffect(() => {
    console.log("Transactions in CategoryChart:", transactions);
  }, [transactions]);

  const categoryData = useMemo(() => {
    // Handle case where transactions might be undefined or empty
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Create a map for fast category lookups
    const categoryMap = CATEGORIES.reduce((acc, cat) => {
      acc[cat.id.toLowerCase()] = cat;
      return acc;
    }, {});

    // Try multiple ways to match categories
    const totals = CATEGORIES.map(cat => {
      const categoryId = cat.id.toLowerCase();
      const categoryName = cat.name.toLowerCase();
      
      // Calculate value using several potential category formats
      const value = transactions.reduce((sum, t) => {
        // Extract the amount as a number
        let amount = 0;
        if (t.amount) {
          if (typeof t.amount === 'string') {
            amount = parseFloat(t.amount.replace(/[₹,]/g, '')) || 0;
          } else {
            amount = parseFloat(t.amount) || 0;
          }
        }

        // Check multiple possible ways the category might be stored
        const transactionCategory = t.category ? 
          (typeof t.category === 'string' ? t.category.toLowerCase() : t.category) : 
          '';
          
        // Match by ID, name, or try to infer from description
        const isMatch = 
          transactionCategory === categoryId || 
          transactionCategory === categoryName ||
          // If no category but description matches, use that (e.g., "Rent" description = Rent category)
          (!transactionCategory && t.description && 
            t.description.toLowerCase().includes(categoryName));
            
        return sum + (isMatch ? amount : 0);
      }, 0);

      return {
        name: cat.name,
        value,
        color: cat.color
      };
    });
    
    // Only return categories with values
    const filteredTotals = totals.filter(item => item.value > 0);
    
    // If nothing matched but we have transactions, create an "Uncategorized" category
    if (filteredTotals.length === 0 && transactions.length > 0) {
      const uncategorizedTotal = transactions.reduce((sum, t) => {
        const amount = parseFloat(t.amount?.replace(/[₹,]/g, '')) || 0;
        return sum + amount;
      }, 0);
      
      if (uncategorizedTotal > 0) {
        filteredTotals.push({
          name: "Uncategorized",
          value: uncategorizedTotal,
          color: "#cccccc"
        });
      }
    }
    
    console.log("Category data computed:", filteredTotals);
    return filteredTotals;
  }, [transactions]);

  // If no data, show a message instead of empty chart
  if (categoryData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No categories to display. Add some transactions with categories.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

