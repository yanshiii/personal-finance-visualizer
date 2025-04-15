// app/page.js
"use client";

import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpensesChart from "../components/ExpensesChart";

export default function Home() {
  const [transactions, setTransactions] = useState([]);


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Personal Finance Visualizer</h1>
        <p className="text-lg text-gray-600">Track your expenses, manage transactions, and visualize spending patterns</p>
      </header>

      <main className="max-w-screen-xl mx-auto space-y-12">
        {/* Top section with form and history */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          {/* Add Transaction Form */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
            <TransactionForm setTransactions={setTransactions} />
          </section>

          {/* Transaction History */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <TransactionList transactions={transactions} setTransactions={setTransactions} />
          </section>
        </div>

        {/* Monthly Expenses Chart - Full width section */}
        <section className="mt-8">
          <ExpensesChart transactions={transactions} />
        </section>
      </main>
    </div>
  );
}
