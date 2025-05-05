
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { queryService } from "@/services/dataService";
import { calculateSimilarity } from "@/utils/textProcessing";
import QueryAnalytics from "@/components/QueryAnalytics";
import QueryResponse from "@/components/QueryResponse";

const QueryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Query</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Submit Query
        </Button>
      </form>
    </motion.div>
  );
};

const QueryList = ({ queries, onRespond }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white shadow rounded-lg p-6"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Query History</h3>
    <div className="space-y-4">
      {queries.map((query) => (
        <div
          key={query.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">Query #{query.queryNumber} - {query.name}</h4>
              <p className="text-sm text-gray-600">{query.email}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                query.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {query.status}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{query.message}</p>
          {query.response && (
            <div className="mt-2 pl-4 border-l-2 border-indigo-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Response #{query.queryNumber}:</span> {query.response}
              </p>
              {query.automated && (
                <p className="text-xs text-gray-500 mt-1">
                  (Automated Response)
                </p>
              )}
            </div>
          )}
          {query.status === "pending" && (
            <QueryResponse query={query} onRespond={onRespond} />
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = () => {
    const loadedQueries = queryService.getAll();
    setQueries(loadedQueries);
  };

  const handleRespond = (queryId, response) => {
    try {
      queryService.updateStatus(queryId, "completed", response);
      loadQueries();
      toast({
        title: "Success",
        description: "Query response sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send response",
      });
    }
  };

  const findSimilarQueryAndRespond = (newQuery) => {
    const existingQueries = queryService.getAll();
    let bestMatch = null;
    let highestSimilarity = 0;

    existingQueries.forEach(query => {
      if (query.status === "completed" && query.response) {
        const similarity = calculateSimilarity(newQuery.message, query.message);
        if (similarity > highestSimilarity && similarity > 0.7) {
          highestSimilarity = similarity;
          bestMatch = query;
        }
      }
    });

    return bestMatch;
  };

  const handleSubmit = (formData) => {
    try {
      const similarQuery = findSimilarQueryAndRespond(formData);
      const newQuery = {
        ...formData,
        automated: !!similarQuery
      };

      if (similarQuery) {
        newQuery.response = similarQuery.response;
        newQuery.status = "completed";
      }

      queryService.add(newQuery);
      loadQueries();

      toast({
        title: "Success",
        description: similarQuery
          ? "Query submitted and automatically responded"
          : "Query submitted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit query",
      });
    }
  };

  return (
    <div className="space-y-6">
      <QueryForm onSubmit={handleSubmit} />
      <QueryAnalytics queries={queries} />
      <QueryList queries={queries} onRespond={handleRespond} />
    </div>
  );
};

export default Queries;
