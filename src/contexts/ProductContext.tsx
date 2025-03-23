
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockLevel: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
};

type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => void;
  deleteProduct: (id: string) => void;
  getLowStockProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  filterProducts: (
    filters: { 
      category?: string; 
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }
  ) => Product[];
};

// Sample product data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Notebook",
    description: "High-quality notebook for students",
    price: 5.99,
    category: "Stationery",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=500",
    stockLevel: 120,
    lowStockThreshold: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Scientific Calculator",
    description: "Advanced calculator for math and science classes",
    price: 19.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?q=80&w=500",
    stockLevel: 45,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Water Bottle",
    description: "Reusable BPA-free water bottle",
    price: 12.50,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500",
    stockLevel: 8,
    lowStockThreshold: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Backpack",
    description: "Durable backpack with multiple compartments",
    price: 34.99,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500",
    stockLevel: 25,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "Bluetooth earbuds with noise cancellation",
    price: 49.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?q=80&w=500",
    stockLevel: 15,
    lowStockThreshold: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading products from an API
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if we have products in localStorage
        const savedProducts = localStorage.getItem("hkotiskProducts");
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          // Use initial sample data
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem("hkotiskProducts", JSON.stringify(INITIAL_PRODUCTS));
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("hkotiskProducts", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts(prev => [...prev, newProduct]);
    toast.success(`Product "${product.name}" added successfully`);
  };

  const updateProduct = (id: string, productUpdate: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...productUpdate, 
              updatedAt: new Date().toISOString() 
            } 
          : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast.success("Product deleted successfully");
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stockLevel <= product.lowStockThreshold);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const filterProducts = (filters: { category?: string; search?: string; minPrice?: number; maxPrice?: number; inStock?: boolean }) => {
    return products.filter(product => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }
      
      // Filter by price range
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      
      // Filter by stock availability
      if (filters.inStock !== undefined && filters.inStock && product.stockLevel <= 0) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts,
        getProductById,
        filterProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
