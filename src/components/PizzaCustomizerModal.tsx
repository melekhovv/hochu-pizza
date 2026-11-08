import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check } from 'lucide-react'
import { AVAILABLE_TOPPINGS } from '../data/menu'
import type { MenuItem, Topping, PizzaSize, CrustType } from '../types/pizza'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { formatPrice } from '../lib/utils'

interface PizzaCustomizerModalProps {
  isOpen: boolean
  onClose: () => void
  initialItem?: MenuItem | null
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  isOpen,
  onClose,
  initialItem,
}) => {
  const { addToCart } = useCart()

  const defaultBaseItem: MenuItem = initialItem || {
    id: 'custom-artisan-pizza',
    name: 'Авторская крафтовая пицца',
    italianName: 'Pizza su Misura',
    description: 'Собранная вами пицца на живой 36-часовой закваске с выбранными сырами и деликатесами.',
    category: 'neapolitan',
    basePrice: 550,
    priceLarge: 750,
    weightGrams: 390,
    weightLargeGrams: 530,
    calories: 680,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
    ingredients: ['Основа на закваске', 'Моцарелла Fior di Latte', 'Оливковое масло'],
  }

  const [size, setSize] = useState<PizzaSize>(28)
  const [crust, setCrust] = useState<CrustType>('traditional')
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Calculations
  const isBaseCustom = !initialItem
  const basePrice = (size === 33 && defaultBaseItem.priceLarge)
    ? defaultBaseItem.priceLarge
    : defaultBaseItem.basePrice

  const crustSurcharge = crust === 'cheese_crust' ? 160 : 0
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0)
  const calculatedTotal = basePrice + crustSurcharge + toppingsTotal

  const baseWeight = (size === 33 && defaultBaseItem.weightLargeGrams)
    ? defaultBaseItem.weightLargeGrams
    : defaultBaseItem.weightGrams
  const calculatedWeight = baseWeight + (crust === 'cheese_crust' ? 80 : 0) + selectedToppings.reduce((sum, t) => sum + t.weightGrams, 0)

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id)
      if (exists) {
        return prev.filter(t => t.id !== topping.id)
      } else {
        return [...prev, topping]
      }
    })
  }

  const handleAddToCart = () => {
    addToCart(defaultBaseItem, size, crust, selectedToppings, notes)
    // reset for next time
    setSize(28)
    setCrust('traditional')
    setSelectedToppings([])
    setNotes('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with spring/fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Panel with elastic spring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 12,
              transition: { duration: 0.18, ease: 'easeIn' },
            }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 28,
              mass: 0.85,
            }}
            className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between bg-muted/40">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {isBaseCustom ? 'Конструктор пиццы' : 'Настройка ингредиентов'}
            </span>
            <h2 className="text-2xl font-bold font-serif text-foreground mt-0.5">
              {defaultBaseItem.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Выберите основу, размер и любимые сыры, мясные деликатесы или зелень
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Step 1: Size */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span>1. Диаметр пиццы</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => setSize(28)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  size === 28
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">28 см (Классика)</span>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {formatPrice(defaultBaseItem.basePrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  1–2 человека • ~{defaultBaseItem.weightGrams} г
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSize(33)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  size === 33
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">33 см (Большая)</span>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {formatPrice(defaultBaseItem.priceLarge || defaultBaseItem.basePrice + 200)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  2–3 человека • ~{defaultBaseItem.weightLargeGrams || defaultBaseItem.weightGrams + 140} г
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Crust & Dough Type */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              2. Бортик и тип теста
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => setCrust('traditional')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  crust === 'traditional'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground text-sm">
                    Неаполитанский бортик
                  </span>
                  <span className="text-xs text-muted-foreground">Бесплатно</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Воздушный, с характерным леопардовым припёком
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCrust('cheese_crust')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  crust === 'cheese_crust'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground text-sm">
                    Сырный бортик моцарелла
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary">+160 ₽</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Тянущийся сыр Fior di Latte запекается внутри бортика
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Add extra toppings */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                3. Дополнительные топпинги
              </h3>
              <span className="text-xs text-muted-foreground">
                Выбрано: {selectedToppings.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {AVAILABLE_TOPPINGS.map((topping) => {
                const isSelected = selectedToppings.some(t => t.id === topping.id)
                return (
                  <button
                    key={topping.id}
                    type="button"
                    onClick={() => toggleTopping(topping)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-muted/40 text-foreground/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border bg-background'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-sm truncate">{topping.name}</span>
                    </div>

                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground shrink-0 ml-2">
                      +{topping.price} ₽
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Special notes */}
          <div>
            <label className="text-sm font-semibold text-foreground uppercase tracking-wider block mb-2">
              4. Пожелания шефу (опционально)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Например: разрезать на 6 частей, соус отдельно, без чеснока"
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Modal Footer with Live Summary & Add Button */}
        <div className="p-6 border-t border-border bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-start">
            <span className="text-xs text-muted-foreground">
              Итоговый вес: ~{calculatedWeight} г
            </span>
            <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {formatPrice(calculatedTotal)}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Отмена
            </Button>
            <Button
              variant="default"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial font-semibold px-6 shadow-md"
            >
              Добавить в корзину
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  )
}
