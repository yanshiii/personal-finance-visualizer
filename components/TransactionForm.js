import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define your categories
const categories = [
  "Groceries",
  "Rent",
  "Transport",
  "Entertainment",
  "Utilities"
];

function TransactionForm({ setTransactions }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim whitespace from description
    const trimmedDescription = description.trim();

    // Today's date in yyyy-mm-dd format
    const todayStr = new Date().toISOString().split('T')[0];

    // Validation checks
    if (!amount || !date || !trimmedDescription || !category) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (date > todayStr) {
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
      // Create new transaction object (INCLUDE CATEGORY)
      const newTransaction = {
        amount: `₹${Number(amount).toFixed(2)}`,
        date: date,
        description: trimmedDescription,
        category: category,
      };

      setTransactions((prev) => [...prev, newTransaction]);

      // Reset form
      setAmount("");
      setDate("");
      setDescription("");
      setCategory(categories[0]);
    } catch (err) {
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
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
        />
      </div>
      <div>
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category
        </Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md">
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}

export default TransactionForm;
