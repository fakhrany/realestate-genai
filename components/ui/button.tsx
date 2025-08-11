// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

type Variant = 'default' | 'secondary' | 'outline' | 'destructive';

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-transparent';

const variants: Record<Variant, string> = {
  default:
    'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-600 border border-amber-700/40',
  secondary:
    'bg-white text-neutral-900 hover:bg-neutral-50 border border-amber-200 focus-visible:ring-amber-600',
  outline:
    'bg-transparent text-neutral-900 border border-amber-300 hover:bg-amber-50 focus-visible:ring-amber-600',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;