import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Truck,
  Store,
  ChevronLeft,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { formatPrice } from '../lib/utils'

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountPercent,
    deliveryFee,
    totalAmount,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    applyPromo,
  } = useCart()

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [promoInput, setPromoInput] = useState('')
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null)

  // Checkout form fields
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [apt, setApt] = useState('')
  const [entrance, setEntrance] = useState('')
  const [floor, setFloor] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'cash'>('sbp')
  const [needCutlery, setNeedCutlery] = useState(true)
  const [comment, setComment] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [cartHoneypot, setCartHoneypot] = useState('')

  const resetAll = React.useCallback(() => {
    setCheckoutStep('cart')
    closeCart()
  }, [closeCart])

  useEffect(() => {
    if (!isCartOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetAll()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, resetAll])

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const res = applyPromo(promoInput)
    setPromoMsg({ text: res.message, success: res.success })
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (cartHoneypot.trim()) return
    const cleanName = name.replace(/<[^>]*>?/gm, '').trim()
    const cleanPhone = phone.replace(/<[^>]*>?/gm, '').trim()
    if (!cleanName || !cleanPhone) return
    if (orderType === 'delivery' && !street.trim()) return

    const randomId = `#HP-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(randomId)
    setCheckoutStep('success')
    clearCart()
  }

  // Progress percentage for free delivery
  const progressPercent = Math.min(
    100,
    Math.round(((subtotal - discountAmount) / freeDeliveryThreshold) * 100)
  )

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop with spring/fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
            onClick={resetAll}
          />

          {/* Drawer Panel with spring physics */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{
              x: '100%',
              transition: { type: 'spring', stiffness: 440, damping: 36 },
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 32,
              mass: 0.85,
            }}
            className="relative z-10 w-full max-w-lg bg-card h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-border cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Top Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3">
            {checkoutStep === 'checkout' && (
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Назад к списку"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-serif text-foreground">
              {checkoutStep === 'cart'
                ? 'Ваш заказ'
                : checkoutStep === 'checkout'
                ? 'Оформление доставки'
                : 'Заказ принят!'}
            </h2>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Закрыть корзину"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* STEP 1: CART LIST */}
          {checkoutStep === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-foreground">
                    В корзине пока пусто
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Выберите аппетитную пиццу из печи или соберите свой фирменный рецепт в конструкторе.
                  </p>
                  <Button
                    variant="default"
                    onClick={closeCart}
                    className="font-semibold"
                  >
                    Перейти к выбору пиццы
                  </Button>
                </div>
              ) : (
                <>
                  {/* Free Delivery Bar */}
                  <div className="p-3.5 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span>Бесплатная доставка от 1 200 ₽</span>
                      <span className="font-mono tabular-nums text-foreground">
                        {freeDeliveryRemaining > 0
                          ? `еще ${formatPrice(freeDeliveryRemaining)}`
                          : 'Доставка бесплатно!'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3.5 p-3.5 rounded-xl border border-border bg-background"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover shrink-0 border border-border/50"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-foreground truncate">
                                {item.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer"
                                aria-label="Удалить товар"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {item.size && <span>{item.size} см</span>}
                              {item.crust === 'cheese_crust' && (
                                <span className="text-primary font-medium">
                                  • Сырный бортик
                                </span>
                              )}
                            </div>

                            {/* Extra toppings list if present */}
                            {item.selectedToppings && item.selectedToppings.length > 0 && (
                              <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                                + {item.selectedToppings.map((t) => t.name).join(', ')}
                              </div>
                            )}

                            {item.specialInstructions && (
                              <div className="text-[11px] text-muted-foreground/80 italic mt-0.5 line-clamp-1">
                                «{item.specialInstructions}»
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                              {formatPrice(item.price * item.quantity)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-muted p-0.5 rounded-md border border-border/60">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Уменьшить количество"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold px-1.5 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Увеличить количество"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo code block */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <label htmlFor="cart-promocode-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Промокод на скидку
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="cart-promocode-input"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Введите ХОЧУ15"
                        className="text-xs uppercase"
                      />
                      <Button type="submit" variant="outline" size="sm" className="px-4">
                        Применить
                      </Button>
                    </div>
                    {promoMsg && (
                      <p
                        className={`text-xs mt-1.5 font-medium ${
                          promoMsg.success ? 'text-emerald-500' : 'text-destructive'
                        }`}
                      >
                        {promoMsg.text}
                      </p>
                    )}
                  </form>
                </>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-5">
              {/* Bot trap honeypot */}
              <input
                type="text"
                name="user_email_trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={cartHoneypot}
                onChange={(e) => setCartHoneypot(e.target.value)}
                className="hidden"
              />
              {/* Delivery or Pickup Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Доставка</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Самовывоз (-10%)</span>
                </button>
              </div>

              {/* Personal info */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="drawer-name-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Имя *
                  </label>
                  <Input
                    id="drawer-name-input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label htmlFor="drawer-phone-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Номер телефона *
                  </label>
                  <Input
                    id="drawer-phone-input"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
              </div>

              {/* Address details for delivery */}
              {orderType === 'delivery' ? (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <label htmlFor="drawer-street-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Улица и дом *
                    </label>
                    <Input
                      id="drawer-street-input"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="ул. Арбат, дом 10"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="drawer-apt-input" className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Кв / Офис
                      </label>
                      <Input
                        id="drawer-apt-input"
                        value={apt}
                        onChange={(e) => setApt(e.target.value)}
                        placeholder="42"
                      />
                    </div>
                    <div>
                      <label htmlFor="drawer-entrance-input" className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Подъезд
                      </label>
                      <Input
                        id="drawer-entrance-input"
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="drawer-floor-input" className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Этаж
                      </label>
                      <Input
                        id="drawer-floor-input"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder="4"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-border bg-muted/40 text-xs">
                  <span className="font-bold text-foreground block">
                    Адрес ресторана для самовывоза:
                  </span>
                  <span className="text-muted-foreground mt-0.5 block">
                    ул. Большая Никитская, 14 (м. Арбатская). Заказ будет готов через 20 минут.
                  </span>
                </div>
              )}

              {/* Payment Method */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Способ оплаты
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sbp')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      paymentMethod === 'sbp'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    СБП онлайн
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Картой курьеру
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Наличными
                  </button>
                </div>
              </div>

              {/* Cutlery toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-foreground font-medium">
                  Приборы и салфетки
                </span>
                <input
                  type="checkbox"
                  checked={needCutlery}
                  onChange={(e) => setNeedCutlery(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="drawer-comment-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Комментарий для курьера
                </label>
                <Input
                  id="drawer-comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Домофон не работает, позвонить за 5 минут..."
                />
              </div>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS */}
          {checkoutStep === 'success' && (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-serif text-foreground">
                Спасибо за заказ!
              </h3>

              <div className="p-4 rounded-xl border border-border bg-muted/40 max-w-xs mx-auto">
                <span className="text-xs text-muted-foreground block">
                  Номер вашего заказа:
                </span>
                <span className="font-mono text-xl font-bold text-foreground">
                  {orderNumber}
                </span>
              </div>

              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Пиццайоло уже раскатывает тесто! Пицца отправится в дровяную печь и прибудет по вашему адресу через 30–35 минут.
              </p>

              <div className="pt-4">
                <Button variant="default" onClick={resetAll} className="w-full">
                  Вернуться на главную
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Total & Next Action Bar */}
        {checkoutStep !== 'success' && items.length > 0 && (
          <div className="p-5 border-t border-border bg-muted/40 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Сумма заказа:</span>
                <span className="font-mono tabular-nums text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Скидка ({discountPercent}%):</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Доставка:</span>
                <span className="font-mono tabular-nums text-foreground">
                  {deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                <span>Итого к оплате:</span>
                <span className="font-mono tabular-nums text-primary text-xl">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <Button
                variant="default"
                size="lg"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full font-semibold text-base shadow-md flex items-center justify-center gap-2"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                form="checkout-form"
                variant="default"
                size="lg"
                className="w-full font-semibold text-base shadow-md"
              >
                Подтвердить заказ на {formatPrice(totalAmount)}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )}
</AnimatePresence>
  )
}
