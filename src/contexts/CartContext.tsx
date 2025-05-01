import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

interface CartItem {
  cartId: number
  orderId: number
  email: string
  dateAdded: string
  quantity: number
  price: number
  productId: number
  productName: string
  productCategory: string
  productImage: string
  ordered: boolean
}

interface CartResponse {
  status: string
  message: string
  oblist: CartItem[]
  auth_TOKEN: string | null
}

const baseUrl = import.meta.env.VITE_BASE_URL
const wsURL = import.meta.env.VITE_WS_URL

interface CartContextType {
  cart: CartItem[]
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem("token")

  const fetchCart = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get<CartResponse>(`${baseUrl}/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCart(response.data.oblist)
      console.log(response.data.oblist)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch cart"
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

  useEffect(() => {
    if (!token) return
    
    // Initial fetch of cart
    fetchCart()

    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket(`ws://${wsURL}/ws/orders`)
    
    socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    socket.onmessage = () => {
      fetchCart() // Refresh cart on updates
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
  }, [token, fetchCart, toast])

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      error,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
