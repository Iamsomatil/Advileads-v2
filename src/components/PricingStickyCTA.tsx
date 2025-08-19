import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

export const PricingStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show CTA when scrolled past 300px
      setIsVisible(scrollPosition > 300);
      // Add shadow when scrolled past 50px
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white z-50 transition-all duration-300 transform ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900">Ready to get started?</h3>
          <p className="text-sm text-gray-600">Choose the perfect plan for your business needs</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-1/2 sm:w-auto"
            onClick={scrollToPricing}
          >
            View Plans
          </Button>
          <Button 
            size="lg" 
            className="w-1/2 sm:w-auto"
            onClick={scrollToPricing}
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
