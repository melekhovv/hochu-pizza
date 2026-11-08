import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, ShoppingBag, X, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/utils'

export const ToastNotification: React.FC = () => {
  const { toast, dismissToast, openCart } = useCart()

  const isAdd = toast?.actionType === 'add'

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.92,
            filter: 'blur(4px)',
            transition: { duration: 0.22, ease: 'easeIn' },
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 26,
            mass: 0.8,
          }}
          className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-6 z-50 max-w-sm w-auto sm:w-full mx-auto sm:mx-0 pointer-events-auto"
        >
          <div className="bg-card/95 border border-border/80 shadow-2xl backdrop-blur-md rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-3 text-foreground">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {toast.image ? (
                <img
                  src={toast.image}
                  alt=""
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-border/50 shrink-0"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isAdd ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isAdd ? <CheckCircle2 className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary block truncate">
                  {toast.title}
                </span>
                <p className="text-xs sm:text-sm font-medium text-foreground truncate mt-0.5">
                  {toast.subtitle}
                </p>
                {toast.price && (
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    {formatPrice(toast.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isAdd && (
                <button
                  type="button"
                  onClick={() => {
                    dismissToast()
                    openCart()
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Корзина</span>
                </button>
              )}

              <button
                type="button"
                onClick={dismissToast}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Закрыть уведомление"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
