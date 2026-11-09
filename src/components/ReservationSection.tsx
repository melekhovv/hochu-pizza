import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  CheckCircle2,
  Calendar,
  User,
  Phone,
  ChevronDown,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export const ReservationSection: React.FC = () => {
  const [date, setDate] = useState('today')
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reservationCode, setReservationCode] = useState('')

  const timeSlots = [
    '12:00',
    '13:00',
    '14:30',
    '16:00',
    '17:30',
    '18:30',
    '19:00',
    '19:30',
    '20:15',
    '21:00',
    '21:45',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setReservationCode(`#HP-${Math.floor(1000 + Math.random() * 9000)}`)
    setIsSubmitted(true)
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setName('')
    setPhone('')
    setReservationCode('')
  }

  const getDateLabel = (d: string) => {
    switch (d) {
      case 'today':
        return 'Сегодня, 9 ноября'
      case 'tomorrow':
        return 'Завтра, 10 ноября'
      case 'friday':
        return 'Пятница, 13 ноября'
      case 'saturday':
        return 'Суббота, 14 ноября'
      case 'sunday':
        return 'Воскресенье, 15 ноября'
      default:
        return 'Выбранная дата'
    }
  }

  return (
    <section id="reservation" className="py-20 sm:py-28 bg-card border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            В гостях у нас
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance">
            Забронировать столик в пиццерии
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Приходите насладиться хрустящей пиццей прямо из дровяной печи, бокалом вина и атмосферой теплого неаполитанского ужина.
          </p>
        </motion.div>

        {/* Clean, Mobile-Optimized Centered Reservation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.15 }}
          className="mt-10 max-w-xl mx-auto rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xl"
        >
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-foreground">
                Столик успешно забронирован!
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {name}, ждем вас {getDateLabel(date).toLowerCase()} в {time}. Столик на {guests} {guests === 1 ? 'персону' : guests < 5 ? 'персоны' : 'персон'} готов к вашему визиту.
              </p>
              <div className="p-4 rounded-xl border border-border bg-card max-w-xs mx-auto text-xs font-mono">
                Номер брони: <span className="font-bold text-foreground">{reservationCode}</span>
              </div>
              <Button variant="outline" onClick={resetForm} className="mt-4">
                Забронировать другой стол
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Количество персон */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Количество гостей
                  </label>
                  <span className="text-xs text-primary font-mono font-medium">
                    {guests} {guests === 1 ? 'персона' : guests < 5 ? 'персоны' : 'персон'}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((g) => {
                    const isSelected = guests === g
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuests(g)}
                        className={`h-11 rounded-xl border font-mono text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-sm ring-1 ring-primary'
                            : 'border-border bg-card text-foreground hover:bg-muted/70 hover:border-border/80'
                        }`}
                      >
                        {g === 8 ? '8+' : g}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Дата и Время с идеально симметричными отступами стрелок (16px слева и 16px справа) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Поле ДАТА */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Дата посещения
                  </label>
                  <div className="relative">
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl border border-border bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:border-primary/50 transition-colors select-none font-medium"
                    >
                      <option value="today">Сегодня, 9 ноября</option>
                      <option value="tomorrow">Завтра, 10 ноября</option>
                      <option value="friday">Пятница, 13 ноября</option>
                      <option value="saturday">Суббота, 14 ноября</option>
                      <option value="sunday">Воскресенье, 15 ноября</option>
                    </select>
                    {/* Стрелка расположена ровно на 16px от правого края (right-4), как и текст слева (pl-4) */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </div>
                  </div>
                </div>

                {/* Поле ВРЕМЯ */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Время посадки
                  </label>
                  <div className="relative">
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl border border-border bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:border-primary/50 transition-colors select-none font-mono font-medium"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {/* Стрелка расположена ровно на 16px от правого края (right-4), как и текст слева (pl-4) */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. Контактные данные (Имя и Телефон) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Ваше имя *
                  </label>
                  <div className="relative">
                    <Input
                      id="res-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Александр"
                      className="h-11 pl-10 bg-card text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
                      <User className="w-4 h-4 opacity-60" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="res-phone" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Телефон для связи *
                  </label>
                  <div className="relative">
                    <Input
                      id="res-phone"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="h-11 pl-10 bg-card text-sm font-mono"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 opacity-60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Live Booking Summary Strip */}
              <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {getDateLabel(date)}, {time} • {guests} {guests === 1 ? 'персона' : guests < 5 ? 'персоны' : 'персон'}
                  </span>
                </div>
                <span className="text-emerald-500 font-semibold font-mono hidden sm:inline">
                  Бронь бесплатная
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full h-12 font-semibold text-base shadow-md cursor-pointer justify-center"
              >
                <span>Подтвердить</span>
              </Button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  )
}
