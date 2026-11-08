import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react'
import { REVIEWS } from '../data/menu'
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack'

export const ReviewsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const reviewCategories = [
    { label: 'Гастрокритик', tag: '01' },
    { label: 'Доставка 28 мин', tag: '02' },
    { label: 'Шеф-повар', tag: '03' },
    { label: 'Сырный бортик', tag: '04' },
    { label: 'Шеф-сомелье', tag: '05' },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(REVIEWS.length - 1, prev + 1))
  }

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
              Честные отзывы от фуд-критиков, шеф-поваров и постоянных гостей. Выбирайте карточки по темам или листайте стопку колесиком мыши.
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
                  type="button"
                  onClick={() => setActiveIndex(idx)}
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

          {/* Stepper & Prev/Next Arrows */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
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

        {/* Reviews Stacked Scroll Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.2 }}
          className="mt-6 h-[500px] sm:h-[540px] w-full max-w-3xl mx-auto relative"
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
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-accent font-mono">
                        5.0
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Проверенный визит
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {review.date}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground/60 border border-border/60 px-1.5 py-0.5 rounded bg-background/50">
                        0{idx + 1}/0{REVIEWS.length}
                      </span>
                    </div>
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

        {/* Helpful Hint below the stack */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            ↓ Прокручивайте колесиком мыши или выбирайте категории выше для навигации по отзывам
          </p>
        </div>

      </div>
    </section>
  )
}
