import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export const ReservationSection: React.FC = () => {
  const [date, setDate] = useState('today')
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)
  const [zone, setZone] = useState('oven')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [wishes, setWishes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reservationCode, setReservationCode] = useState('')

  const timeSlots = ['12:30', '14:00', '16:30', '18:00', '19:00', '20:15', '21:30']

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
    setWishes('')
    setReservationCode('')
  }

  return (
    <section id="reservation" className="py-20 sm:py-28 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            В гостях у нас
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mt-2 text-balance">
            Забронировать столик в пиццерии
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Приходите насладиться хрустящей пиццей прямо из огня печи, бокалом вина и атмосферой итальянского ужина.
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto rounded-2xl border border-border bg-background p-6 sm:p-10 shadow-lg">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-foreground">
                Столик успешно забронирован!
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {name}, ждем вас {date === 'today' ? 'сегодня' : 'в выбранную дату'} в {time}. Столик на {guests} персон в зоне «{zone === 'oven' ? 'У дровяной печи' : zone === 'cosy' ? 'Уютный зал' : 'Терраса'}» готов к вашему визиту.
              </p>
              <div className="p-4 rounded-xl border border-border bg-muted/40 max-w-xs mx-auto text-xs font-mono">
                Номер брони: <span className="font-bold text-foreground">{reservationCode}</span>
              </div>
              <Button variant="outline" onClick={resetForm} className="mt-4">
                Забронировать другой стол
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Number of guests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Количество персон
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGuests(g)}
                      className={`h-10 min-w-[44px] px-3 rounded-lg border font-mono text-sm font-semibold transition-colors cursor-pointer ${
                        guests === g
                          ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      {g} {g === 8 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Дата
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="today">Сегодня</option>
                    <option value="tomorrow">Завтра</option>
                    <option value="friday">Пятница</option>
                    <option value="saturday">Суббота</option>
                    <option value="sunday">Воскресенье</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Время
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Preferred Zone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Зона посадки
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setZone('oven')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      zone === 'oven'
                        ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs block">У дровяной печи</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZone('cosy')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      zone === 'cosy'
                        ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs block">Тихий уютный зал</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZone('terrace')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      zone === 'terrace'
                        ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs block">Терраса</span>
                  </button>
                </div>
              </div>

              {/* Step 4: Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reservation-user-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Ваше имя *
                  </label>
                  <Input
                    id="reservation-user-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Александр"
                  />
                </div>
                <div>
                  <label htmlFor="reservation-user-phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Телефон для подтверждения *
                  </label>
                  <Input
                    id="reservation-user-phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reservation-user-wishes" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Пожелания или повод (опционально)
                </label>
                <Input
                  id="reservation-user-wishes"
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder="День рождения, годовщина, детский стульчик..."
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-semibold text-base shadow-md"
              >
                Подтвердить бронирование столика
              </Button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
