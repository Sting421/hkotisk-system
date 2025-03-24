import { Card, CardContent } from "@/components/ui/card"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Order, OrderResponse } from "@/types/order"
import axios from "axios"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Navbar } from "@/components/Navbar"

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

const baseUrl = import.meta.env.VITE_BASE_URL;

const wsURL = import.meta.env.VITE_WS_URL;

export default function OrderManagement() {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [messages, setMessages] = useState<string>("");
  const [newOrder, setNewOrder] = useState(false);
  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get<OrderResponse>(`${baseUrl}/staff/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newOrderData = response.data.orderlist;
      console.log("Fetching orders......");
      console.log(newOrderData);
      setOrderData(newOrderData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token]);

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle order updates via WebSocket
  useEffect(() => {
    const socket = new WebSocket(`ws://${wsURL}/ws/orders`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Message received: ', event.data);
      setMessages(event.data);
      // Fetch updated orders when we receive a message
      fetchOrders();
      setNewOrder(true);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, status: string) => {
    setNewOrder(false);
    try {
      await axios.patch(`${baseUrl}/staff/orders/${orderId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Status will be updated in next fetch
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 mt-8">Order Management</h1>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData?.length > 0 ? orderData.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">
                    #{order.orderId}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.products[0]?.dateAdded || new Date()), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>${calculateTotal(order.products).toFixed(2)}</TableCell>
                  <TableCell>{order.products.length} items</TableCell>
                  <TableCell>
                    <StatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.orderStatus}
                      onValueChange={(value) => 
                        handleStatusChange(
                          order.orderId, 
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
