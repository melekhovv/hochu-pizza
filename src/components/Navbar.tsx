import React, { useState, useEffect } from 'react'
import { Flame, ShoppingBag, Moon, Sun, Menu, X, Phone, Clock, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/Button'
import { formatPrice } from '../lib/utils'

interface NavbarProps {
  onOpenCustomizer: () => void
  onOpenReservation: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCustomizer, onOpenReservation }) => {
  const { totalCount, subtotal, openCart } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Меню', href: '#menu' },
    { label: 'О печи и тесте', href: '#craft' },
    { label: 'Конструктор', action: onOpenCustomizer },
    { label: 'Доставка', href: '#delivery' },
    { label: 'Бронь стола', action: onOpenReservation },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Контакты', href: '#contacts' },
  ]

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="hidden sm:inline">Дровяная печь разогрета до 450°C</span>
            <span className="sm:hidden">Печь 450°C</span>
            <span className="opacity-70">•</span>
            <span>Доставка горячей за 30–40 мин</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1 opacity-90">
              <Clock className="w-3.5 h-3.5" />
              <span>Ежедневно 11:00 — 23:00</span>
            </div>
            <a
              href="tel:+74959210088"
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg py-1"
          >
            <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
              <Flame className="w-6 h-6 fill-current text-accent" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif leading-none">
                ХОЧУ ПИЦЦЫ!
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">
                Pizzeria & Forno a Legna
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {link.href ? (
                  <a
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={link.action}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Переключить тему оформления"
              className="text-foreground/80 hover:text-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            {/* Quick Reservation Button (Desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenReservation}
              className="hidden md:inline-flex border-primary/30 text-primary hover:bg-primary/5 hover:border-primary"
            >
              Бронь стола
            </Button>

            {/* Cart Trigger Button */}
            <Button
              variant="default"
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-5 font-semibold"
              aria-label={`Корзина: ${totalCount} товаров на сумму ${formatPrice(subtotal)}`}
            >
              <ShoppingBag className="w-5 h-5" />
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

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-background/95 backdrop-blur-md pt-28 px-6 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {link.href ? (
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      link.action?.()
                    }}
                    className="text-xl font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>

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
              className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-medium text-base"
            >
              <Phone className="w-4 h-4" />
              <span>+7 (495) 921-00-88</span>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
