"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TransactionForm({ setTransactions }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim whitespace from description
    const trimmedDescription = description.trim();

    // Validation checks
    if (!amount || !date || !trimmedDescription) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (new Date(date) > new Date()) {
      setError("Date cannot be in the future");
      return;
    }

    if (trimmedDescription.length > 50) {
      setError("Description too long (max 50 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create new transaction object
      const newTransaction = {
        amount: `₹${Number(amount).toFixed(2)}`,
        date: date,
        description: trimmedDescription,
      };

      // Update parent state
      setTransactions((prev) => [...prev, newTransaction]);

      // Reset form
      setAmount("");
      setDate("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mt-2"
          min="0.01"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="date" className="text-sm font-medium text-gray-700">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="mt-2"
          maxLength={50}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}

export default TransactionForm;
