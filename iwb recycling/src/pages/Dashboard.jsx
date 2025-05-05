
import React from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to IWB Recycling
        </h2>
        <p className="text-gray-600">
          IWB is a pioneering electronic recycling company in Lesotho, specializing in
          recycling computer parts including RAM, Hard Drives, and Motherboard
          components.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Company Overview
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Founded: 2024</li>
            <li>Initial Capital: M100,000</li>
            <li>Co-Founders: Kenneth and Shadrack</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Our Services
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>RAM Recycling</li>
            <li>Hard Drive Processing</li>
            <li>Motherboard Component Recovery</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Market Position
          </h3>
          <p className="text-gray-600">
            Leading electronic recycling company in the Southern Region of Africa,
            with growing international partnerships and investor interest.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
