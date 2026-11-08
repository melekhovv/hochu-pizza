import React from 'react'
import { Star } from 'lucide-react'
import { REVIEWS } from '../data/menu'
import { Card } from './ui/Card'

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Впечатления гостей
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance">
              Что говорят о нашей пицце
            </h2>
            <p className="mt-2 text-muted-foreground text-base max-w-xl">
              Честные отзывы от фуд-критиков, шеф-поваров и постоянных гостей, которые приходят к нам каждые выходные.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border">
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-center sm:justify-end">
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
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <Card
              key={review.id}
              className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors bg-card shadow-xs"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {review.date}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  «{review.text}»
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {review.author}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-primary font-medium block">
                    Любимое блюдо:
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {review.dish}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
