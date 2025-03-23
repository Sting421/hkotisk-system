
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  X, 
  ShoppingCart, 
  LayoutDashboard, 
  Package, 
  ListOrdered, 
  Settings 
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const staffNavItems = [
    { name: "Dashboard", path: "/staff", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { name: "Products", path: "/staff/products", icon: <Package className="h-4 w-4 mr-2" /> },
    { name: "Orders", path: "/staff/orders", icon: <ListOrdered className="h-4 w-4 mr-2" /> },
    { name: "Settings", path: "/staff/settings", icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  const studentNavItems = [
    { name: "Browse", path: "/browse", icon: <Package className="h-4 w-4 mr-2" /> },
    { name: "Cart", path: "/cart", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
  ];

  const isStaffRoute = location.pathname.startsWith("/staff");
  const navItems = isStaffRoute ? staffNavItems : studentNavItems;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur border-b border-hko-border shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-semibold text-hko-text-primary tracking-tight">
                HKOTISK
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Only show nav items if authenticated in staff routes */}
            {(!isStaffRoute || (isStaffRoute && isAuthenticated)) && (
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      location.pathname === item.path
                        ? "text-hko-text-primary bg-hko-secondary"
                        : "text-hko-text-secondary hover:text-hko-text-primary hover:bg-hko-secondary/60"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Login/Logout */}
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-hko-text-secondary">
                    {user?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-hko-text-secondary hover:text-hko-text-primary"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                isStaffRoute && (
                  <Link to="/staff/login">
                    <Button variant="outline" size="sm">
                      Staff Login
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-hko-text-secondary hover:text-hko-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hko-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-hko-border animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {(!isStaffRoute || (isStaffRoute && isAuthenticated)) && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      location.pathname === item.path
                        ? "bg-hko-secondary text-hko-text-primary"
                        : "text-hko-text-secondary hover:bg-hko-secondary/60 hover:text-hko-text-primary"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </>
            )}

            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-hko-text-secondary hover:text-hko-text-primary"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              isStaffRoute && (
                <Link to="/staff/login" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Staff Login
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
