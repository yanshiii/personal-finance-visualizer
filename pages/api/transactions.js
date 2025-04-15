// pages/api/transactions.js
export default async function handler(req, res) {
    try {
      const data = [
        { amount: 100, date: "2025-04-01", description: "Groceries" },
        { amount: 200, date: "2025-04-05", description: "Transport" },
      ];
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  