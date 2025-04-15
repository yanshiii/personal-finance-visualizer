"use client";

import { useMemo } from "react";
import { CATEGORIES } from "@/lib/constants";
import { ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";

export default function SpendingInsights({ transactions, budgets }) {
  const insights = useMemo(() => {
    if (!transactions.length) {
      return [{
        type: "empty",
        message: "Add transactions to see spending insights"
      }];
    }

    const results = [];
    
    // Get current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate category spending
    const categorySpending = {};
    
    CATEGORIES.forEach(cat => {
      // Current month spending
      const current = transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.category === cat.id && 
                 date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[₹,]/g, '')), 0);
      
      // Last month spending
      const lastMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      const lastMonthYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
      
      const previous = transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.category === cat.id && 
                 date.getMonth() === lastMonth && 
                 date.getFullYear() === lastMonthYear;
        })
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[₹,]/g, '')), 0);
      
      // Get budget
      const budget = budgets[cat.id] || 0;
      
      categorySpending[cat.id] = { current, previous, budget, category: cat };
    });
    
    // Budget alerts (over 80% of budget)
    Object.values(categorySpending).forEach(({ current, budget, category }) => {
      if (budget > 0 && current > 0) {
        const percentage = (current / budget) * 100;
        
        if (percentage >= 100) {
          results.push({
            type: "budget_exceeded",
            category: category.name,
            amount: current,
            budget,
            percentage,
            color: category.color
          });
        } else if (percentage >= 80) {
          results.push({
            type: "budget_warning",
            category: category.name,
            amount: current,
            budget,
            percentage,
            color: category.color
          });
        }
      }
    });
    
    // Spending increase insights (more than 20% increase)
    Object.values(categorySpending).forEach(({ current, previous, category }) => {
      if (previous > 0 && current > 0 && current > previous) {
        const increase = ((current - previous) / previous) * 100;
        
        if (increase >= 20) {
          results.push({
            type: "spending_increase",
            category: category.name,
            current,
            previous,
            increase,
            color: category.color
          });
        }
      }
    });
    
    // Spending decrease insights (more than 20% decrease)
    Object.values(categorySpending).forEach(({ current, previous, category }) => {
      if (previous > 0 && current > 0 && current < previous) {
        const decrease = ((previous - current) / previous) * 100;
        
        if (decrease >= 20) {
          results.push({
            type: "spending_decrease",
            category: category.name,
            current,
            previous,
            decrease,
            color: category.color
          });
        }
      }
    });
    
    // If no insights found, add a generic one
    if (results.length === 0) {
      results.push({
        type: "no_insights",
        message: "Your spending looks consistent with no major concerns"
      });
    }
    
    return results;
  }, [transactions, budgets]);

  const renderInsight = (insight, index) => {
    switch (insight.type) {
      case "budget_exceeded":
        return (
          <div key={index} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
              <h4 className="font-medium">Budget Exceeded</h4>
            </div>
            <p className="mt-1 text-sm">
              Your <span className="font-medium">{insight.category}</span> spending is at{' '}
              <span className="font-medium text-red-600">{insight.percentage.toFixed(0)}%</span> of your budget.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              ₹{insight.amount.toLocaleString()} spent of ₹{insight.budget.toLocaleString()} budget
            </p>
          </div>
        );
      
      case "budget_warning":
        return (
          <div key={index} className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="text-amber-500 mr-2 h-5 w-5" />
              <h4 className="font-medium">Approaching Budget</h4>
            </div>
            <p className="mt-1 text-sm">
              Your <span className="font-medium">{insight.category}</span> spending is at{' '}
              <span className="font-medium text-amber-600">{insight.percentage.toFixed(0)}%</span> of your budget.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              ₹{insight.amount.toLocaleString()} spent of ₹{insight.budget.toLocaleString()} budget
            </p>
          </div>
        );
      
      case "spending_increase":
        return (
          <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
            <div className="flex items-center">
              <ChevronUp className="text-blue-500 mr-2 h-5 w-5" />
              <h4 className="font-medium">Spending Increase</h4>
            </div>
            <p className="mt-1 text-sm">
              Your <span className="font-medium">{insight.category}</span> spending increased by{' '}
              <span className="font-medium">{insight.increase.toFixed(0)}%</span> compared to last month.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              ₹{insight.current.toLocaleString()} this month vs ₹{insight.previous.toLocaleString()} last month
            </p>
          </div>
        );
      
      case "spending_decrease":
        return (
          <div key={index} className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex items-center">
              <ChevronDown className="text-green-500 mr-2 h-5 w-5" />
              <h4 className="font-medium">Spending Decrease</h4>
            </div>
            <p className="mt-1 text-sm">
              Your <span className="font-medium">{insight.category}</span> spending decreased by{' '}
              <span className="font-medium">{insight.decrease.toFixed(0)}%</span> compared to last month.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              ₹{insight.current.toLocaleString()} this month vs ₹{insight.previous.toLocaleString()} last month
            </p>
          </div>
        );
      
      case "no_insights":
        return (
          <div key={index} className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-md">
            <h4 className="font-medium">Looking Good</h4>
            <p className="mt-1 text-sm">{insight.message}</p>
          </div>
        );
      
      case "empty":
        return (
          <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
            <p className="text-gray-500">{insight.message}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => renderInsight(insight, index))}
      </div>
    </div>
  );
}
