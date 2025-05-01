import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  productId: z.number().optional(),
  productName: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().nonnegative("Quantity must be 0 or more"),
  category: z.string().min(1, "Category is required"),
  productImage: z.string().optional(),
  image: z.any(),
  available: z.boolean().optional(),
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

import { uploadToCloudinary } from "@/lib/upload-helper";

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productId: initialData.productId,
      productName: initialData.productName || "",
      description: initialData.description || "",
      price: initialData.price || 0,
      quantity: initialData.quantity || 0,
      category: initialData.category || "",
      productImage: initialData.productImage || "",
      image: null,
      available: initialData.available ?? true,
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setIsUploading(true);
      let imageUrl = values.productImage;

      // Upload image to Cloudinary if it's a File
      if (values.image instanceof File) {
        const uploadResult = await uploadToCloudinary(values.image);
        imageUrl = uploadResult.url;
      }

      const productData: ProductFormData = {
        productId: initialData.productId,
        productName: values.productName,
        description: values.description,
        price: values.price,
        quantity: values.quantity,
        category: values.category,
        productImage: imageUrl || "",
        available: values.available
      };

      await onSubmit(productData);
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder={initialData.productName || "Enter product name"} {...field} />
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
          {/* Available Toggle */}
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormLabel>Available</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  placeholder={initialData.description || "Enter product description"}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={initialData.price?.toString() || "0.00"}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={initialData.quantity?.toString() || "0"}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Preview */}
        {(form.watch("image") instanceof File || initialData.productImage) && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview</p>
            <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border border-hko-border bg-slate-50">
              <img
                src={form.watch("image") instanceof File ? URL.createObjectURL(form.watch("image")) : initialData.productImage}
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
          {isSubmitting || isUploading ? "Saving..." : initialData.productId ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};
