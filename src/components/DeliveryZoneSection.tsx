import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Truck,
  MapPin,
  Flame,
  Wind,
  ShieldCheck,
  Check,
  Store,
  Navigation,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export const DeliveryZoneSection: React.FC = () => {
  const [address, setAddress] = useState('')
  const [activeZoneTab, setActiveZoneTab] = useState<'green' | 'yellow' | 'pickup'>('green')
  const [routeInfo, setRouteInfo] = useState<{
    address: string
    distance: string
    time: string
    zone: string
    isFreeDelivery: boolean
    minOrder: string
  }>({
    address: 'ул. Арбат, 25',
    distance: '1.8 км от печи',
    time: '25–30 мин',
    zone: 'Зелёная зона (Центр)',
    isFreeDelivery: true,
    minOrder: 'Бесплатно от 1 200 ₽',
  })

  const popularAddresses = [
    { name: 'ул. Арбат', dist: '1.8 км', time: '25–30 мин', zone: 'green' },
    { name: 'Патриаршие пруды', dist: '1.2 км', time: '20–25 мин', zone: 'green' },
    { name: 'ул. Тверская', dist: '1.5 км', time: '22–28 мин', zone: 'green' },
    { name: 'Замоскворечье', dist: '3.6 км', time: '30–38 мин', zone: 'yellow' },
    { name: 'Хамовники', dist: '3.9 км', time: '32–40 мин', zone: 'yellow' },
  ]

  const handleSelectPreset = (preset: typeof popularAddresses[0]) => {
    setAddress(preset.name)
    setRouteInfo({
      address: preset.name,
      distance: `${preset.dist} от печи`,
      time: preset.time,
      zone: preset.zone === 'green' ? 'Зелёная зона (Центр)' : 'Жёлтая зона (В пределах ТТК)',
      isFreeDelivery: true,
      minOrder: preset.zone === 'green' ? 'Бесплатно от 1 200 ₽' : 'Бесплатно от 1 500 ₽',
    })
    setActiveZoneTab(preset.zone as 'green' | 'yellow')
  }

  const handleCheckAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    const lower = address.toLowerCase()
    const isCentral =
      lower.includes('тверск') ||
      lower.includes('арбат') ||
      lower.includes('никитск') ||
      lower.includes('патриарш') ||
      lower.includes('лубянк') ||
      lower.includes('маяковск') ||
      lower.includes('кремл') ||
      lower.includes('кутузов')

    if (isCentral) {
      setRouteInfo({
        address: address,
        distance: '~2.0 км от печи',
        time: '25–32 мин',
        zone: 'Зелёная зона (Центральная)',
        isFreeDelivery: true,
        minOrder: 'Бесплатно от 1 200 ₽ (иначе 190 ₽)',
      })
      setActiveZoneTab('green')
    } else {
      setRouteInfo({
        address: address,
        distance: '~4.5 км от печи',
        time: '35–45 мин',
        zone: 'Жёлтая зона (Городская)',
        isFreeDelivery: true,
        minOrder: 'Бесплатно от 1 500 ₽ (иначе 250 ₽)',
      })
      setActiveZoneTab('yellow')
    }
  }

  const pillars = [
    {
      icon: <Flame className="w-6 h-6" />,
      title: 'Подогрев 70°C в термосумке',
      desc: 'Внутри каждой сумки установлен термоэлемент. Пицца не успевает остыть даже в снег и дождь: сыр тянется шёлком, а сырный бортик остается мягким.',
      badge: 'Температура при вручении ≥ 65°C',
    },
    {
      icon: <Wind className="w-6 h-6" />,
      title: 'Коробки с выводом пара',
      desc: 'Специальная микроперфорация отводит конденсат наружу, не давая пару оседать каплями на дно. Бортик остается хрустящим, а не размокшим.',
      badge: '100% защита от влажного теста',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Собственные байкеры и курьеры',
      desc: 'Не собираем по пути 5 сторонних заказов. Курьер забирает пиццу прямо с лопаты пиццайоло и мчит по оптимальному маршруту только к вам.',
      badge: 'Среднее время: 31 минута',
    },
  ]

  return (
    <section id="delivery" className="py-20 sm:py-28 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with spring reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Горячая доставка за 30 минут
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance leading-tight">
            Доставляем пиццу обжигающей, словно вы сидите у самой печи
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Мы не отдаем заказы случайным агрегаторам. Наши курьеры оснащены термосумками с постоянным подогревом до 70°C, а коробки имеют диффузоры пара, чтобы корочка сохраняла фирменный хруст.
          </p>
        </motion.div>

        {/* 3 Technological Standards Strip with Staggered Entrance */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
                delay: idx * 0.1,
              }}
              className="p-6 rounded-2xl border border-border bg-card/60 flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 text-xs font-mono text-primary font-semibold">
                {pillar.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Delivery Calculator & Zone Simulator with Smooth Rise */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.15 }}
          className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Address Finder & Live Calculation */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Проверка времени и условий доставки</span>
                </div>
                <h3 className="text-2xl font-bold font-serif text-foreground mt-1">
                  Узнайте точное время до вашего дома или офиса
                </h3>
              </div>

              {/* Address Input Form */}
              <form onSubmit={handleCheckAddress} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Введите улицу, например: ул. Арбат, 25 или Тверская, 12"
                    className="h-12 text-sm bg-background"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="h-12 px-7 font-semibold shrink-0"
                  >
                    Рассчитать
                  </Button>
                </div>

                {/* Popular Location Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground mr-1">Быстрый выбор:</span>
                  {popularAddresses.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-border bg-background hover:border-primary/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </form>

              {/* Dynamic Route Results Card */}
              {routeInfo && (
                <div className="p-5 rounded-2xl border border-border/80 bg-background/90 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Адрес назначения</div>
                        <div className="text-sm font-bold text-foreground">{routeInfo.address}</div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-muted-foreground">Зона доставки</div>
                      <div className="text-xs font-semibold text-primary">{routeInfo.zone}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                      <span className="text-[11px] text-muted-foreground block">Время в пути</span>
                      <span className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums">
                        {routeInfo.time}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                      <span className="text-[11px] text-muted-foreground block">Расстояние</span>
                      <span className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums">
                        {routeInfo.distance}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                      <span className="text-[11px] text-muted-foreground block">Условия</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-600 truncate block mt-0.5">
                        Бесплатно
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Отправка из ресторана: ул. Большая Никитская, 14 (м. Арбатская)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Zone Overview Tabs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Условия по зонам
              </div>

              {/* Zone Tab Buttons */}
              <div className="space-y-3">
                <div
                  onClick={() => setActiveZoneTab('green')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeZoneTab === 'green'
                      ? 'border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                      : 'border-border bg-background hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-foreground">
                        Зелёная зона (Центр)
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-600">
                      25–35 мин
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    До 5 км от печи • Бесплатно от 1 200 ₽ (иначе 190 ₽)
                  </p>
                </div>

                <div
                  onClick={() => setActiveZoneTab('yellow')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeZoneTab === 'yellow'
                      ? 'border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/20'
                      : 'border-border bg-background hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-foreground">
                        Жёлтая зона (В пределах ТТК)
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-600">
                      35–45 мин
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    До 10 км от печи • Бесплатно от 1 500 ₽ (иначе 250 ₽)
                  </p>
                </div>

                <div
                  onClick={() => setActiveZoneTab('pickup')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeZoneTab === 'pickup'
                      ? 'border-primary/60 bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-background hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        Самовывоз из пиццерии
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Скидка 10%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Готовность за 15–20 мин • ул. Большая Никитская, 14
                  </p>
                </div>
              </div>

              {/* Hot Guarantee Note */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Гарантия тепла:</strong> если пицца приедет остывшей ниже 60°C, мы бесплатно привезем вам новую или вернем деньги в полном объеме.
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
