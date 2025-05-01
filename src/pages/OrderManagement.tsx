import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useState, useMemo } from "react"
import type { Order } from "@/types/order"
import { useOrders } from "@/contexts/OrderContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Navbar } from "@/components/Navbar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StatusBadgeProps = {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants: { [key: string]: string } = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800"
  }

  return (
    <Badge className={variants[status] || variants.PENDING}>
      {status}
    </Badge>
  )
}

const calculateTotal = (products: Order['products']) => {
  return products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export default function OrderManagement() {
  const { orders, isLoading, updateOrderStatus } = useOrders();
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || order.orderStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  const handleStatusChange = async (orderId: number, orderStatus: string, email: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, orderStatus, email);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      
      <div className="flex flex-col gap-6 mt-8">
        <h1 className="text-2xl font-bold">Order Management</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or Customer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === "ALL" ? "default" : "outline"}
              onClick={() => setStatusFilter("ALL")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              onClick={() => setStatusFilter("PENDING")}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === "PROCESSING" ? "default" : "outline"}
              onClick={() => setStatusFilter("PROCESSING")}
            >
              Processing
            </Button>
            <Button 
              variant={statusFilter === "COMPLETED" ? "default" : "outline"}
              onClick={() => setStatusFilter("COMPLETED")}
            >
              Completed
            </Button>
            <Button 
              variant={statusFilter === "CANCELLED" ? "default" : "outline"}
              onClick={() => setStatusFilter("CANCELLED")}
            >
              Cancelled
            </Button>
          </div>

          {(searchQuery || statusFilter !== "ALL") && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              Clear Filters
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredOrders?.length > 0 ? filteredOrders.map((order) => (
          <Card key={order.orderId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order.orderId}</CardTitle>
                  <CardDescription className="mt-2">{order.orderBy}</CardDescription>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {order.products.map((product) => (
                      <div key={product.cartId} className="flex justify-between text-sm">
                        <span>{product.productName}</span>
                        <span>x{product.quantity}</span>
                      </div>
                    ))}
                    {order.products.length === 0 && (
                      <p className="text-sm text-muted-foreground">No products in this order</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${calculateTotal(order.products).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {order.products[0]?.dateAdded ? 
                  format(new Date(order.products[0].dateAdded), "MMM d, yyyy HH:mm") :
                  "No date available"
                }
              </div>
              <Select
                value={order.orderStatus}
                onValueChange={(value) => handleStatusChange(order.orderId, value, order.orderBy)}
                disabled={updatingOrderId === order.orderId}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue>
                    {updatingOrderId === order.orderId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      order.orderStatus
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        )) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-6">
              {orders.length === 0 ? "No orders found" : "No orders match your search criteria"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
