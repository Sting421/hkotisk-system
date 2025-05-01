import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;

export type ProductFormData = {
  productId?: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  productImage: string;
  available?: boolean;
};

export type Product = {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  productImage: string;
  available: boolean;
};

type ApiProduct = {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  productImage: string;
  available: boolean;
};

const transformApiResponse = (data: ApiProduct): Product => ({
  productId: data.productId,
  productName: data.productName,
  description: data.description,
  price: data.price,
  quantity: data.quantity,
  category: data.category,
  productImage: data.productImage,
  available: data.available
});

type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (productData: ProductFormData) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  getLowStockProducts: () => Product[];
  getProductById: (productId: string) => Product | undefined;
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

  const fetchProducts = async () => {
    setIsLoading(true);
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      navigate('/staff/login');
      return;
    }

    try {
      const endpoint = `${baseUrl}/user/product`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const productList = response?.data?.oblist ?? [];
      setProducts(productList.map(transformApiResponse));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: ProductFormData) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        navigate('/staff/login');
      return;
    }

    try {
      await axios.post(`${baseUrl}/staff/product`, {
        ...product,
        available: product.available ?? true
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      fetchProducts();
      toast.success(`Product "${product.productName}" added successfully`);
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
      const response = await axios.put(`${baseUrl}/staff/product/${productData.productId}`, productData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        await fetchProducts();
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

  const deleteProduct = async (productId: number) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      navigate('/staff/login');
      return;
    }

    try {
      await axios.delete(`${baseUrl}/staff/product?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          productId: productId
        }
      });
      fetchProducts();
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
    return products.filter(product => product.quantity <= 10); // Using fixed threshold of 10
  };

  const getProductById = (productId: string) => {
    return products.find(product => product.productId.toString() === productId);
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
        const nameMatch = product.productName.toLowerCase().includes(searchTerm);
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
      if (filters.inStock !== undefined && filters.inStock && (!product.available || product.quantity <= 0)) {
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
