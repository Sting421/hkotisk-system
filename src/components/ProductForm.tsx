import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormData } from "@/contexts/ProductContext";

// Schema for product validation
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  prices: z.array(z.number().positive("Price must be positive")),
  sizes: z.array(z.string().min(1, "Size is required")),
  quantity: z.array(z.number().int().nonnegative("Quantity must be 0 or more")),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  image: z.any(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

// Available product categories
const PRODUCT_CATEGORIES = [
  "Food",
  "Beverages"
];

const baseUrl = import.meta.env.VITE_BASE_URL;

// Upload image to backend
const uploadImage = async (file: File) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/staff/product/upload`,
      data: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [hasSizes, setHasSizes] = useState(!!initialData.sizes?.length);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      prices: initialData.prices || [0],
      sizes: initialData.sizes || [""],
      quantity: initialData.quantity || [0],
      category: initialData.category || "",
      imageUrl: initialData.imageUrl || "",
      image: null,
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setIsUploading(true);
      let imageUrl = values.imageUrl;

      // Upload image to Cloudinary if it's a File
      if (values.image instanceof File) {
        imageUrl = await uploadImage(values.image);
      }

      const productData: ProductFormData = {
        name: values.name,
        description: values.description,
        prices: hasSizes ? values.prices : [values.prices[0]],
        sizes: hasSizes ? values.sizes : [],
        quantity: hasSizes ? values.quantity : [values.quantity[0]],
        category: values.category,
        imageUrl: imageUrl || "",
      };

      if (initialData.id) {
        productData.id = initialData.id;
      }

      await onSubmit(productData);
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const addSizeVariant = () => {
    const currentPrices = form.getValues("prices");
    const currentSizes = form.getValues("sizes");
    const currentQuantities = form.getValues("quantity");

    form.setValue("prices", [...currentPrices, 0]);
    form.setValue("sizes", [...currentSizes, ""]);
    form.setValue("quantity", [...currentQuantities, 0]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Has Sizes Toggle */}
          <FormItem className="flex flex-row items-center space-x-2">
            <FormLabel>Has Size Variants?</FormLabel>
            <FormControl>
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
              />
            </FormControl>
          </FormItem>

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Upload a product image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Size Variants */}
        {hasSizes ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Size Variants</h3>
              <Button type="button" onClick={addSizeVariant} variant="outline">
                Add Size Variant
              </Button>
            </div>
            {form.getValues("sizes").map((_, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`sizes.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., S, M, L" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`prices.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`quantity.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prices.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Image Preview */}
        {(form.watch("image") instanceof File || initialData.imageUrl) && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview</p>
            <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border border-hko-border bg-slate-50">
              <img
                src={form.watch("image") instanceof File ? URL.createObjectURL(form.watch("image")) : initialData.imageUrl}
                alt="Product preview"
                className="object-contain w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                }}
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? "Saving..." : initialData.id ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};
