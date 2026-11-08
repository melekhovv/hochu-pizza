import React from 'react'
import { Flame, MapPin, Phone, Clock } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer id="contacts" className="bg-background text-foreground border-t border-border pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 fill-current text-accent" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-foreground font-serif leading-none block">
                  ХОЧУ ПИЦЦЫ!
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Pizzeria & Forno a Legna
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Ремесленная пиццерия с настоящей неаполитанской дровяной печью. 36 часов холодной ферментации теста, итальянская мука Caputo и свежие фермерские сыры каждый день.
            </p>

            <div className="pt-2 text-xs text-muted-foreground">
              ООО «Хочу Пиццы Ресторантс» • ОГРН 1217700412890
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Разделы
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#menu" className="hover:text-primary transition-colors">
                  Меню пиццерии
                </a>
              </li>
              <li>
                <a href="#craft" className="hover:text-primary transition-colors">
                  О тесте и печи
                </a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-primary transition-colors">
                  Зоны доставки
                </a>
              </li>
              <li>
                <a href="#reservation" className="hover:text-primary transition-colors">
                  Бронь столика
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-primary transition-colors">
                  Отзывы гостей
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  Вопросы и ответы
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Ресторан & Печь
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Москва, ул. Большая Никитская, 14 (м. Арбатская)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Ежедневно с 11:00 до 23:00 (кухня принимает заказы до 22:30)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="tel:+74959210088" className="hover:text-foreground font-semibold">
                  +7 (495) 921-00-88
                </a>
              </li>
            </ul>
          </div>

          {/* Special Deals */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Спецпредложения
            </h4>
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="text-xs font-bold text-primary uppercase tracking-wide">
                Скидка 15% на первый заказ
              </div>
              <p className="text-xs text-muted-foreground">
                Используйте промокод <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">ХОЧУ15</span> в корзине при оформлении доставки.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Скидка 10% на все заказы на вынос (самовывоз из ресторана).
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 «Хочу Пиццы!». Все права защищены.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer">Политика конфиденциальности</span>
            <span className="hover:text-foreground cursor-pointer">Условия доставки и оплаты</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
