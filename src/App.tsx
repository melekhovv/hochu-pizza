import React, { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { MenuSection } from './components/MenuSection'
import { ReservationSection } from './components/ReservationSection'
import { ReviewsSection } from './components/ReviewsSection'
import { FaqSection } from './components/FaqSection'
import { Footer } from './components/Footer'
import { PizzaCustomizerModal } from './components/PizzaCustomizerModal'
import { CartDrawer } from './components/CartDrawer'
import { ToastNotification } from './components/ui/ToastNotification'
import type { MenuItem } from './types/pizza'

function MainContent() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null)

  const handleOpenCustomizer = (item?: MenuItem | null) => {
    setCustomizerItem(item || null)
    setIsCustomizerOpen(true)
  }

  const handleOpenReservation = () => {
    const el = document.getElementById('reservation')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden w-full max-w-full">
      {/* Navigation */}
      <Navbar
        onOpenCustomizer={() => handleOpenCustomizer(null)}
        onOpenReservation={handleOpenReservation}
      />

      {/* Main Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Hero
          onOpenCustomizer={() => handleOpenCustomizer(null)}
          onOpenReservation={handleOpenReservation}
        />
        <MenuSection
          onCustomizeItem={(item) => handleOpenCustomizer(item)}
        />
        <ReservationSection />
        <ReviewsSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-out Drawers */}
      <PizzaCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialItem={customizerItem}
      />
      <CartDrawer />
      <ToastNotification />
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
