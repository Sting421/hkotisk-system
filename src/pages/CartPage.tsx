import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useProducts } from "@/contexts/ProductContext"
import { useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { products } = useProducts()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart."
    })
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout.",
        variant: "destructive"
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement checkout logic
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully."
      })
      setCartItems([])
      navigate("/orders")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/browse")}
                    className="mt-2"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center py-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-2"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                disabled={isSubmitting || cartItems.length === 0}
                onClick={handleCheckout}
              >
                {isSubmitting ? "Processing..." : "Checkout"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
