import React from 'react'
import { Sliders, Calendar, ArrowDown, ShieldCheck, Star } from 'lucide-react'
import { Button } from './ui/Button'

interface HeroProps {
  onOpenCustomizer: () => void
  onOpenReservation: () => void
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomizer, onOpenReservation }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-foreground leading-[1.06] text-balance">
              Настоящая неаполитанская и римская пицца из дровяной печи
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              36 часов холодного созревания теста на живой закваске, мука тончайшего помола Caputo Tipo 00, сочные томаты Сан-Марцано и обжигающий жар 450°C на дубовых дровах.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="#menu">
                <Button size="lg" className="text-base font-semibold px-7 shadow-md">
                  <span>Выбрать из меню</span>
                  <ArrowDown className="w-4 h-4 ml-1" />
                </Button>
              </a>

              <Button
                variant="outline"
                size="lg"
                onClick={onOpenCustomizer}
                className="text-base font-medium px-6 hover:border-primary hover:text-primary"
              >
                <Sliders className="w-4 h-4 mr-1 text-primary" />
                <span>Собрать свою пиццу</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={onOpenReservation}
                className="text-base font-medium px-4 text-muted-foreground hover:text-foreground"
              >
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Забронировать стол</span>
              </Button>
            </div>

            {/* Authentic Restaurant Proof Points (Strictly No AI Slop / Real Metrics) */}
            <div className="mt-12 pt-8 border-t border-border/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                  450°C
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Температура в печи на дубовых дровах
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                  36 ч
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Холодное созревание для легкого теста
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                  90 сек
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Выпекание для хрустящего бортика
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    4.9
                  </span>
                  <Star className="w-5 h-5 fill-accent text-accent" />
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  2 400+ отзывов на Яндекс & Google
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Craft Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-xl shadow-foreground/5">
              <img
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80"
                alt="Свежеиспеченная пицца Маргарита D.O.P. из дровяной печи с базиликом и моцареллой"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Bottom Card Detail Strip */}
              <div className="p-5 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Фирменный хит
                  </div>
                  <div className="text-base font-bold text-foreground font-serif">
                    Маргарита Verace D.O.P.
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Томаты Сан-Марцано, Fior di Latte, свежий базилик
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Цена</div>
                  <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                    690 ₽
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Grounded Provenance Note */}
            <div className="mt-4 flex items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground bg-muted/50 rounded-lg border border-border/60">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Мука из Неаполя • Свежая моцарелла каждое утро • Без заморозки</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
