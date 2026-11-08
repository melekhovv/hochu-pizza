export type PizzaCategory = 'neapolitan' | 'roman' | 'chef' | 'starters' | 'desserts' | 'drinks'

export type PizzaSize = 28 | 33

export type CrustType = 'traditional' | 'cheese_crust' | 'roman_crisp'

export interface Topping {
  id: string
  name: string
  price: number
  category: 'sauce' | 'cheese' | 'meat' | 'veg' | 'garnish'
  weightGrams: number
}

export interface MenuItem {
  id: string
  name: string
  italianName?: string
  description: string
  category: PizzaCategory
  basePrice: number
  priceLarge?: number // For 33cm if applicable
  weightGrams: number
  weightLargeGrams?: number
  calories: number
  image: string
  isSpicy?: boolean
  isVegetarian?: boolean
  isChefSpecial?: boolean
  isHit?: boolean
  ingredients: string[]
  allergens?: string[]
}

export interface CartItem {
  id: string // unique item cart id
  menuItemId: string
  name: string
  size?: PizzaSize
  crust?: CrustType
  price: number
  quantity: number
  image: string
  selectedToppings?: Topping[]
  specialInstructions?: string
}

export interface DeliveryZone {
  name: string
  minOrder: number
  deliveryTimeMin: number
  color: string
}
