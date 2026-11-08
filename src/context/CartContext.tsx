import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, MenuItem, PizzaSize, CrustType, Topping } from '../types/pizza'

interface CartContextType {
  items: CartItem[]
  addToCart: (
    item: MenuItem,
    size?: PizzaSize,
    crust?: CrustType,
    selectedToppings?: Topping[],
    specialInstructions?: string
  ) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, delta: number) => void
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  promoCode: string
  discountPercent: number
  applyPromo: (code: string) => { success: boolean; message: string }
  totalCount: number
  subtotal: number
  discountAmount: number
  deliveryFee: number
  totalAmount: number
  freeDeliveryThreshold: number
  freeDeliveryRemaining: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'hochu_pizza_cart_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable
    }
  }, [items])

  const addToCart = (
    item: MenuItem,
    size: PizzaSize = 28,
    crust: CrustType = 'traditional',
    selectedToppings: Topping[] = [],
    specialInstructions = ''
  ) => {
    const isPizza = item.category === 'neapolitan' || item.category === 'roman' || item.category === 'chef'
    
    // Calculate final base price depending on size
    let unitPrice = item.basePrice
    if (isPizza && size === 33 && item.priceLarge) {
      unitPrice = item.priceLarge
    }
    
    // Add cheese crust surcharge if selected
    if (crust === 'cheese_crust') {
      unitPrice += 160
    }

    // Add extra toppings cost
    const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0)
    unitPrice += toppingsTotal

    // Generate unique composite key
    const toppingsKey = selectedToppings.map(t => t.id).sort().join('-')
    const cartItemId = `${item.id}-${size}-${crust}-${toppingsKey}`

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === cartItemId)
      if (existingIndex > -1) {
        const next = [...prevItems]
        next[existingIndex].quantity += 1
        return next
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItemId: item.id,
          name: item.name,
          size: isPizza ? size : undefined,
          crust: isPizza ? crust : undefined,
          price: unitPrice,
          quantity: 1,
          image: item.image,
          selectedToppings: selectedToppings.length > 0 ? selectedToppings : undefined,
          specialInstructions: specialInstructions || undefined,
        }
        return [...prevItems, newItem]
      }
    })

    setIsCartOpen(true)
  }

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => {
    setItems([])
    setPromoCode('')
    setDiscountPercent(0)
  }

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean === 'ХОЧУ15' || clean === 'PIZZA15' || clean === 'ДРОВА') {
      setPromoCode(clean)
      setDiscountPercent(15)
      return { success: true, message: 'Промокод применён! Скидка 15% на всё меню' }
    }
    if (clean === 'ХОЧУ20' || clean === 'FIRST') {
      setPromoCode(clean)
      setDiscountPercent(20)
      return { success: true, message: 'Промокод применён! Скидка 20% на первый заказ' }
    }
    return { success: false, message: 'Неверный или устаревший промокод. Попробуйте ХОЧУ15' }
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const afterDiscount = subtotal - discountAmount
  
  const freeDeliveryThreshold = 1200
  const deliveryFee = subtotal === 0 ? 0 : afterDiscount >= freeDeliveryThreshold ? 0 : 190
  const totalAmount = afterDiscount + deliveryFee
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - afterDiscount)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        promoCode,
        discountPercent,
        applyPromo,
        totalCount,
        subtotal,
        discountAmount,
        deliveryFee,
        totalAmount,
        freeDeliveryThreshold,
        freeDeliveryRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
