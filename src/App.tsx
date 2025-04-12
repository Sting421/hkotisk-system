import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { StaffLayout } from "./components/StaffLayout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StaffLogin from "./pages/StaffLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
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
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/signup" element={<StudentSignup />} />
                <Route path="/student/dashboard" element={<StudentView />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Staff Routes */}
                <Route path="/auth" element={<StaffLogin />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route
                  path="/staff/*"
                  element={
                    <ProtectedRoute
                      element={
                        <StaffLayout>
                          <Routes>
                            <Route path="/" element={<StaffDashboard />} />
                            <Route path="/dashboard" element={<StaffDashboard />} />
                            <Route path="/products" element={<ProductManagement />} />
                            <Route path="/products/add" element={<AddEditProduct />} />
                            <Route path="/products/edit/:id" element={<AddEditProduct />} />
                            <Route path="/inventory" element={<InventoryMonitoring />} />
                            <Route path="/orders" element={<OrderManagement />} />
                            <Route path="/settings" element={<StaffDashboard />} />
                          </Routes>
                        </StaffLayout>
                      }
                    />
                  }
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
