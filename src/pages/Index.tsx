
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ChevronRight, Users, ShoppingCart, LineChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-hko-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-hko-primary/5 to-hko-primary/10 z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hko-text-primary tracking-tight animate-fade-in">
                HKOTISK <span className="text-hko-primary">Kiosk System</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-hko-text-secondary animate-slide-up">
                A streamlined kiosk solution for schools, with dedicated interfaces for staff and students.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto">
                    Student Access
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/staff/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto"
                  >
                    Staff Login
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-hko-text-primary">
                Designed for Simplicity and Efficiency
              </h2>
              <p className="mt-4 text-lg text-hko-text-secondary max-w-3xl mx-auto">
                Our kiosk system streamlines the purchasing process for students while giving staff powerful management tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-hko-background rounded-lg p-8 shadow-subtle border border-hko-border transition-transform hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-md bg-hko-primary/10 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-hko-primary" />
                </div>
                <h3 className="text-xl font-semibold text-hko-text-primary mb-3">
                  Easy Product Management
                </h3>
                <p className="text-hko-text-secondary">
                  Add, update, and manage your inventory with an intuitive interface. Set stock alerts to never run out of popular items.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-hko-background rounded-lg p-8 shadow-subtle border border-hko-border transition-transform hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-md bg-hko-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-hko-primary" />
                </div>
                <h3 className="text-xl font-semibold text-hko-text-primary mb-3">
                  Student-Focused Ordering
                </h3>
                <p className="text-hko-text-secondary">
                  Students can easily browse products, filter by category, and place orders through a clean, user-friendly interface.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-hko-background rounded-lg p-8 shadow-subtle border border-hko-border transition-transform hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-md bg-hko-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-hko-primary" />
                </div>
                <h3 className="text-xl font-semibold text-hko-text-primary mb-3">
                  Real-time Inventory Tracking
                </h3>
                <p className="text-hko-text-secondary">
                  Monitor stock levels in real-time, receive low stock alerts, and access comprehensive inventory reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-hko-background border-t border-hko-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-hko-text-muted">
              <p>© {new Date().getFullYear()} HKOTISK. All rights reserved.</p>
              <p className="mt-2">A sophisticated kiosk system for educational institutions.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
