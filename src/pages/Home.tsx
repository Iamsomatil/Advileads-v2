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
      title: 'High-Quality Trip Requests',
      description: 'From luxury cruises to family adventures, travelers submit detailed itineraries every day, giving agents real opportunities to serve clients who are eager to book.'
    },
    {
      icon: TrendingUp,
      title: 'Find Clients Who Match Your Expertise',
      description: 'Filter requests by destination, budget, style, or trip type so you\'re always connecting with the right travelers for your specialties.'
    },
    {
      icon: MessageCircle,
      title: 'Learn, Share, and Grow Together',
      description: 'Join a thriving network of travel advisors who exchange insights, strategies, and success stories to help one another thrive.'
    },
    {
      icon: Shield,
      title: 'Every Request Verified',
      description: 'No wasted time, no guesswork. Every trip request is screened for authenticity, so you\'re only connecting with genuine travelers.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Lopez',
      role: 'Luxury Travel Advisor, Miami',
      content: 'Advitravel has completely reshaped how I connect with clients. Within my first month, I booked triple the number of trips, from honeymoons to group getaways.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Aisha Patel',
      role: 'Family Travel Consultant, Chicago',
      content: 'What I value most is the combination of verified leads and the supportive community. I\'ve grown my bookings and sharpened my expertise by learning from other advisors.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Jammie Carter',
      role: 'Cruise Specialist, New York',
      content: 'The verified requests are a game changer. I no longer chase cold leads — instead, I work with travelers who are serious about planning their dream vacations.',
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
              Where Travelers Discover
              <span className="block bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                Their Perfect Travel Advisor
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Every great journey starts with the right guide. Travelers use Advitravel to find trusted advisors who understand their needs, while agents gain access to verified trip requests and clients ready to book.
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
              Turn Travel Dreams Into
              <span className="text-teal-600"> Booked Journeys</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advitravel connects passionate travelers with expert advisors, while giving agents the tools and community to grow their business with confidence.
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
              Trusted by Travelers. Loved by Agents.
            </h2>
            <p className="text-xl text-gray-600">
              Our members aren't just booking trips — they're building lasting client relationships and transforming their businesses.
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Change the Way You Travel — and the Way You Connect?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Travelers CTA */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Next Adventure</h3>
              <p className="text-gray-600 mb-6">
                Tell us where you want to go and the kind of experience you're dreaming of. We'll match you with the perfect travel advisor to bring it to life.
              </p>
              <div className="space-y-4 mb-6">
                {['Destination', 'Travel Dates', 'Travel Style', 'Budget'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ))}
              </div>
              <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all">
                Find My Travel Agent
              </button>
            </div>
            
            {/* Agents CTA */}
            <div className="bg-teal-700 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-2xl font-bold mb-4">Grow Your Travel Business</h3>
              <p className="mb-6 text-teal-100">
                Join today and gain instant access to verified traveler requests and a supportive network of peers. Start your 14-day free trial and connect with clients who are ready to book now.
              </p>
              <button className="w-full bg-white text-teal-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all mb-3">
                Start Free 14-Day Trial
              </button>
              <p className="text-sm text-teal-200">$19.99/month after trial. Cancel anytime with no risk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}