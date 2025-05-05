
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const QueryResponse = ({ query, onRespond }) => {
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRespond(query.id, response);
    setResponse("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Response</label>
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows="3"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
          ></textarea>
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Send Response
        </Button>
      </form>
    </motion.div>
  );
};

export default QueryResponse;
