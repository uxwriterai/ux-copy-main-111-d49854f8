import { useState } from 'react';
import { HeroForm } from '@/components/hero/HeroForm';
import { toast } from 'sonner';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      // Here you would typically handle the form submission
      // For now, we'll just show a success message
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <HeroForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}