import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none'

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40',
      outline: 'border border-border bg-background hover:bg-accent/10 hover:text-foreground text-foreground shadow-xs',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs',
      ghost: 'hover:bg-muted hover:text-foreground text-foreground/80',
      link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-normal',
    }

    const sizes = {
      default: 'h-10 px-4 py-2 min-h-[40px]',
      sm: 'h-8 rounded-md px-3 text-xs min-h-[32px]',
      lg: 'h-12 rounded-lg px-8 text-base min-h-[48px]',
      icon: 'h-10 w-10 min-h-[40px] min-w-[40px] p-0',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
