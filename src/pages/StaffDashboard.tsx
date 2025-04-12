
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StockAlert } from "@/components/StockAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Package, LineChart, ShoppingCart, ArrowRight, PlusCircle, List, AlertTriangle } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const StaffDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, isLoading, getLowStockProducts } = useProducts();
  const navigate = useNavigate();
  const [lastAddedProducts, setLastAddedProducts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      // Get the 3 most recently added products
      const sorted = [...products].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLastAddedProducts(sorted.slice(0, 3));
    }
  }, [isLoading, products]);

  const lowStockProducts = getLowStockProducts();
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.stockLevel <= 0).length;

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-hko-background">
      
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-6">
            <h1 className="text-3xl font-bold text-hko-text-primary">Dashboard</h1>
            <p className="text-hko-text-secondary mt-2">
              Welcome back, {user?.name}! Here's an overview of your inventory.
            </p>
          </div>

          {/* Low Stock Alert */}
          <div className="mb-6">
            {lowStockProducts.length > 0 && <StockAlert products={lowStockProducts} />}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Products */}
            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Total Products</span>
                  <Package className="h-5 w-5 text-hko-primary" />
                </CardTitle>
                <CardDescription>Inventory item count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-hko-text-primary">
                  {totalProducts}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Items */}
            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Low Stock</span>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </CardTitle>
                <CardDescription>Items below threshold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">
                  {lowStockProducts.length}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock */}
            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Out of Stock</span>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </CardTitle>
                <CardDescription>Products at zero stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {outOfStockCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => navigate("/staff/products/add")} 
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Product
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => navigate("/staff/products")} 
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <List className="mr-2 h-4 w-4" />
                    View All Products
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => navigate("/staff/orders")} 
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Manage Orders
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle className="text-xl">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-hko-border">
                    <span className="text-hko-text-secondary">Inventory Status</span>
                    <span className={`font-medium ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                      {lowStockProducts.length > 0 ? 'Attention Needed' : 'Healthy'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-hko-border">
                    <span className="text-hko-text-secondary">Last System Update</span>
                    <span className="font-medium text-hko-text-primary">
                      {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-hko-text-secondary">User Role</span>
                    <span className="font-medium text-hko-text-primary capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Products */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-hko-text-primary">Recently Added Products</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/staff/products")}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {lastAddedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              
              {lastAddedProducts.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12 text-hko-text-secondary">
                  No products added yet. Start by adding your first product.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
