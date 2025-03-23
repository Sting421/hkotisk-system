
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import ProductManagement from "./pages/ProductManagement";
import AddEditProduct from "./pages/AddEditProduct";
import InventoryMonitoring from "./pages/InventoryMonitoring";
import StudentView from "./pages/StudentView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Common Routes */}
              <Route path="/" element={<Index />} />
              
              {/* Student Routes */}
              <Route path="/browse" element={<StudentView />} />
              <Route path="/cart" element={<StudentView />} />
              
              {/* Staff Routes */}
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/products" element={<ProductManagement />} />
              <Route path="/staff/products/add" element={<AddEditProduct />} />
              <Route path="/staff/products/edit/:id" element={<AddEditProduct />} />
              <Route path="/staff/inventory" element={<InventoryMonitoring />} />
              <Route path="/staff/orders" element={<StaffDashboard />} />
              <Route path="/staff/settings" element={<StaffDashboard />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
