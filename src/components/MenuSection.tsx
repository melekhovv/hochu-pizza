import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Sliders, Flame } from 'lucide-react'
import { MENU_ITEMS } from '../data/menu'
import type { MenuItem, PizzaSize } from '../types/pizza'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Card, CardContent } from './ui/Card'
import { formatPrice } from '../lib/utils'
import { JellyRadio } from './ui/JellyRadio'
import { FuseButton } from './ui/FuseButton'

interface MenuSectionProps {
  onCustomizeItem: (item: MenuItem) => void
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onCustomizeItem }) => {
  const { addToCart, removeMenuItem } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'spicy' | 'hits'>('all')
  
  // Track selected size for each item (default 28)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PizzaSize>>({})

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'Все позиции', count: MENU_ITEMS.length },
    { id: 'neapolitan', label: 'Неаполитанская', count: MENU_ITEMS.filter(i => i.category === 'neapolitan').length },
    { id: 'roman', label: 'Римская Scrocchiarella', count: MENU_ITEMS.filter(i => i.category === 'roman').length },
    { id: 'chef', label: 'Спешлы шефа', count: MENU_ITEMS.filter(i => i.category === 'chef').length },
    { id: 'starters', label: 'Закуски', count: MENU_ITEMS.filter(i => i.category === 'starters').length },
    { id: 'desserts', label: 'Десерты', count: MENU_ITEMS.filter(i => i.category === 'desserts').length },
    { id: 'drinks', label: 'Напитки', count: MENU_ITEMS.filter(i => i.category === 'drinks').length },
  ]

  const filteredItems = MENU_ITEMS.filter((item) => {
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false
    }
    // Tag filter
    if (activeFilter === 'veg' && !item.isVegetarian) return false
    if (activeFilter === 'spicy' && !item.isSpicy) return false
    if (activeFilter === 'hits' && !item.isHit) return false
    return true
  })

  const setSizeForItem = (itemId: string, size: PizzaSize) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }))
  }

  const handleAdd = (item: MenuItem) => {
    const size = selectedSizes[item.id] || 28
    addToCart(item, size)
  }

  const handleRemove = (item: MenuItem) => {
    const size = selectedSizes[item.id] || 28
    removeMenuItem(item.id, size)
  }

  return (
    <section id="menu" className="py-16 sm:py-24 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with spring reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border"
        >
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground text-balance">
              Меню пиццерии
            </h2>
            <p className="mt-3 text-muted-foreground text-base max-w-xl">
              Каждую пиццу раскатываем вручную и выпекаем в помпейской дровяной печи. Только свежие итальянские ингредиенты.
            </p>
          </div>

          {/* Quick Dietary Filters with JellyRadio (Mobile scroll safe) */}
          <div className="flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline shrink-0">
              Фильтр:
            </span>
            <div className="shrink-0">
              <JellyRadio
                items={[
                  { value: 'all', label: 'Все' },
                  { value: 'hits', label: 'Хиты гостей' },
                  { value: 'veg', label: 'Вегетарианские' },
                  { value: 'spicy', label: 'Острые' },
                ]}
                value={activeFilter}
                onChange={(val) => setActiveFilter(val as 'all' | 'veg' | 'spicy' | 'hits')}
                chipColor="#251e1b"
                activeColor="#f5f5f5"
                textColor="#b3aaa4"
                activeTextColor="#171311"
                size="sm"
                gap={6}
                radius={10}
                swell={0.14}
                barge={4}
                shrink={0.03}
                jelly={1}
                bounce={0.25}
                ariaLabel="Диетические фильтры"
              />
            </div>
          </div>
        </motion.div>

        {/* Category Horizontal Scrolling Tabs with JellyRadio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.1 }}
          className="py-2 overflow-x-auto no-scrollbar flex items-center border-b border-border/60"
        >
          <JellyRadio
            items={categories.map((cat) => ({
              value: cat.id,
              label: (
                <span className="flex items-center gap-2">
                  <span>{cat.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md font-mono tabular-nums transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-white/20 text-white font-semibold'
                        : 'bg-background/80 text-muted-foreground'
                    }`}
                  >
                    {cat.count}
                  </span>
                </span>
              ),
            }))}
            value={activeCategory}
            onChange={(val) => setActiveCategory(val)}
            chipColor="#251e1b"
            activeColor="#d13518"
            textColor="#d5cec8"
            activeTextColor="#ffffff"
            size="md"
            gap={8}
            radius={14}
            swell={0.16}
            barge={5}
            shrink={0.04}
            jelly={1}
            bounce={0.25}
            stiffness={580}
            ariaLabel="Категории меню"
          />
        </motion.div>

        {/* Items Grid with Spring Layout Animation */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isPizza = item.category === 'neapolitan' || item.category === 'roman' || item.category === 'chef'
              const currentSize = selectedSizes[item.id] || 28
              const currentPrice = (isPizza && currentSize === 33 && item.priceLarge)
                ? item.priceLarge
                : item.basePrice
              const currentWeight = (isPizza && currentSize === 33 && item.weightLargeGrams)
                ? item.weightLargeGrams
                : item.weightGrams

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.94,
                    y: -10,
                    transition: { duration: 0.16, ease: 'easeIn' },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 440,
                    damping: 28,
                    mass: 0.8,
                    delay: Math.min(index * 0.025, 0.15),
                  }}
                  className="flex flex-col h-full"
                >
                  <Card
                    className="h-full overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-primary/40 transition-all duration-300 group"
                  >
                {/* Image & Tags Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Semantic Badges (Top Left) */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isHit && (
                      <Badge variant="default" className="bg-primary text-white font-medium text-[11px] shadow-sm">
                        Хит
                      </Badge>
                    )}
                    {item.isChefSpecial && (
                      <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-xs text-[11px]">
                        Спешл
                      </Badge>
                    )}
                    {item.isVegetarian && (
                      <Badge variant="outline" className="bg-emerald-950/80 text-emerald-200 border-emerald-600/40 text-[11px]">
                        Вегетарианская
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge
                        variant="destructive"
                        className="bg-red-600 text-white font-semibold text-[11px] shadow-sm border border-red-500/50 flex items-center gap-1"
                      >
                        <Flame className="w-3 h-3 text-amber-200 fill-amber-300/80 shrink-0" />
                        Острая
                      </Badge>
                    )}
                  </div>

                  {/* Weight & Calorie Indicator (Top Right) */}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-xs text-foreground px-2 py-1 rounded-md text-[11px] font-mono tabular-nums border border-border/50">
                    {currentWeight} г • {item.calories} ккал
                  </div>
                </div>

                {/* Content & Details */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {item.italianName && (
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block">
                        {item.italianName}
                      </span>
                    )}
                    <h3 className="text-xl font-bold font-serif text-foreground mt-0.5 tracking-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Ingredients tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 4).map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Size Switch & Actions (Bottom) */}
                  <div className="mt-6 pt-4 border-t border-border">
                    {/* Size Selector for Pizzas */}
                    {isPizza && item.priceLarge && (
                      <div className="mb-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Диаметр:</span>
                        <div className="flex items-center gap-1 bg-muted/80 p-0.5 rounded-lg border border-border/60">
                          <button
                            type="button"
                            onClick={() => setSizeForItem(item.id, 28)}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                              currentSize === 28
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            28 см (1-2 чел)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSizeForItem(item.id, 33)}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                              currentSize === 33
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            33 см (2-3 чел)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Price & Action Buttons */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground block">Стоимость</span>
                        <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                          {formatPrice(currentPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPizza && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onCustomizeItem(item)}
                            title="Изменить ингредиенты или добавить бортик"
                            aria-label={`Настроить ${item.name}`}
                          >
                            <Sliders className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        )}

                        <FuseButton
                          label="В корзину"
                          undoLabel="Убрать"
                          doneLabel="В корзине"
                          icon={<Plus className="w-3.5 h-3.5" />}
                          color="#ffffff"
                          background="#d13518"
                          fuseColor="#f5a524"
                          size="sm"
                          radius={14}
                          undoWindow={4500}
                          fuse="outline"
                          fuseThickness={1.5}
                          commitOn="press"
                          pauseOnHover
                          settle="reset"
                          onCommit={() => handleAdd(item)}
                          onUndo={() => handleRemove(item)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>

        {/* Empty state if filter yields zero */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              В выбранной категории нет позиций по данному фильтру.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setActiveCategory('all')
                setActiveFilter('all')
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
