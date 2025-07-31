import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

// Mock Stripe implementation for development
class MockStripe {
  async redirectToCheckout() {
    console.log('[MOCK] Stripe checkout would redirect here in production');
    return { error: null };
  }
}

let stripePromise: Promise<any> | null = null;

// Only initialize Stripe if we have a public key
if (STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(STRIPE_PUBLIC_KEY).catch(error => {
    if (IS_DEVELOPMENT) {
      console.log('[DEV] Stripe not available in development mode');
    } else {
      console.error('Error loading Stripe:', error);
    }
    return null;
  });
} else if (!IS_DEVELOPMENT) {
  console.error('Stripe public key is required in production');
}

const getStripe = async () => {
  if (!STRIPE_PUBLIC_KEY) {
    return new MockStripe();
  }
  return stripePromise;
};

export async function redirectToCheckout(priceId: string, userEmail: string) {
  try {
    if (IS_DEVELOPMENT && !STRIPE_PUBLIC_KEY) {
      console.log('[MOCK] Would create checkout session for:', { priceId, userEmail });
      alert('In production, this would redirect to Stripe Checkout.\n\nPrice ID: ' + priceId + '\nEmail: ' + userEmail);
      return;
    }

    // Call your backend to create a Checkout session
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userEmail }),
    });

    if (!res.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await res.json();
    
    if (!sessionId) {
      throw new Error('No session ID returned from server');
    }

    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    if (IS_DEVELOPMENT) {
      alert('Checkout error (development mode): ' + (error instanceof Error ? error.message : String(error)));
    }
    throw error;
  }
}

// Export mock status for UI components to check
export const isMockMode = !STRIPE_PUBLIC_KEY;
