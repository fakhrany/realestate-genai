'use client';
import * as React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline'|'destructive'|'secondary' };
export const Button = React.forwardRef<HTMLButtonElement, Props>(({ className='', variant, ...props }, ref) => {
  const base='inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition';
  const variants=variant==='outline'?'border border-amber-200 bg-white':variant==='destructive'?'bg-red-600 text-white':variant==='secondary'?'bg-neutral-100':'bg-amber-500 text-black';
  return <button ref={ref} className={`${base} ${variants} ${className}`} {...props} />;
});
Button.displayName='Button'; export default Button;
