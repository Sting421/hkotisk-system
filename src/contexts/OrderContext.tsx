import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import type { Order, OrderResponse } from "@/types/order"

const baseUrl = import.meta.env.VITE_BASE_URL
const wsURL = import.meta.env.VITE_WS_URL

interface OrderContextType {
  orders: Order[]
  isLoading: boolean
  error: string | null
  updateOrderStatus: (orderId: number, status: string, email: string) => Promise<void>
  fetchOrders: () => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem("token")

  const fetchOrders = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get<OrderResponse>(`${baseUrl}/staff/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders(response.data.orderlist)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch orders"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [token, toast])

  const updateOrderStatus = async (orderId: number, orderStatus: string, email: string) => {
    if (!token) return

    try {
      await axios.post(
        `${baseUrl}/staff/order`,
        { orderId, email, orderStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      toast({
        title: "Success",
        description: `Order #${orderId} status updated to ${orderStatus}`
      })
      
      await fetchOrders()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update order status"
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    if (!token) return

    fetchOrders()

    const socket = new WebSocket(`ws://${wsURL}/ws/orders`)
    
    socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    socket.onmessage = () => {
      fetchOrders()
    }

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error)
      toast({
        title: "Connection Error",
        description: "Real-time updates may be delayed",
        variant: "destructive"
      })
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [token, fetchOrders, toast])

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      error,
      updateOrderStatus,
      fetchOrders
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
