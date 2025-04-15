"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

function TransactionList({ transactions, setTransactions }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});

  // Sort transactions by date (latest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleEditClick = (index) => {
    // Make a deep copy of the transaction to edit
    setEditingIndex(index);
    // Ensure all properties exist in the edited transaction
    setEditedTransaction({
      ...sortedTransactions[index],
      amount: sortedTransactions[index].amount || ""
    });
  };

  const handleSaveClick = () => {
    const updatedTransactions = [...sortedTransactions];
    updatedTransactions[editingIndex] = editedTransaction;
    setTransactions(updatedTransactions);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({ ...editedTransaction, [name]: value });
  };

  const handleDeleteClick = (index) => {
    const updatedTransactions = sortedTransactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  if (sortedTransactions.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500 text-lg">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedTransactions.map((transaction, index) => (
        <Card
          key={index}
          className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl min-h-[120px] shadow-sm"
        >
          {editingIndex === index ? (
            <>
              <input
                name="amount"
                type="number"
                // Safely handle the amount conversion
                value={typeof editedTransaction.amount === 'string' ? 
                  editedTransaction.amount.replace(/[₹,]/g, '') : 
                  editedTransaction.amount || ''}
                onChange={handleChange}
                placeholder="Amount"
                className="mb-1 text-center border rounded p-1 text-sm"
                style={{ width: 90 }}
              />
              <input
                name="date"
                type="date"
                value={editedTransaction.date || ''}
                onChange={handleChange}
                className="mb-1 text-center border rounded p-1 text-sm"
                style={{ width: 110 }}
                max={new Date().toISOString().split('T')[0]}
              />
              <select
                name="category"
                value={editedTransaction.category || ''}
                onChange={handleChange}
                className="mb-1 text-center border rounded p-1 text-sm"
                style={{ width: 110 }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                name="description"
                value={editedTransaction.description || ''}
                onChange={handleChange}
                placeholder="Description"
                className="mb-1 text-center border rounded p-1 text-sm"
                style={{ width: 110 }}
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSaveClick} size="icon" className="bg-blue-100 hover:bg-blue-200 rounded-full h-8 w-8" title="Save">
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
                <Button onClick={() => setEditingIndex(null)} size="icon" className="bg-gray-100 hover:bg-gray-200 rounded-full h-8 w-8" title="Cancel">
                  X
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center flex-grow">
                <p className="font-bold text-lg mb-1">{transaction.amount || '₹0'}</p>
                <p className="text-sm text-gray-600">{transaction.date || 'No date'}</p>
                <p className="text-sm text-gray-600">{transaction.description || 'No description'}</p>
                {/* Category display */}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORIES.find(c => c.id === transaction.category)?.color || '#cccccc' }}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {CATEGORIES.find(c => c.id === transaction.category)?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditClick(index)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-blue-500" />
                </button>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}

export default TransactionList;
