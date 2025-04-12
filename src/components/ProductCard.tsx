
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Edit } from "lucide-react";
import { Product } from "@/contexts/ProductContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = "",
}) => {
  const { isAuthenticated, user } = useAuth();
  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  const isLowStock = product.stockLevel <= product.lowStockThreshold;
  const isOutOfStock = product.stockLevel <= 0;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-elevation-2 ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-hko-text-primary/60 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-medium px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        ) : isLowStock ? (
          <Badge 
            variant="outline" 
            className="absolute top-3 right-3 bg-amber-400 text-amber-900 hover:bg-amber-400/90"
          >
            Low Stock
          </Badge>
        ) : null}
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg leading-tight text-hko-text-primary">
            {product.name}
          </h3>
          <Badge variant="outline" className="text-xs font-normal">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-hko-text-secondary mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-hko-text-primary">
            {product.prices.length > 1 ? (
              <>From ${Math.min(...product.prices).toFixed(2)}</>
            ) : (
              <>${product.prices[0].toFixed(2)}</>
            )}
          </p>
          {isStaff && (
            <p className="text-xs text-hko-text-muted">
              Stock: {product.stockLevel} units
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isStaff ? (
          <Link to={`/staff/products/edit/${product.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="w-full"
            variant={isOutOfStock ? "outline" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
