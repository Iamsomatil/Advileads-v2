import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Zap, 
  Crown, 
  Star,
  ArrowRight,
  Users,
  MessageSquare,
  TrendingUp,
  Shield
} from 'lucide-react';
import { redirectToCheckout } from '../api/stripe';
import { useAuth } from '../contexts/AuthContext';

export default function Pricing() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Replace with your real Stripe price IDs
  const priceIds: Record<string, string> = {
    'Pro Monthly': 'price_1MONTHLY',
    'Pro Annual': 'price_1ANNUAL',
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '14 days',
      description: 'Perfect for trying out Advileads',
      features: [
        'Access to 50 leads',
        'Basic filtering and search',
        'Community forum access',
        'Email support',
        'Standard lead categories'
      ],
      cta: 'Start Free Trial',
      ctaLink: '/register',
      popular: false,
      icon: Zap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Pro Monthly',
      price: '$49',
      period: 'per month',
      description: 'For growing sales teams',
      features: [
        'Unlimited lead access',
        'Advanced filtering & analytics',
        'Priority community features',
        'Priority email support',
        'All lead categories',
        'Export functionality',
        'LinkedIn integration',
        'Real-time lead updates'
      ],
      cta: 'Get Pro Monthly',
      ctaLink: '',
      popular: true,
      icon: Crown,
      color: 'from-teal-500 to-teal-600'
    },
    {
      name: 'Pro Annual',
      price: '$39',
      period: 'per month',
      originalPrice: '$49',
      description: 'Best value for serious professionals',
      features: [
        'Everything in Pro Monthly',
        '2 months free (20% discount)',
        'Advanced lead scoring',
        'Custom lead alerts',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Priority feature requests'
      ],
      cta: 'Get Pro Annual',
      ctaLink: '',
      popular: false,
      icon: Star,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Premium Lead Database',
      description: 'Access thousands of verified leads across all industries and regions'
    },
    {
      icon: MessageSquare,
      title: 'Exclusive Community',
      description: 'Network with top sales professionals and share winning strategies'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Track your lead generation performance with detailed insights'
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Enterprise-grade security to protect your business information'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you\'ll only pay the prorated difference.'
    },
    {
      question: 'What happens after my free trial ends?',
      answer: 'After your 14-day free trial, you can choose to upgrade to a paid plan or your account will be paused until you decide to upgrade.'
    },
    {
      question: 'Are there any setup fees?',
      answer: 'No, there are no setup fees, hidden charges, or long-term contracts. You only pay for what you use.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access continues until the end of your billing period.'
    }
  ];

  const handleStripeCheckout = async (planName: string) => {
    if (!user?.email) return;
    setLoadingPlan(planName);
    try {
      if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        // In development without Stripe key, show a message instead of redirecting
        alert(`In production, this would redirect to Stripe Checkout for ${planName} (Price ID: ${priceIds[planName]})`);
      } else {
        await redirectToCheckout(priceIds[planName], user.email);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error initiating checkout. Please try again later.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              Success Plan
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with a free trial and upgrade when you're ready to scale your lead generation
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all hover:shadow-2xl hover:scale-105 ${
                  plan.popular 
                    ? 'border-teal-300 ring-4 ring-teal-100' 
                    : 'border-gray-200 hover:border-teal-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-gray-500">
                        <span className="line-through">${plan.originalPrice}/month</span>
                        <span className="ml-2 text-green-600 font-medium">Save 20%</span>
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.ctaLink ? (
                    <Link
                      to={plan.ctaLink}
                      className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleStripeCheckout(plan.name)}
                      disabled={loadingPlan === plan.name}
                      className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {loadingPlan === plan.name ? 'Redirecting...' : plan.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools and resources you need to generate quality leads and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-teal-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of sales professionals who are already using Advileads to close more deals.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-teal-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="text-sm text-teal-200 mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}