import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';
import stripePromise from '../utils/stripe';
import { Button } from './ui/Button';

// Maximum number of retry attempts
const MAX_RETRIES = 2;

interface StripeCheckoutButtonProps {
  priceId: string;
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successUrl?: string;
  cancelUrl?: string;
}

const StripeCheckoutButton = ({
  priceId,
  buttonText = 'Checkout',
  onSuccess,
  onError,
  successUrl = `${window.location.origin}/success`,
  cancelUrl = `${window.location.origin}/canceled`,
}: StripeCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    const toastId = toast.loading('Processing your request...');
    
    try {
      // Call your Vercel API route to create a Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId,
          successUrl,
          cancelUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'Something went wrong';
        
        if (response.status === 400) {
          errorMessage = errorData.message || 'Invalid request. Please check your information.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status >= 500) {
          errorMessage = 'Our servers are experiencing issues. Please try again later.';
        }
        
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      const { sessionId } = await response.json();

      // When the customer clicks on the button, redirect them to Checkout.
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

      toast.success('Redirecting to checkout...', { id: toastId });
      setRetryCount(0);
      toast.success('Redirecting to checkout...', { id: toastId });
      onSuccess?.();
    } catch (err) {
      console.error('Checkout error:', err);
      const error = err as Error & { status?: number };
      setLastError(error);
      
      // Show appropriate error message
      const errorMessage = error.status === 429 
        ? error.message 
        : `Failed to process checkout: ${error.message || 'Please try again'}`;
      
      toast.error(errorMessage, { 
        id: toastId,
        duration: error.status === 429 ? 10000 : 5000
      });
      
      onError?.(error);
    } finally {
      // Always try to dismiss the toast
      try {
        toast.dismiss(toastId);
      } catch (e) {
        console.error('Error dismissing toast:', e);
      }
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (lastError && retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
    }
    handleCheckout();
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
        isLoading={loading}
        variant="default"
        size="lg"
        fullWidth
        className="mt-4"
      >
        {loading ? (
          'Processing...'
        ) : lastError && retryCount < MAX_RETRIES ? (
          <span className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </span>
        ) : (
          buttonText
        )}
      </Button>
      {lastError && retryCount < MAX_RETRIES && (
        <p className="mt-2 text-sm text-red-600">
          Attempt {retryCount + 1} of {MAX_RETRIES}
        </p>
      )}
      {lastError && retryCount >= MAX_RETRIES && (
        <p className="mt-2 text-sm text-red-600">
          Having trouble? Please contact support.
        </p>
      )}
    </div>
  );
};

export default StripeCheckoutButton;
