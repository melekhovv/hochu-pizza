import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, MenuItem, PizzaSize, CrustType, Topping } from '../types/pizza'

export interface CartToast {
  id: string
  title: string
  subtitle?: string
  image?: string
  price?: number
  actionType: 'add' | 'remove'
}

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
  removeMenuItem: (menuItemId: string, size?: PizzaSize) => void
  updateQuantity: (cartItemId: string, delta: number) => void
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toast: CartToast | null
  dismissToast: () => void
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
  const [toast, setToast] = useState<CartToast | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable
    }
  }, [items])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const dismissToast = () => setToast(null)

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

    // Show toast notification instead of opening cart automatically
    setToast({
      id: Date.now().toString(),
      title: 'Добавлено в корзину',
      subtitle: `${item.name}${isPizza && size ? ` (${size} см)` : ''}`,
      image: item.image,
      price: unitPrice,
      actionType: 'add',
    })
  }

  const removeMenuItem = (menuItemId: string, size?: PizzaSize) => {
    let removedName = ''
    setItems((prevItems) => {
      const idx = prevItems.findLastIndex(
        (i) => i.menuItemId === menuItemId && (!size || i.size === size)
      )
      if (idx === -1) return prevItems
      const target = prevItems[idx]
      removedName = target.name
      if (target.quantity > 1) {
        const next = [...prevItems]
        next[idx] = { ...target, quantity: target.quantity - 1 }
        return next
      }
      return prevItems.filter((_, i) => i !== idx)
    })

    setToast({
      id: Date.now().toString(),
      title: 'Удалено из корзины',
      subtitle: removedName,
      actionType: 'remove',
    })
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
  }

  const applyPromo = (code: string) => {
    const cleaned = code.trim().toUpperCase()
    if (cleaned === 'ХОЧУ15' || cleaned === 'HOCHU15') {
      setPromoCode(cleaned)
      setDiscountPercent(15)
      return { success: true, message: 'Промокод активирован: скидка 15% на заказ!' }
    }
    if (cleaned === 'ХОЧУ20' || cleaned === 'HOCHU20') {
      setPromoCode(cleaned)
      setDiscountPercent(20)
      return { success: true, message: 'Секретный промокод шефа: скидка 20%!' }
    }
    return { success: false, message: 'Промокод не найден или срок действия истек' }
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const freeDeliveryThreshold = 1200
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - (subtotal - discountAmount))
  const deliveryFee = (subtotal - discountAmount) >= freeDeliveryThreshold || totalCount === 0 ? 0 : 190
  const totalAmount = Math.max(0, subtotal - discountAmount + (totalCount > 0 ? deliveryFee : 0))

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removeMenuItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toast,
        dismissToast,
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
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
