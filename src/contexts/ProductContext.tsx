import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

export type ProductFormData = {
  id?: string;
  name: string;
  description: string;
  prices: number[];
  sizes: string[];
  quantity: number[];
  category: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  prices: number[];
  sizes: string[];
  quantity: number[];
  category: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  stockLevel: number;
  lowStockThreshold: number;
};

type ApiProduct = {
  productId: number;
  productName: string;
  description: string;
  prices: number[];
  sizes: string[];
  quantity: number[];
  category: string;
  productImage: string;
  createdAt?: string;
  updatedAt?: string;
};

// Transform API response to match our Product type
const transformApiResponse = (data: ApiProduct): Product => ({
  id: data.productId?.toString() || '',
  name: data.productName || '',
  description: data.description || '',
  prices: data.prices || [],
  sizes: data.sizes || [],
  quantity: data.quantity || [],
  category: data.category || '',
  imageUrl: data.productImage || '',
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  stockLevel: data.quantity.reduce((sum, qty) => sum + qty, 0),
  lowStockThreshold: 10 // Default threshold, can be adjusted as needed
});

type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (productData: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProducts = async (authToken: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/product`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const productList = response?.data?.oblist || response?.data || [];
      setProducts(productList.map(transformApiResponse));
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/staff/login');
      }
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setIsLoading(false);
      navigate('/staff/login');
      return;
    }
    fetchProducts(authToken);
  }, [navigate]);

  const addProduct = async (product: ProductFormData) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        navigate('/staff/login');
      return;
    }

    try {
      // Transform the data to match API expectations
      const apiProduct = {
        productName: product.name,
        description: product.description,
        prices: product.prices,
        sizes: product.sizes,
        quantity: product.quantity,
        category: product.category,
        productImage: product.imageUrl
      };
      
      await axios.post(`${baseUrl}/staff/product`, apiProduct, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      fetchProducts(authToken);
      toast.success(`Product "${product.name}" added successfully`);
    } catch (error) {
      console.error('Error adding product:', error);
      if (error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/staff/login');
      }
      toast.error("Failed to add product. Please try again.");
    }
  };

  const updateProduct = async (productData: ProductFormData) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      navigate('/staff/login');
      return;
    }

    try {
      // Transform the data to match API expectations
      const apiProduct = {
        productId: parseInt(productData.id || '0'),
        productName: productData.name,
        description: productData.description,
        prices: productData.prices,
        sizes: productData.sizes,
        quantity: productData.quantity,
        category: productData.category,
        productImage: productData.imageUrl
      };

      const response = await axios.put(`${baseUrl}/staff/product`, apiProduct, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        await fetchProducts(authToken);
        toast.success("Product updated successfully");
        navigate('/staff/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/staff/login');
      }
      toast.error("Failed to update product. Please try again.");
    }
  };

  const deleteProduct = async (id: string) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      navigate('/staff/login');
      return;
    }

    try {
      await axios.delete(`${baseUrl}/staff/product`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          productId: id
        }
      });
      fetchProducts(authToken);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/staff/login');
      }
      toast.error("Failed to delete product. Please try again.");
    }
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
      const minProductPrice = Math.min(...product.prices);
      if (filters.minPrice !== undefined && minProductPrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && minProductPrice > filters.maxPrice) {
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
