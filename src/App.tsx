import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import ProductManagement from "./pages/ProductManagement";
import AddEditProduct from "./pages/AddEditProduct";
import InventoryMonitoring from "./pages/InventoryMonitoring";
import StudentView from "./pages/StudentView";
import CartPage from "./pages/CartPage";
import OrderManagement from "./pages/OrderManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Index />} />
                
                {/* Student Routes */}
                <Route path="/browse" element={<StudentView />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Staff Routes */}
                <Route path="/auth" element={<StaffLogin />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route 
                  path="/staff" 
                  element={<ProtectedRoute element={<StaffDashboard />} />} 
                />
                <Route 
                  path="/staff/dashboard" 
                  element={<ProtectedRoute element={<StaffDashboard />} />} 
                />
                <Route 
                  path="/staff/products" 
                  element={<ProtectedRoute element={<ProductManagement />} />} 
                />
                <Route 
                  path="/staff/products/add" 
                  element={<ProtectedRoute element={<AddEditProduct />} />} 
                />
                <Route 
                  path="/staff/products/edit/:id" 
                  element={<ProtectedRoute element={<AddEditProduct />} />} 
                />
                <Route 
                  path="/staff/inventory" 
                  element={<ProtectedRoute element={<InventoryMonitoring />} />} 
                />
                <Route 
                  path="/staff/orders" 
                  element={<ProtectedRoute element={<OrderManagement />} />} 
                />
                <Route 
                  path="/staff/settings" 
                  element={<ProtectedRoute element={<StaffDashboard />} />} 
                />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
