
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/contexts/ProductContext";
import { Link } from "react-router-dom";

interface StockAlertProps {
  products: Product[];
}

export const StockAlert: React.FC<StockAlertProps> = ({ products }) => {
  if (!products.length) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200 animate-scale-in">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center justify-between">
        <span>Low Stock Alert</span>
        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </AlertTitle>
      <AlertDescription className="text-amber-700">
        <div className="mt-2 space-y-2">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex justify-between items-center text-sm">
              <span>{product.name}</span>
              <span className="font-medium">{product.stockLevel} left</span>
            </div>
          ))}
          {products.length > 3 && (
            <div className="text-xs text-amber-600 italic">
              And {products.length - 3} more...
            </div>
          )}
          <Link to="/staff/products" className="block mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-amber-700 bg-amber-100 border-amber-200 hover:bg-amber-200 hover:text-amber-800"
            >
              Review Low Stock Items
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
};
