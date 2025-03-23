
import React, { useState, useEffect } from "react";
import { Product, ProductFormData } from "@/contexts/ProductContext";
import { Navbar } from "@/components/Navbar";
import { ProductForm } from "@/components/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddEditProduct = () => {
  const { isAuthenticated } = useAuth();
  const { getProductById, addProduct, updateProduct, isLoading } = useProducts();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!id;

  // Handle auth protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch product data for edit mode
  useEffect(() => {
    if (isEditMode && !isLoading) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Product not found, redirect to products page
        navigate("/staff/products");
      }
    }
  }, [id, isLoading, getProductById, navigate, isEditMode]);

  const handleSubmit = async (formData: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id && formData.name && formData.description && formData.prices && formData.sizes && formData.quantity && formData.category && formData.imageUrl) {
        const productData: ProductFormData = {
          id,
          name: formData.name,
          description: formData.description,
          prices: formData.prices,
          sizes: formData.sizes,
          quantity: formData.quantity,
          category: formData.category,
          imageUrl: formData.imageUrl
        };
        await updateProduct(productData);
      } else if (formData.name && formData.description && formData.prices && formData.sizes && formData.quantity && formData.category && formData.imageUrl) {
        const productData: ProductFormData = {
          name: formData.name,
          description: formData.description,
          prices: formData.prices,
          sizes: formData.sizes,
          quantity: formData.quantity,
          category: formData.category,
          imageUrl: formData.imageUrl
        };
        await addProduct(productData);
        navigate("/staff/products");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-hko-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="py-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/staff/products")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-hko-text-primary">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-hko-text-secondary mt-1">
                  {isEditMode
                    ? "Update product details and inventory information"
                    : "Create a new product entry for your inventory"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-subtle border border-hko-border p-6 animate-fade-in">
            {isEditMode && isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-hko-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-hko-text-secondary mt-4">Loading product data...</p>
              </div>
            ) : (
              <ProductForm
                initialData={product || {}}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddEditProduct;
