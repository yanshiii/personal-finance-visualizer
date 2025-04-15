"use client";

import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpensesChart from "../components/ExpensesChart";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import BudgetForm from "../components/BudgetForm";
import BudgetComparisonChart from "../components/BudgetComparisonChart";
import SpendingInsights from "../components/SpendingInsights";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const years = [];
for (let y = currentYear; y >= currentYear - 3; y--) {
  years.push(y);
}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Filter transactions based on selected month and year
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Personal Finance Visualizer</h1>
        <p className="text-lg text-gray-600">
          Track your expenses, manage transactions, and visualize spending patterns
        </p>
      </header>

      <main className="max-w-screen-xl mx-auto space-y-12">
        {/* Month/Year Selector */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-700">Viewing:</span>
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((month, idx) => {
                // Only show months up to the current month for the current year
                if (selectedYear === currentYear && idx > currentMonth) return null;
                return (
                  <option key={month} value={idx}>{month}</option>
                );
              })}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard summary cards - Now using filtered transactions */}
        <SummaryCards 
          transactions={filteredTransactions} 
          month={selectedMonth}
          year={selectedYear}
        />

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpensesChart transactions={transactions} /> {/* Keep yearly overview */}
          <CategoryChart transactions={filteredTransactions} /> {/* Show filtered for selected month */}
        </div>

        {/* Budget management and insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <BudgetForm budgets={budgets} setBudgets={setBudgets} />
          </div>
          <div className="lg:col-span-2">
            <SpendingInsights
              transactions={filteredTransactions}
              budgets={budgets}
              month={selectedMonth}
              year={selectedYear}
            />
          </div>
        </div>

        {/* Budget comparison chart */}
        <BudgetComparisonChart
          transactions={filteredTransactions}
          budgets={budgets}
          month={selectedMonth}
          year={selectedYear}
        />

        {/* Transaction management section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm setTransactions={setTransactions} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <TransactionList 
              transactions={transactions} 
              setTransactions={setTransactions} 
            />
          </section>
        </div>
      </main>
    </div>
  );
}
