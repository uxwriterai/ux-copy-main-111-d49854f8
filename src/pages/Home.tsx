import { HeroForm } from '@/components/hero/HeroForm';

export function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <HeroForm />
    </div>
  );
}