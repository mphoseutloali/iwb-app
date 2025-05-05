
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  // Mock users with specific permissions
  const users = [
    // Sales Personnel (max 3)
    { username: "sales1", password: "sales123", role: "sales", permissions: ["read_products", "write_products", "read_queries", "write_queries"] },
    { username: "sales2", password: "sales123", role: "sales", permissions: ["read_products", "write_products", "read_queries", "write_queries"] },
    { username: "sales3", password: "sales123", role: "sales", permissions: ["read_products", "write_products", "read_queries", "write_queries"] },
    
    // Finance Personnel (max 3)
    { username: "finance1", password: "finance123", role: "finance", permissions: ["read_finance", "write_finance"] },
    { username: "finance2", password: "finance123", role: "finance", permissions: ["read_finance", "write_finance"] },
    { username: "finance3", password: "finance123", role: "finance", permissions: ["read_finance", "write_finance"] },
    
    // Developers (max 3)
    { username: "dev1", password: "dev123", role: "developer", permissions: ["read_all", "write_all"] },
    { username: "dev2", password: "dev123", role: "developer", permissions: ["read_all", "write_all"] },
    { username: "dev3", password: "dev123", role: "developer", permissions: ["read_all", "write_all"] },
    
    // Investors (read-only access to finance)
    { username: "investor1", password: "investor123", role: "investor", permissions: ["read_finance"] },
    { username: "investor2", password: "investor123", role: "investor", permissions: ["read_finance"] },
    
    // IWC Partner (access to everything except queries)
    { username: "iwc_partner", password: "partner123", role: "partner", permissions: ["read_products", "read_finance"] }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const userData = {
        username: user.username,
        role: user.role,
        permissions: user.permissions
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: "Invalid credentials",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === "developer") return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
