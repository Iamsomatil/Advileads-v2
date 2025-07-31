import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    planType: 'trial', // 'trial', 'monthly', or 'yearly'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectPlan = (planId: string) => {
    setFormData({
      ...formData,
      planType: planId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, formData.planType);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Access to premium lead database',
    'Exclusive community forum',
    'Advanced filtering and search',
    'Real-time lead updates',
    'No credit card required for trial',
  ];

  const plans = [
    {
      id: 'trial',
      name: 'Free Trial',
      description: '14 days free access',
      price: '$0',
      period: '14 days',
      popular: true,
    },
    {
      id: 'monthly',
      name: 'Monthly',
      description: 'Billed monthly',
      price: '$29',
      period: 'per month',
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      description: 'Billed annually (2 months free)',
      price: '$290',
      period: 'per year',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Benefits */}
          <div className="hidden lg:block">
            <div className="h-full flex flex-col justify-center p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Advileads</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Start your 14-day free trial
                </h2>
                <p className="text-gray-600">
                  Join thousands of sales professionals who trust Advileads for premium lead
                  generation.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-800">
                  <strong>No commitment required.</strong> Cancel anytime during your trial period.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8 lg:hidden">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Start your free trial</h2>
                <p className="mt-2 text-sm text-gray-600">14 days free • No credit card required</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your plan
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => selectPlan(plan.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.planType === plan.id
                            ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        } ${plan.popular ? 'ring-2 ring-teal-200' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                          </div>
                          {plan.popular && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                          <p className="text-xs text-gray-500">{plan.period}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Start free trial'}
                </button>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow disabled:opacity-50"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                      <g>
                        <path
                          d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.1 5.1 29.3 3 24 3c-7.2 0-13.4 3.8-17 9.7z"
                          fill="#FF3D00"
                        />
                        <path
                          d="M24 45c5.6 0 10.7-1.9 14.7-5.1l-6.8-5.6C29.7 36.1 27 37 24 37c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.9 41.2 15.4 45 24 45z"
                          fill="#4CAF50"
                        />
                        <path
                          d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.4 41.2 19.4 45 24 45c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2S44.6 20.7 44.5 20z"
                          fill="#1976D2"
                        />
                      </g>
                    </svg>
                    {loading ? 'Signing up...' : 'Sign up with Google'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
