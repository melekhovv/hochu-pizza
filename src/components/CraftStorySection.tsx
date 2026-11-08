import React, { useState } from 'react'
import { Sparkles, ArrowRight, ChefHat } from 'lucide-react'

export const CraftStorySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      id: 'fermentation',
      stepNum: '01',
      title: '36 часов созревания на закваске Lievito Madre',
      tagline: 'Легкость и никакой тяжести в желудке',
      description:
        'Мы не используем быстрые промышленные дрожжи. Наше тесто созревает на живой закваске в холодильной камере при +4°C ровно полтора суток. За это время натуральные ферменты расщепляют сложные углеводы и клейковину. В результате пицца получается невесомой, а после еды остается чувство легкой энергии, а не сонливости.',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Холодный покой', value: '36 часов' },
        { label: 'Температура созревания', value: '+4°C' },
        { label: 'Промышленные дрожжи', value: '0%' },
        { label: 'Белок муки W300', value: '12.5%' },
      ],
      highlight: 'Воздушный бортик с легкой хрустящей сеточкой',
    },
    {
      id: 'oven',
      stepNum: '02',
      title: 'Помпейская дровяная печь Marana Forni на 450°C',
      tagline: '90 секунд в пламени сухого дуба',
      description:
        'Купол печи выложен вручную из вулканического туфа. Мы топим печь исключительно колотыми поленьями дуба и березы без химических розжигов. При температуре 450°C пицца выпекается ровно полторы минуты: жар мгновенно схватывает тесто снаружи, запечатывая сочность томатов и сливочность моцареллы внутри.',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Температура пода', value: '450°C' },
        { label: 'Время в печи', value: '90 сек' },
        { label: 'Топливо', value: 'Дуб & Береза' },
        { label: 'Припёк', value: 'Maculatura' },
      ],
      highlight: 'Леопардовые темные пузырьки — знак аутентичности Неаполя',
    },
    {
      id: 'ingredients',
      stepNum: '03',
      title: 'Мука Caputo 00 & Томаты San Marzano D.O.P.',
      tagline: 'Чистый вкус природы без сахара и усилителей',
      description:
        'Мука тончайшего помола Caputo Tipo 00 поставляется напрямую из Неаполя. Соус готовится из сладких мясистых томатов Сан-Марцано, созревших на вулканических почвах у подножия Везувия. А сливочную моцареллу Fior di Latte и страчателлу нам привозят каждое утро со свежей сыроварни.',
      image:
        'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Сертификат томатов', value: 'D.O.P. Италия' },
        { label: 'Свежесть сыра', value: 'Утренний удой' },
        { label: 'Сахар и консерванты', value: '0%' },
        { label: 'Масло', value: 'Extra Virgin' },
      ],
      highlight: 'Только 4 ингредиента в основе: мука, вода, закваска и морская соль',
    },
  ]

  const current = steps[activeStep]

  return (
    <section id="craft" className="py-20 sm:py-28 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Editorial Header */}
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Ремесленная школа Неаполя
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance leading-tight">
            Анатомия правильной пиццы: от закваски до дровяной печи
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Пока сетевой фастфуд ускоряет процесс химическими добавками и печет через 2 часа, мы вкладываем в каждую пиццу 36 часов созревания и ремесленный ручной труд.
          </p>
        </div>

        {/* Interactive Step Switcher Tabs */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border pb-6">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-background border border-primary/50 shadow-sm ring-1 ring-primary/20'
                    : 'bg-muted/30 border border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-sm font-bold ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {s.stepNum}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="mt-2">
                  <div className={`text-base font-bold font-serif ${isActive ? 'text-foreground' : ''}`}>
                    {idx === 0 ? 'Ферментация 36ч' : idx === 1 ? 'Жар печи 450°C' : 'Сырье D.O.P.'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {s.tagline}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Stage Showcase (Editorial Split Layout) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Photo with High Craft Details */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-background aspect-4/3">
              <img
                src={current.image}
                alt={current.title}
                key={current.image}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
              
              {/* Floating Bottom Stamp */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/90 backdrop-blur-md border border-border/60">
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Секрет мастерства</span>
                </div>
                <div className="text-xs text-foreground font-medium mt-1">
                  {current.highlight}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Technical Metrics */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                Этап {current.stepNum} • {current.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-foreground mt-1 leading-snug">
                {current.title}
              </h3>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Technical Specs Strip */}
            <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
              {current.specs.map((spec, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-foreground mt-0.5 tabular-nums">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer py-1"
              >
                <span>Следующий этап технологии</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Master Pizzaiolo Quote Strip */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl border border-border bg-background flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm sm:text-base italic text-foreground/90 font-serif leading-relaxed">
                «Пицца — это не фастфуд. Это живое тесто, которому дали отдохнуть полтора суток, и чистый огонь, запечатавший сок за 90 секунд.»
              </p>
              <div className="mt-1 text-xs text-muted-foreground">
                Марко Беллини • Бренд-шеф пиццайоло «Хочу Пиццы!»
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 text-xs font-mono text-muted-foreground border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <span className="block font-bold text-lg text-foreground tabular-nums">36ч</span>
              <span>Созревание</span>
            </div>
            <span className="text-border text-lg">•</span>
            <div className="text-center">
              <span className="block font-bold text-lg text-foreground tabular-nums">450°</span>
              <span>Жар печи</span>
            </div>
            <span className="text-border text-lg">•</span>
            <div className="text-center">
              <span className="block font-bold text-lg text-foreground tabular-nums">90с</span>
              <span>Выпекание</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
