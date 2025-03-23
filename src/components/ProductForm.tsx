
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/contexts/ProductContext";

// Schema for product validation
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stockLevel: z.coerce.number().int().nonnegative("Stock must be 0 or more"),
  lowStockThreshold: z.coerce.number().int().positive("Threshold must be positive"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting?: boolean;
}

// Available product categories
const PRODUCT_CATEGORIES = [
  "Stationery",
  "Electronics",
  "Books",
  "Accessories",
  "Snacks",
  "Clothing",
  "Art Supplies",
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      price: initialData.price || 0,
      category: initialData.category || "",
      imageUrl: initialData.imageUrl || "",
      stockLevel: initialData.stockLevel || 0,
      lowStockThreshold: initialData.lowStockThreshold || 5,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Price */}
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
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image URL */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a URL for the product image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Level */}
          <FormField
            control={form.control}
            name="stockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Level</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Low Stock Threshold */}
          <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Stock Threshold</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Alert when stock falls below this level
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

        {/* Image Preview */}
        {form.watch("imageUrl") && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview</p>
            <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border border-hko-border bg-slate-50">
              <img
                src={form.watch("imageUrl")}
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData.id ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};
