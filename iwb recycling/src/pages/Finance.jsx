
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { financeService } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Finance = () => {
  const [monthlyData, setMonthlyData] = useState({
    revenue: [],
    expenses: [],
    profit: [],
    monthlyStatements: []
  });
  const [newStatement, setNewStatement] = useState({
    month: "",
    year: new Date().getFullYear(),
    revenue: "",
    expenses: "",
    details: {
      sales: "",
      salaries: "",
      transportation: "",
      advertising: "",
      other: ""
    }
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const isFinanceUser = user?.role === "finance";

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = () => {
    const data = financeService.getData();
    setMonthlyData(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const totalExpenses = Object.values(newStatement.details).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      );
      
      const statement = {
        ...newStatement,
        expenses: totalExpenses,
        profit: parseFloat(newStatement.revenue) - totalExpenses
      };
      
      financeService.addMonthlyStatement(statement);
      loadFinancialData();
      
      setNewStatement({
        month: "",
        year: new Date().getFullYear(),
        revenue: "",
        expenses: "",
        details: {
          sales: "",
          salaries: "",
          transportation: "",
          advertising: "",
          other: ""
        }
      });
      
      toast({
        title: "Success",
        description: "Monthly statement added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add monthly statement",
      });
    }
  };

  const handleBackup = () => {
    try {
      financeService.backup();
      toast({
        title: "Success",
        description: "Financial data backed up successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to backup financial data",
      });
    }
  };

  const chartData = {
    labels: monthlyData.monthlyStatements.map(s => `${s.month} ${s.year}`),
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.revenue,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      },
      {
        label: "Expenses",
        data: monthlyData.expenses,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1
      },
      {
        label: "Profit",
        data: monthlyData.profit,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1
      }
    ]
  };

  const expenseBreakdownData = {
    labels: ["Sales", "Salaries", "Transportation", "Advertising", "Other"],
    datasets: [
      {
        label: "Expense Breakdown",
        data: monthlyData.monthlyStatements.length > 0
          ? [
              monthlyData.monthlyStatements[monthlyData.monthlyStatements.length - 1].details.sales,
              monthlyData.monthlyStatements[monthlyData.monthlyStatements.length - 1].details.salaries,
              monthlyData.monthlyStatements[monthlyData.monthlyStatements.length - 1].details.transportation,
              monthlyData.monthlyStatements[monthlyData.monthlyStatements.length - 1].details.advertising,
              monthlyData.monthlyStatements[monthlyData.monthlyStatements.length - 1].details.other
            ]
          : [],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
          {isFinanceUser && (
            <Button onClick={handleBackup} variant="outline">
              Backup Financial Data
            </Button>
          )}
        </div>
        <div className="h-[400px]">
          <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: "Monthly Financial Performance"
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Amount (M)"
                }
              }
            }
          }} />
        </div>
      </motion.div>

      {isFinanceUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Monthly Statement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.month}
                  onChange={(e) => setNewStatement({ ...newStatement, month: e.target.value })}
                >
                  <option value="">Select month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.year}
                  onChange={(e) => setNewStatement({ ...newStatement, year: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Revenue (M)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.revenue}
                  onChange={(e) => setNewStatement({ ...newStatement, revenue: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sales Expenses</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.details.sales}
                  onChange={(e) => setNewStatement({
                    ...newStatement,
                    details: { ...newStatement.details, sales: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salaries</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.details.salaries}
                  onChange={(e) => setNewStatement({
                    ...newStatement,
                    details: { ...newStatement.details, salaries: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transportation</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.details.transportation}
                  onChange={(e) => setNewStatement({
                    ...newStatement,
                    details: { ...newStatement.details, transportation: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Advertising</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.details.advertising}
                  onChange={(e) => setNewStatement({
                    ...newStatement,
                    details: { ...newStatement.details, advertising: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Expenses</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newStatement.details.other}
                  onChange={(e) => setNewStatement({
                    ...newStatement,
                    details: { ...newStatement.details, other: e.target.value }
                  })}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Add Statement
            </Button>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Expense Breakdown</h3>
          <div className="h-[300px]">
            <Bar data={expenseBreakdownData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "Expense Categories"
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Amount (M)"
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statements</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.monthlyStatements.map((statement, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {statement.month} {statement.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      M{parseFloat(statement.revenue).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      M{parseFloat(statement.expenses).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      M{parseFloat(statement.profit).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Finance;
