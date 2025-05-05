
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const QueryAnalytics = ({ queries }) => {
  const analytics = useMemo(() => {
    const total = queries.length;
    const automated = queries.filter(q => q.automated).length;
    const pending = queries.filter(q => q.status === "pending").length;
    const completed = queries.filter(q => q.status === "completed").length;

    // Group queries by date
    const queryByDate = queries.reduce((acc, query) => {
      const date = format(new Date(query.createdAt), "MMM dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      automated,
      pending,
      completed,
      queryByDate
    };
  }, [queries]);

  const statusData = {
    labels: ["Automated", "Manual", "Pending", "Completed"],
    datasets: [
      {
        data: [
          analytics.automated,
          analytics.total - analytics.automated,
          analytics.pending,
          analytics.completed
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const timelineData = {
    labels: Object.keys(analytics.queryByDate),
    datasets: [
      {
        label: "Queries per Day",
        data: Object.values(analytics.queryByDate),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Query Status Distribution</h4>
          <div className="h-64">
            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Query Timeline</h4>
          <div className="h-64">
            <Line data={timelineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h5 className="text-sm text-gray-500">Total Queries</h5>
          <p className="text-2xl font-bold text-blue-600">{analytics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h5 className="text-sm text-gray-500">Automated Responses</h5>
          <p className="text-2xl font-bold text-green-600">{analytics.automated}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h5 className="text-sm text-gray-500">Pending Queries</h5>
          <p className="text-2xl font-bold text-yellow-600">{analytics.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h5 className="text-sm text-gray-500">Completed Queries</h5>
          <p className="text-2xl font-bold text-purple-600">{analytics.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default QueryAnalytics;
