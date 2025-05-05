
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const ProductList = ({ products, onEdit, onDelete, onPurchase }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-lg">{product.name}</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
          <p className="text-sm text-gray-600">Price: M{product.price}</p>
          <p className="text-sm text-gray-600 mt-2">{product.description}</p>
          {parseInt(product.quantity) > 0 && (
            <Button
              onClick={() => onPurchase(product)}
              className="mt-4 w-full"
              variant="outline"
            >
              Purchase
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList;
