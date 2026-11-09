import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react'
import { REVIEWS } from '../data/menu'
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack'

export const ReviewsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const categoryButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

  const reviewCategories = [
    { label: 'Гастрокритик', tag: '01' },
    { label: 'Доставка 28 мин', tag: '02' },
    { label: 'Шеф-повар', tag: '03' },
    { label: 'Сырный бортик', tag: '04' },
    { label: 'Шеф-сомелье', tag: '05' },
  ]

  const handlePrev = () => {
    setSwipeDirection('right')
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setSwipeDirection('left')
    setActiveIndex((prev) => Math.min(REVIEWS.length - 1, prev + 1))
  }

  const handleCategoryClick = (idx: number) => {
    setSwipeDirection(idx > activeIndex ? 'left' : 'right')
    setActiveIndex(idx)
  }

  // Smoothly scroll active category chip into view on mobile
  useEffect(() => {
    const btn = categoryButtonsRef.current[activeIndex]
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeIndex])

  // Touch swipe detection for mobile review cards
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return
    const diffX = touchStartX - e.changedTouches[0].clientX
    const diffY = touchStartY - e.changedTouches[0].clientY

    // Ensure swipe was primarily horizontal and exceeded threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> next
        handleNext()
      } else {
        // Swiped right -> prev
        handlePrev()
      }
    }
    setTouchStartX(null)
    setTouchStartY(null)
  }

  const currentReview = REVIEWS[activeIndex]

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with spring entrance */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Впечатления гостей
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance">
              Что говорят о нашей пицце
            </h2>
            <p className="mt-2 text-muted-foreground text-base max-w-xl">
              Честные отзывы от фуд-критиков, шеф-поваров и постоянных гостей. Листайте карточки свайпом, стрелками или переключайте темы выше.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 420, damping: 26, delay: 0.1 }}
            className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shrink-0 shadow-sm"
          >
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1.5 justify-center sm:justify-end">
                <span className="font-mono text-3xl font-bold text-foreground tabular-nums">4.9</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Более 2 400 оценок в сервисах
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Topic Chips & Navigation Controller */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 420, damping: 28, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {reviewCategories.map((cat, idx) => {
              const isSelected = activeIndex === idx
              return (
                <button
                  key={cat.tag}
                  ref={(el) => {
                    categoryButtonsRef.current[idx] = el
                  }}
                  type="button"
                  onClick={() => handleCategoryClick(idx)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/40'
                      : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-primary' : 'text-muted-foreground/60'}`}>
                    {cat.tag}
                  </span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Stepper & Prev/Next Arrows (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-3 self-end sm:self-auto shrink-0">
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              0{activeIndex + 1} <span className="text-border">/</span> 0{REVIEWS.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Предыдущий отзыв"
                className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex === REVIEWS.length - 1}
                aria-label="Следующий отзыв"
                className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 1. Mobile Optimized View: Gesture Swipeable Card + Accessible Tap Targets */}
        <div className="sm:hidden mt-6">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="touch-pan-y"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentReview.id}
                initial={{ opacity: 0, x: swipeDirection === 'left' ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: swipeDirection === 'left' ? -30 : 30 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="scroll-stack-card flex flex-col justify-between p-6 relative overflow-hidden min-h-[380px]"
              >
                {/* Background Watermark Quote */}
                <div className="absolute -bottom-6 -right-6 pointer-events-none text-muted-foreground/5 select-none" aria-hidden="true">
                  <Quote className="w-40 h-40 rotate-12" />
                </div>

                <div className="relative z-10">
                  {/* Top Bar of Card (Zero numeric rating digits and zero relative dates) */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(currentReview.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Проверен
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground/70 border border-border/60 px-2 py-0.5 rounded bg-background/50">
                      0{activeIndex + 1} / 0{REVIEWS.length}
                    </span>
                  </div>

                  {/* Review Quote */}
                  <div className="relative my-3">
                    <p className="text-base font-serif italic text-foreground/95 leading-relaxed">
                      «{currentReview.text}»
                    </p>
                  </div>
                </div>

                {/* Author Info & Favorite Dish */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentReview.avatar}
                      alt={currentReview.author}
                      className="w-11 h-11 rounded-full object-cover border border-primary/30 ring-2 ring-primary/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-foreground font-serif leading-tight">
                        {currentReview.author}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {currentReview.role}
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary/40 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-primary font-medium block">
                      Любимое блюдо:
                    </span>
                    <span className="text-xs font-semibold text-foreground font-sans">
                      {currentReview.dish}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Navigation Controls: Accessible Large Targets (>= 44px) & Dot Indicators */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Предыдущий отзыв"
              className="h-11 px-4 rounded-xl border border-border bg-card flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs active:scale-95 min-w-[88px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSwipeDirection(i > activeIndex ? 'left' : 'right')
                    setActiveIndex(i)
                  }}
                  aria-label={`Перейти к отзыву ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                    activeIndex === i
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === REVIEWS.length - 1}
              aria-label="Следующий отзыв"
              className="h-11 px-4 rounded-xl border border-border bg-card flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs active:scale-95 min-w-[88px]"
            >
              <span>Вперед</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Desktop Stacked Scroll Container (3D perspective stack with smooth glide) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.2 }}
          className="hidden sm:block mt-6 h-[500px] sm:h-[540px] w-full max-w-3xl mx-auto relative"
        >
          <ScrollStack
            itemDistance={100}
            itemStackDistance={24}
            stackPosition="8%"
            itemScale={0.045}
            baseScale={0.88}
            dimAmount={0.2}
            tiltAmount={2.5}
            rotationAmount={1.6}
            holdDistance={140}
            smoothScroll={true}
            snap={true}
            activeIndex={activeIndex}
            onIndexChange={(idx) => setActiveIndex(idx)}
            className="h-full"
          >
            {REVIEWS.map((review, idx) => (
              <ScrollStackItem
                key={review.id}
                itemClassName="flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden"
              >
                {/* Background Watermark Quote */}
                <div className="absolute -bottom-6 -right-6 pointer-events-none text-muted-foreground/5 select-none" aria-hidden="true">
                  <Quote className="w-44 h-44 rotate-12" />
                </div>

                <div className="relative z-10">
                  {/* Top Bar of Card (Zero numeric rating digits and zero relative dates) */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Проверенный визит
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground/70 border border-border/60 px-2 py-0.5 rounded bg-background/50">
                      0{idx + 1} / 0{REVIEWS.length}
                    </span>
                  </div>

                  {/* Review Quote */}
                  <div className="relative my-3">
                    <p className="text-base sm:text-lg font-serif italic text-foreground/95 leading-relaxed">
                      «{review.text}»
                    </p>
                  </div>
                </div>

                {/* Author Info & Favorite Dish */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-11 h-11 rounded-full object-cover border border-primary/30 ring-2 ring-primary/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-foreground font-serif leading-tight">
                        {review.author}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-secondary/40 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg">
                    <span className="text-[11px] text-primary font-medium block">
                      Любимое блюдо:
                    </span>
                    <span className="text-xs font-semibold text-foreground font-sans">
                      {review.dish}
                    </span>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </motion.div>

        {/* Helpful Hint adapted specifically for mobile touch & desktop */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            <span className="sm:hidden">← Свайпайте карточки влево и вправо для переключения →</span>
            <span className="hidden sm:inline">Листайте отзывы стрелками или колесиком мыши</span>
          </p>
        </div>

      </div>
    </section>
  )
}
