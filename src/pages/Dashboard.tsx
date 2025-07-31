import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, TrendingUp, ArrowRight, Star, Calendar, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLeads } from '../contexts/LeadsContext';
import { useForum } from '../contexts/ForumContext';
import TrialStatusBanner from '../components/TrialStatusBanner';

export default function Dashboard() {
  const { user } = useAuth();
  const { leads } = useLeads();
  const { posts } = useForum();

  // const getTrialDaysLeft = () => {
  //   if (!user?.trialStartDate || user.membershipStatus !== 'trial') return 0;
  //   const startDate = new Date(user.trialStartDate);
  //   const currentDate = new Date();
  //   const diffTime = 14 * 24 * 60 * 60 * 1000 - (currentDate.getTime() - startDate.getTime());
  //   const diffDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000));
  //   return Math.max(0, diffDays);
  // };

  // const trialDaysLeft = getTrialDaysLeft();

  const stats = [
    {
      title: 'Available Leads',
      value: leads.length.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/leads',
    },
    {
      title: 'Forum Posts',
      value: posts.length.toLocaleString(),
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      link: '/forum',
    },
    {
      title: 'New This Week',
      value: '47',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      link: '/leads',
    },
    {
      title: 'Active Members',
      value: '2,847',
      icon: Star,
      color: 'from-orange-500 to-orange-600',
      link: '/forum',
    },
  ];

  const recentLeads = leads.slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          Here's what's happening with your leads and community today.
        </p>
      </div>

      {/* Trial Status Banner */}
      <TrialStatusBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
            <Link
              to="/leads"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{lead.companyName}</h3>
                  <p className="text-sm text-gray-600">
                    {lead.contactName} • {lead.industry}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        lead.dealSize === 'large'
                          ? 'bg-green-100 text-green-800'
                          : lead.dealSize === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {lead.dealSize} deal
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{lead.region}</span>
                  </div>
                </div>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Forum Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Forum Activity</h2>
            <Link
              to="/forum"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/forum/${post.id}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {post.authorName}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          post.category === 'Announcements'
                            ? 'bg-purple-100 text-purple-800'
                            : post.category === 'Deal Talk'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="ml-2">{post.replies.length} replies</span>
                      <span className="ml-2">{post.upvotes} upvotes</span>
                    </div>
                  </div>
                  <Calendar className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
