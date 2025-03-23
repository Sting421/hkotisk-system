import { createContext, useContext, ReactNode, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  createdAt: Date
}

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>
  getUserOrders: (userId: string) => Order[]
  getPendingOrders: () => Order[]
  getAllOrders: () => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = async (orderData: Omit<Order, "id" | "createdAt">) => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: crypto.randomUUID(),
        createdAt: new Date()
      }
      setOrders(prev => [...prev, newOrder])
      toast({
        title: "Order Created",
        description: `Order #${newOrder.id.slice(0, 8)} has been created successfully.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
      toast({
        title: "Order Updated",
        description: `Order #${orderId.slice(0, 8)} status changed to ${status}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      })
      throw error
    }
  }

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId)
  }

  const getPendingOrders = () => {
    return orders.filter(order => order.status === "pending")
  }

  const getAllOrders = () => {
    return orders
  }

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getUserOrders,
      getPendingOrders,
      getAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
