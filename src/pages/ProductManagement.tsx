
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, Product } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Search, AlertTriangle } from "lucide-react";

const ProductManagement = () => {
  const { isAuthenticated } = useAuth();
  const { products, isLoading, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Handle auth protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle filtering
  useEffect(() => {
    if (!isLoading) {
      let filtered = [...products];

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        );
      }

      // Filter by category
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      // Filter by low stock
      if (showLowStock) {
        filtered = filtered.filter(
          (product) => product.stockLevel <= product.lowStockThreshold
        );
      }

      // Sort by name
      filtered.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredProducts(filtered);
    }
  }, [isLoading, products, searchTerm, selectedCategory, showLowStock]);

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  // Extract unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-hko-background">
      

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-hko-text-primary">
                Product Management
              </h1>
              <p className="text-hko-text-secondary mt-1">
                View, add, update, and remove products from inventory
              </p>
            </div>
            <Button
              onClick={() => navigate("/staff/products/add")}
              className="mt-4 md:mt-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-subtle border border-hko-border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hko-text-muted" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Low Stock Filter */}
              <div className="flex items-center">
                <Button
                  variant={showLowStock ? "default" : "outline"}
                  onClick={() => setShowLowStock(!showLowStock)}
                  className="w-full"
                >
                  <AlertTriangle
                    className={`h-4 w-4 mr-2 ${
                      showLowStock ? "text-white" : "text-amber-500"
                    }`}
                  />
                  {showLowStock ? "Showing Low Stock Only" : "Show Low Stock"}
                </Button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-subtle border border-hko-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-hko-primary border-t-transparent rounded-full"></div>
                        </div>
                        <p className="text-sm text-hko-text-secondary mt-2">
                          Loading products...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-hko-text-secondary">
                          No products found.
                        </p>
                        {searchTerm || selectedCategory || showLowStock ? (
                          <Button
                            variant="ghost"
                            className="mt-2"
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedCategory("");
                              setShowLowStock(false);
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => navigate("/staff/products/add")}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add your first product
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-3 rounded overflow-hidden bg-hko-secondary flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-hko-text-primary">
                                {product.name}
                              </div>
                              <div className="text-xs text-hko-text-muted truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.prices.length > 1 ? (
                            <>From ${Math.min(...product.prices).toFixed(2)}</>
                          ) : (
                            <>₱{product.prices[0].toFixed(2)}</>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              product.stockLevel <= 0
                                ? "text-red-500 font-medium"
                                : product.stockLevel <=
                                  product.lowStockThreshold
                                ? "text-amber-500 font-medium"
                                : "font-medium"
                            }
                          >
                            {product.stockLevel}
                          </span>
                          <span className="text-xs text-hko-text-muted ml-1">
                            units
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.stockLevel <= 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : product.stockLevel <=
                            product.lowStockThreshold ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                            >
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            >
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/staff/products/edit/${product.id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setProductToDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete{" "}
                                    <span className="font-semibold">
                                      {product.name}
                                    </span>
                                    . This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setProductToDelete(null)}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteProduct}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;
