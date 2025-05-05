
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ProductForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [product, setProduct] = useState(initialData || {
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
    if (!initialData) {
      setProduct({
        name: "",
        category: "",
        quantity: "",
        price: "",
        description: ""
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          >
            <option value="">Select category</option>
            <option value="RAM">RAM</option>
            <option value="Hard Drive">Hard Drive</option>
            <option value="Motherboard">Motherboard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (M)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows="3"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        ></textarea>
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="w-full md:w-auto">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full md:w-auto">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
