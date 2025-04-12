
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockAlert } from "@/components/StockAlert";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, LineChart } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const InventoryMonitoring = () => {
  const { isAuthenticated } = useAuth();
  const { products, isLoading, getLowStockProducts } = useProducts();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [stockStatusData, setStockStatusData] = useState([]);

  // Handle auth protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff/login");
    }
  }, [isAuthenticated, navigate]);

  // Process data for charts
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      // Process category data
      const categoryCounts = {};
      products.forEach(product => {
        if (categoryCounts[product.category]) {
          categoryCounts[product.category]++;
        } else {
          categoryCounts[product.category] = 1;
        }
      });

      const categoryDataArray = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value
      }));

      setCategoryData(categoryDataArray);

      // Process stock status data
      const lowStock = products.filter(p => p.stockLevel <= p.lowStockThreshold && p.stockLevel > 0).length;
      const outOfStock = products.filter(p => p.stockLevel === 0).length;
      const healthyStock = products.filter(p => p.stockLevel > p.lowStockThreshold).length;

      setStockStatusData([
        { name: 'Healthy Stock', value: healthyStock, color: '#51CF66' },
        { name: 'Low Stock', value: lowStock, color: '#FFD43B' },
        { name: 'Out of Stock', value: outOfStock, color: '#FA5252' }
      ]);
    }
  }, [isLoading, products]);

  const lowStockProducts = getLowStockProducts();
  
  // Get products with highest stock
  const topStockedProducts = [...products]
    .sort((a, b) => b.stockLevel - a.stockLevel)
    .slice(0, 5);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-hko-background">
     

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-6">
            <h1 className="text-3xl font-bold text-hko-text-primary">
              Inventory Monitoring
            </h1>
            <p className="text-hko-text-secondary mt-1">
              Track stock levels and inventory status across products
            </p>
          </div>

          {/* Low Stock Alert */}
          <div className="mb-6">
            {lowStockProducts.length > 0 && <StockAlert products={lowStockProducts} />}
          </div>

          {/* Stock Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Total Inventory</span>
                  <Package className="h-5 w-5 text-hko-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-hko-text-primary mb-2">
                  {products.reduce((total, product) => total + product.stockLevel, 0)} units
                </div>
                <p className="text-sm text-hko-text-secondary">
                  Across {products.length} unique products
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Low Stock Items</span>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500 mb-2">
                  {lowStockProducts.length}
                </div>
                <Progress 
                  value={(lowStockProducts.length / products.length) * 100} 
                  className="h-2 bg-amber-100"
                />
                <p className="text-xs text-hko-text-secondary mt-2">
                  {((lowStockProducts.length / products.length) * 100).toFixed(1)}% of inventory needs attention
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-subtle hover:shadow-elevation-1 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Inventory Value</span>
                  <LineChart className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500 mb-2">
                  ${products.reduce((total, product) => total + (product.price * product.stockLevel), 0).toFixed(2)}
                </div>
                <p className="text-sm text-hko-text-secondary">
                  Total retail value of current inventory
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stock Status Chart */}
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Stock Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {stockStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stockStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {stockStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-hko-text-secondary">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product by Category Chart */}
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                          formatter={(value) => [`${value} products`, 'Count']}
                        />
                        <Bar dataKey="value" fill="#74C0FC" barSize={40} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-hko-text-secondary">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Stocked Products */}
          <Card className="shadow-subtle mb-8">
            <CardHeader>
              <CardTitle>Top Stocked Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topStockedProducts.length > 0 ? (
                <div className="space-y-4">
                  {topStockedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center">
                      <div className="mr-4 w-8 text-center text-hko-text-muted font-medium">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium text-hko-text-primary">{product.name}</div>
                          <div className="text-hko-text-primary font-semibold">{product.stockLevel} units</div>
                        </div>
                        <Progress 
                          value={(product.stockLevel / Math.max(...products.map(p => p.stockLevel))) * 100}
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-hko-text-secondary">
                  No products available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/staff/products")}>
              Manage Products
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/staff/dashboard")}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryMonitoring;
