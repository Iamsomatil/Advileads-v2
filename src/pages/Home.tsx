import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Shield, 
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Premium Lead Database',
      description: 'Access thousands of qualified leads across industries with detailed contact information and company insights.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Filtering',
      description: 'Filter leads by industry, region, deal size, and status to find your perfect prospects.'
    },
    {
      icon: MessageCircle,
      title: 'Exclusive Community',
      description: 'Connect with fellow sales professionals, share insights, and collaborate on deals.'
    },
    {
      icon: Shield,
      title: 'Verified Contacts',
      description: 'All leads are verified and regularly updated to ensure accuracy and deliverability.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Sales Director at TechFlow',
      content: 'Advileads transformed our lead generation process. We closed 3x more deals in the first quarter.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Mike Chen',
      role: 'Founder at GreenStart',
      content: 'The community aspect is incredible. I\'ve made valuable connections that led to partnerships.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Amanda Rodriguez',
      role: 'VP Sales at RetailInno',
      content: 'Best investment we made this year. ROI was positive within the first month.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-teal-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-6">
              <Clock className="w-4 h-4 mr-2" />
              14-day free trial • No credit card required
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Generate More
              <span className="block bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                Quality Leads
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of sales professionals who trust Advileads for premium lead generation, 
              expert insights, and an exclusive community that drives results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-teal-300 hover:text-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to
              <span className="text-teal-600"> close more deals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge lead generation with community insights to supercharge your sales process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-teal-200 transition-all hover:shadow-xl group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by sales teams worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our members are saying about their success with Advileads
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-teal-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Zap className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your sales process?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of sales professionals who are already closing more deals with Advileads.
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