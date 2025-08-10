'use client';
export function Card({ className='', ...props }: any){ return <div className={`rounded-2xl border border-amber-200 bg-white/70 ${className}`} {...props} />; }
export function CardHeader({ className='', ...props }: any){ return <div className={`px-4 pt-4 ${className}`} {...props} />; }
export function CardTitle({ className='', ...props }: any){ return <h3 className={`text-base font-semibold ${className}`} {...props} />; }
export function CardContent({ className='', ...props }: any){ return <div className={`p-4 ${className}`} {...props} />; }
export default Card;
