"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/constants";

export default function BudgetForm({ budgets, setBudgets }) {
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [error, setError] = useState("");

  // Initialize form with existing budgets or empty values
  useEffect(() => {
    const initialBudgets = {};
    CATEGORIES.forEach(cat => {
      // Convert existing budget numbers to strings for the input
      initialBudgets[cat.id] = budgets[cat.id]?.toString() || "";
    });
    setCategoryBudgets(initialBudgets);
  }, [budgets]);
  

  const handleChange = (categoryId, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  // components/BudgetForm.js
const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate inputs
    const newBudgets = {};
    let hasError = false;
    
    Object.entries(categoryBudgets).forEach(([categoryId, budgetValue]) => {
      // Convert to string first, then trim
      const budgetStr = String(budgetValue).trim();
      
      if (budgetStr === "") {
        // Allow empty budgets (treated as 0)
        newBudgets[categoryId] = 0;
        return;
      }
      
      const parsedValue = parseFloat(budgetStr);
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        setError(`Invalid budget for ${CATEGORIES.find(c => c.id === categoryId)?.name}`);
        hasError = true;
        return;
      }
      
      newBudgets[categoryId] = parsedValue;
    });
    
    if (hasError) return;
    
    setError("");
    setBudgets(newBudgets);
  };
  

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Set Monthly Budgets</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {CATEGORIES.map(category => (
          <div key={category.id} className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
            <Label className="w-24 text-sm font-medium">{category.name}</Label>
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={categoryBudgets[category.id] || ""}
                  onChange={(e) => handleChange(category.id, e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        ))}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          Save Budgets
        </Button>
      </form>
    </div>
  );
}
