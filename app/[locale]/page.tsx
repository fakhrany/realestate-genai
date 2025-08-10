import SplitView from '@/components/SplitView';
export default function Page({ params }:{ params:{ locale:'en'|'ar' }}){ return <SplitView locale={params.locale} />; }
