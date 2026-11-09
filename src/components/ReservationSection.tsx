import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Calendar,
  User,
  Phone,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

const COOLDOWN_SECONDS = 40
const MAX_BOOKINGS_WINDOW_MINUTES = 10
const MAX_BOOKINGS_ALLOWED = 3
const STORAGE_KEY_TIMESTAMPS = 'hochu_res_timestamps_v1'

export const ReservationSection: React.FC = () => {
  const [date, setDate] = useState('today')
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Security & Anti-Spam state
  const [honeypot, setHoneypot] = useState('')
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const mountTimeRef = useRef<number>(Date.now())

  // Booking Flow: 'form' | 'confirmed' | 'confirm_cancel' | 'cancelled'
  const [bookingState, setBookingState] = useState<'form' | 'confirmed' | 'confirm_cancel' | 'cancelled'>('form')
  const [reservationCode, setReservationCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)

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

  // Rate Limiting checker & countdown timer
  useEffect(() => {
    const checkCooldown = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_TIMESTAMPS)
        if (!raw) return
        const timestamps: number[] = JSON.parse(raw)
        const now = Date.now()

        // 1. Sliding window check (max 3 bookings within 10 minutes)
        const recent = timestamps.filter(
          (t) => now - t < MAX_BOOKINGS_WINDOW_MINUTES * 60 * 1000
        )

        if (recent.length >= MAX_BOOKINGS_ALLOWED) {
          const oldestInWindow = recent[0]
          const unlockAt = oldestInWindow + MAX_BOOKINGS_WINDOW_MINUTES * 60 * 1000
          const secondsLeft = Math.ceil((unlockAt - now) / 1000)
          if (secondsLeft > 0) {
            setCooldownRemaining(secondsLeft)
            setRateLimitError(
              `Превышен лимит бронирований (${MAX_BOOKINGS_ALLOWED} брони за ${MAX_BOOKINGS_WINDOW_MINUTES} мин). В целях безопасности следующая запись будет доступна через ${secondsLeft} сек.`
            )
            return
          }
        }

        // 2. Immediate per-submission cooldown (40s)
        if (timestamps.length > 0) {
          const lastTs = timestamps[timestamps.length - 1]
          const diff = Math.ceil((lastTs + COOLDOWN_SECONDS * 1000 - now) / 1000)
          if (diff > 0) {
            setCooldownRemaining(diff)
            setRateLimitError(null)
            return
          }
        }

        setCooldownRemaining(0)
        setRateLimitError(null)
      } catch (e) {
        setCooldownRemaining(0)
      }
    }

    checkCooldown()
    const interval = setInterval(checkCooldown, 1000)
    return () => clearInterval(interval)
  }, [bookingState])

  const sanitizeInput = (str: string) => {
    // Strip HTML/script tags and restrict excessive whitespace
    return str.replace(/<[^>]*>?/gm, '').trim()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Anti-Bot Honeypot trap: bots fill hidden inputs
    if (honeypot.trim() !== '') {
      console.warn('Bot submission blocked via honeypot trap')
      return
    }

    // 2. Speed check: human beings don't submit forms in < 1000ms
    if (Date.now() - mountTimeRef.current < 1000) {
      console.warn('Suspiciously fast submission blocked')
      return
    }

    // 3. Cooldown / Rate-limit active check
    if (cooldownRemaining > 0) {
      return
    }

    // 4. Sanitize and validate inputs
    const cleanName = sanitizeInput(name)
    const cleanPhone = sanitizeInput(phone)

    if (cleanName.length < 2) {
      alert('Пожалуйста, укажите корректное имя (от 2 символов)')
      return
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '')
    if (digitsOnly.length < 10) {
      alert('Пожалуйста, укажите полный номер телефона для связи (не менее 10 цифр)')
      return
    }

    // 5. Generate unique secure reservation ID
    const newCode = `#HP-${Math.floor(1000 + Math.random() * 9000)}`
    setReservationCode(newCode)
    setBookingState('confirmed')

    // 6. Record timestamp to localStorage for anti-flood protection
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TIMESTAMPS)
      const list: number[] = raw ? JSON.parse(raw) : []
      list.push(Date.now())
      // Keep only last 20 timestamps
      const trimmed = list.slice(-20)
      localStorage.setItem(STORAGE_KEY_TIMESTAMPS, JSON.stringify(trimmed))
      setCooldownRemaining(COOLDOWN_SECONDS)
    } catch (e) {
      // Ignore storage errors
    }
  }

  const handleCopyCode = () => {
    if (!reservationCode) return
    navigator.clipboard.writeText(reservationCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCancelBooking = () => {
    setBookingState('cancelled')
  }

  const resetForm = () => {
    setBookingState('form')
    setName('')
    setPhone('')
    setReservationCode('')
    setCopiedCode(false)
    mountTimeRef.current = Date.now()
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
          className="mt-10 max-w-xl mx-auto rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            
            {/* STATE 1: CONFIRMED RESERVATION (Rich Micro-Interaction Animation) */}
            {bookingState === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -15 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                className="py-6 sm:py-8 text-center space-y-5"
              >
                {/* Celebratory Animated Checkmark with Pulse Rings */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  {/* Expanding pulse wave 1 */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: [0.85, 1.45, 1.7], opacity: [0.7, 0.25, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-500/25"
                  />
                  {/* Expanding pulse wave 2 */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: [0.85, 1.3, 1.5], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-500/15"
                  />
                  
                  {/* Core Icon Disc */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22, delay: 0.08 }}
                    className="relative w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                  >
                    <svg
                      className="w-8 h-8 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17L4 12"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Status Pill */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Бронь подтверждена</span>
                </motion.div>

                {/* Headings */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1.5"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                    Столик успешно забронирован!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    <span className="text-foreground font-semibold">{name}</span>, ждем вас{' '}
                    <span className="text-foreground font-medium">{getDateLabel(date).toLowerCase()}</span> в{' '}
                    <span className="text-foreground font-medium">{time}</span>. Столик на{' '}
                    <span className="text-foreground font-medium">
                      {guests} {guests === 1 ? 'персону' : guests < 5 ? 'персоны' : 'персон'}
                    </span>{' '}
                    готов к вашему визиту.
                  </p>
                </motion.div>

                {/* Interactive Reservation Code Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-3.5 rounded-2xl border border-border bg-card/70 max-w-sm mx-auto flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground">Номер брони:</span>
                    <span className="font-bold text-foreground text-sm tracking-wider">{reservationCode}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Скопировать номер брони"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-medium">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Копировать</span>
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Action Buttons: Cancel or New Booking */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto"
                >
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="w-full sm:w-auto h-11 px-5 text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Забронировать другой стол</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setBookingState('confirm_cancel')}
                    className="w-full sm:w-auto h-11 px-5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    <span>Отменить бронь</span>
                  </Button>
                </motion.div>

              </motion.div>
            )}

            {/* STATE 2: CANCELLATION PROMPT CONFIRMATION */}
            {bookingState === 'confirm_cancel' && (
              <motion.div
                key="confirm_cancel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="py-6 sm:py-8 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
                  <AlertTriangle className="w-7 h-7" />
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    Отменить бронирование {reservationCode}?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Вы уверены, что хотите аннулировать бронь на {guests} персон {getDateLabel(date).toLowerCase()} в {time}? Столик будет освобожден для других гостей.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-xs mx-auto">
                  <Button
                    variant="destructive"
                    onClick={handleCancelBooking}
                    className="w-full sm:w-auto h-11 px-5 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Да, отменить бронь
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBookingState('confirmed')}
                    className="w-full sm:w-auto h-11 px-5 text-xs font-semibold cursor-pointer"
                  >
                    Назад
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STATE 3: BOOKING SUCCESSFULLY CANCELLED */}
            {bookingState === 'cancelled' && (
              <motion.div
                key="cancelled"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20">
                  <XCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold font-serif text-foreground">
                    Бронирование отменено
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Бронь <span className="font-mono text-foreground font-semibold">{reservationCode}</span> успешно аннулирована. Будем рады видеть вас в другой раз!
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="default"
                    onClick={resetForm}
                    className="h-11 px-6 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Забронировать снова
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STATE 4: THE INTERACTIVE RESERVATION FORM */}
            {bookingState === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Security Anti-Bot Honeypot (Invisible to humans, trapped by spam bots) */}
                <input
                  type="text"
                  name="user_website_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                />

                {/* Anti-Spam / Rate-Limit Warning Banner */}
                {cooldownRemaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center gap-2.5"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      {rateLimitError ||
                        `Защита от спама активна. Следующая бронь будет доступна через ${cooldownRemaining} сек.`}
                    </span>
                  </motion.div>
                )}

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
                        maxLength={50}
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
                        maxLength={25}
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

                {/* Security Trust Note */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Защита данных SSL & фильтрация спама</span>
                  </div>
                  <span className="font-mono text-muted-foreground/60 hidden sm:inline">
                    Подтверждение по SMS
                  </span>
                </div>

                {/* Submit Button with Anti-Spam Cooldown support */}
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={cooldownRemaining > 0}
                  className="w-full h-12 font-semibold text-base shadow-md cursor-pointer justify-center"
                >
                  {cooldownRemaining > 0 ? (
                    <span>Подождите {cooldownRemaining}с...</span>
                  ) : (
                    <span>Подтвердить</span>
                  )}
                </Button>
              </form>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
