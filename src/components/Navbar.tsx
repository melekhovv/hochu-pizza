import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Flame, ShoppingBag, Phone, Clock, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { formatPrice } from '../lib/utils'
import { JellyRadio } from './ui/JellyRadio'

interface NavbarProps {
  onOpenCustomizer: () => void
  onOpenReservation: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCustomizer, onOpenReservation }) => {
  const { totalCount, subtotal, openCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('menu')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { value: 'menu', label: 'Меню', href: '#menu' },
    { value: 'craft', label: 'О печи и тесте', href: '#craft' },
    { value: 'customizer', label: 'Конструктор', action: onOpenCustomizer },
    { value: 'delivery', label: 'Доставка', href: '#delivery' },
    { value: 'reservation', label: 'Бронь стола', action: onOpenReservation },
    { value: 'reviews', label: 'Отзывы', href: '#reviews' },
    { value: 'contacts', label: 'Контакты', href: '#contacts' },
  ]

  // Sync active nav item with scroll position
  useEffect(() => {
    const sectionIds = ['contacts', 'reviews', 'reservation', 'delivery', 'craft', 'menu']
    const handleScrollNav = () => {
      const scrollPos = window.scrollY + 200
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(id)
          return
        }
      }
    }
    window.addEventListener('scroll', handleScrollNav, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollNav)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const handleNavChange = (val: string) => {
    setActiveNav(val)
    const target = navLinks.find((l) => l.value === val)
    if (!target) return
    if (target.href) {
      const el = document.querySelector(target.href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.hash = target.href
      }
    } else if (target.action) {
      target.action()
    }
  }

  return (
    <>
      {/* Top Subtle Info Bar */}
      <div className="bg-card/50 border-b border-border/40 text-muted-foreground text-xs py-1.5 px-3 sm:px-4 select-none backdrop-blur-xs overflow-hidden w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
            <span className="hidden sm:inline">Дровяная печь разогрета до 450°C • Доставка горячей за 30–40 мин</span>
            <span className="sm:hidden truncate">Печь 450°C • 30–40 мин</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-muted-foreground/80">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              <span>Ежедневно 11:00 — 23:00</span>
            </div>
            <a
              href="tel:+74959210088"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium whitespace-nowrap text-[11px] sm:text-xs"
            >
              <Phone className="w-3 h-3 opacity-70 shrink-0" />
              <span>+7 (495) 921-00-88</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-xs border-border'
            : 'bg-background/80 backdrop-blur-sm border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg py-1 select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 text-primary flex items-center justify-center transition-colors group-hover:bg-primary/25 group-hover:border-primary/40 shrink-0">
              <Flame className="w-4 h-4 fill-primary/30" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-serif group-hover:text-primary transition-colors leading-none">
                Хочу Пиццы!
              </span>
              <span className="hidden xl:inline-block text-[11px] font-sans font-medium text-muted-foreground/80 tracking-wider uppercase">
                · forno a legna
              </span>
            </div>
          </a>

          {/* Desktop Navigation with JellyRadio */}
          <div className="hidden lg:flex items-center shrink-0">
            <JellyRadio
              items={navLinks.map((link) => ({
                value: link.value,
                label: link.label,
              }))}
              value={activeNav}
              onChange={handleNavChange}
              chipColor="transparent"
              activeColor="#251e1b"
              textColor="#b5ada7"
              activeTextColor="#ffffff"
              size="sm"
              gap={4}
              radius={10}
              swell={0.12}
              barge={4}
              shrink={0.03}
              jelly={0.8}
              bounce={0.25}
              stiffness={600}
              ariaLabel="Основная навигация"
            />
          </div>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Trigger Button */}
            <Button
              variant="default"
              onClick={openCart}
              className="relative flex items-center gap-2 px-3.5 sm:px-4.5 font-semibold whitespace-nowrap cursor-pointer"
              aria-label={`Корзина: ${totalCount} товаров на сумму ${formatPrice(subtotal)}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Корзина</span>
              {totalCount > 0 && (
                <span className="font-mono text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold ml-0.5">
                  {totalCount}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden md:inline font-mono tabular-nums text-xs opacity-90 border-l border-primary-foreground/30 pl-2">
                  {formatPrice(subtotal)}
                </span>
              )}
            </Button>

            {/* Animated Uiverse Burger Trigger */}
            <div className="lg:hidden flex items-center justify-center w-10 h-10 shrink-0">
              <label
                className="burger scale-[0.68] origin-center cursor-pointer select-none text-foreground"
                aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                <input
                  type="checkbox"
                  checked={mobileMenuOpen}
                  onChange={(e) => setMobileMenuOpen(e.target.checked)}
                />
                <span />
                <span />
                <span />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with Spring Animation & Generous Spacing */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed inset-0 z-30 lg:hidden bg-background/98 backdrop-blur-xl pt-32 sm:pt-36 px-6 pb-8 flex flex-col justify-between overflow-y-auto"
          >
            <div className="pt-4">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <React.Fragment key={link.value}>
                    {link.href ? (
                      <a
                        href={link.href}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setActiveNav(link.value)
                        }}
                        className="text-lg font-medium text-foreground py-2.5 border-b border-border/40 hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setActiveNav(link.value)
                          link.action?.()
                        }}
                        className="text-lg font-medium text-foreground py-2.5 border-b border-border/40 hover:text-primary transition-colors text-left cursor-pointer flex items-center justify-between"
                      >
                        <span>{link.label}</span>
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>ул. Большая Никитская, 14 (м. Арбатская)</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Ежедневно с 11:00 до 23:00</span>
              </div>
              <a
                href="tel:+74959210088"
                className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-medium text-base hover:bg-secondary/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+7 (495) 921-00-88</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
