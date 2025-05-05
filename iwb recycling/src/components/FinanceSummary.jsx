
import React from "react";
import { motion } from "framer-motion";

const FinanceSummary = ({ data }) => {
  const totalRevenue = data.revenue.reduce((sum, val) => sum + parseFloat(val), 0);
  const totalExpenses = data.expenses.reduce((sum, val) => sum + parseFloat(val), 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold text-green-800">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">M{totalRevenue.toLocaleString()}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-600">M{totalExpenses.toLocaleString()}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold text-blue-800">Total Profit</h3>
        <p className="text-3xl font-bold text-blue-600">M{totalProfit.toLocaleString()}</p>
      </motion.div>
    </div>
  );
};

export default FinanceSummary;
