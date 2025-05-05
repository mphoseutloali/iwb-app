
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { productService } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => 
    
    {
// Example: Fetch products
useEffect(() => {
  fetch("https://<region>-<project-id>.cloudfunctions.net/api/products")
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);

    loadProducts();
    loadPurchaseHistory();
  }, []);

  const loadProducts = () => {
    const loadedProducts = productService.getAll();
    setProducts(loadedProducts);
  };

  const loadPurchaseHistory = () => {
    const history = productService.getPurchaseHistory();
    setPurchaseHistory(history);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      productService.add(newProduct);
      loadProducts();
      setNewProduct({ name: "", category: "", quantity: "", price: "", description: "" });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product",
      });
    }
  };

  const handlePurchase = async (product) => {
    try {
      const purchase = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        purchaseDate: new Date().toISOString(),
        userId: user.username
      };
      
      await productService.addPurchase(purchase);
      
      // Update product quantity
      const updatedProduct = {
        ...product,
        quantity: parseInt(product.quantity) - 1
      };
      await productService.update(product.id, updatedProduct);
      
      loadProducts();
      loadPurchaseHistory();
      
      toast({
        title: "Success",
        description: `Successfully purchased ${product.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process purchase",
      });
    }
  };

  const handleBackup = () => {
    try {
      const backupKey = productService.backup();
      toast({
        title: "Success",
        description: "Products and sales data backup created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create backup",
      });
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === "sales" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
            <Button onClick={handleBackup} variant="outline">
              Backup Products & Sales
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
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
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              ></textarea>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Add Product
            </Button>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
              <p className="text-sm text-gray-600">Price: M{product.price}</p>
              <p className="text-sm text-gray-600 mt-2">{product.description}</p>
              {parseInt(product.quantity) > 0 && (
                <Button
                  onClick={() => handlePurchase(product)}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  Purchase
                </Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchased By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseHistory.map((purchase, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    M{purchase.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.userId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Products;
