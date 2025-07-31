import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Settings as SettingsIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Crown,
  Shield,
} from 'lucide-react';
import { useLeads } from '../contexts/LeadsContext';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, updateUser } from '../api/airtable';

export default function AdminPanel() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    region: '',
    dealSize: 'medium' as 'small' | 'medium' | 'large',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'closed',
    description: '',
    linkedinUrl: '',
    websiteUrl: '',
    tags: '',
  });
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Fetch users for User Management tab
  useEffect(() => {
    if (activeTab === 'users') {
      setUsersLoading(true);
      setUsersError(null);
      getAllUsers()
        .then(setUsers)
        .catch(() => setUsersError('Failed to load users.'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  const handleUpdateUser = async (id: string, fields: Record<string, any>) => {
    await updateUser(id, fields);
    // Refresh users
    setUsersLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsersError('Failed to load users.'))
      .finally(() => setUsersLoading(false));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = newLead.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    addLead({
      ...newLead,
      tags,
    });

    setNewLead({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industry: '',
      region: '',
      dealSize: 'medium',
      status: 'new',
      description: '',
      linkedinUrl: '',
      websiteUrl: '',
      tags: '',
    });
    setShowAddLead(false);
  };

  const stats = [
    {
      title: 'Total Leads',
      value: leads.length.toLocaleString(),
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Active Users',
      value: '2,847',
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+8%',
    },
    {
      title: 'Forum Posts',
      value: '1,234',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      change: '+23%',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      icon: Crown,
      color: 'from-orange-500 to-orange-600',
      change: '+0.5%',
    },
  ];

  const industries = ['SaaS', 'FinTech', 'E-commerce', 'CleanTech', 'HealthTech', 'EdTech'];
  const regions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Middle East',
    'Africa',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage leads, users, and platform settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'leads', label: 'Leads Management', icon: Users },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">5 new leads added today</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">12 users upgraded to pro</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">8 new forum posts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                    >
                      Add new lead
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                    >
                      Manage users
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                    >
                      Platform settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Leads Management</h3>
                <button
                  onClick={() => setShowAddLead(true)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </button>
              </div>

              {showAddLead && (
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Lead</h4>
                  <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newLead.companyName}
                      onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={newLead.contactName}
                      onChange={(e) => setNewLead({ ...newLead, contactName: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <select
                      value={newLead.industry}
                      onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newLead.region}
                      onChange={(e) => setNewLead({ ...newLead, region: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newLead.dealSize}
                      onChange={(e) => setNewLead({ ...newLead, dealSize: e.target.value as any })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="small">Small Deal</option>
                      <option value="medium">Medium Deal</option>
                      <option value="large">Large Deal</option>
                    </select>
                    <select
                      value={newLead.status}
                      onChange={(e) => setNewLead({ ...newLead, status: e.target.value as any })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={newLead.linkedinUrl}
                      onChange={(e) => setNewLead({ ...newLead, linkedinUrl: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="url"
                      placeholder="Website URL"
                      value={newLead.websiteUrl}
                      onChange={(e) => setNewLead({ ...newLead, websiteUrl: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={newLead.description}
                      onChange={(e) => setNewLead({ ...newLead, description: e.target.value })}
                      className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={newLead.tags}
                      onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })}
                      className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="md:col-span-2 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddLead(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700"
                      >
                        Add Lead
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.contactName}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : lead.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : lead.status === 'qualified'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-teal-600 hover:text-teal-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <p className="text-gray-600 mb-6">
                Manage user accounts, subscriptions, and permissions.
              </p>
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : usersError ? (
                <div className="text-center py-12 text-red-600">{usersError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{u.fields.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{u.fields.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                u.fields.membershipStatus === 'active'
                                  ? 'bg-teal-100 text-teal-800'
                                  : u.fields.membershipStatus === 'trial'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {u.fields.membershipStatus || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">
                              {u.fields.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleUpdateUser(u.id, { membershipStatus: 'active' })
                                }
                                className="text-teal-600 hover:text-teal-900"
                                disabled={u.fields.membershipStatus === 'active'}
                              >
                                Activate
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateUser(u.id, { membershipStatus: 'trial' })
                                }
                                className="text-amber-600 hover:text-amber-900"
                                disabled={u.fields.membershipStatus === 'trial'}
                              >
                                Set Trial
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateUser(u.id, { membershipStatus: 'expired' })
                                }
                                className="text-red-600 hover:text-red-900"
                                disabled={u.fields.membershipStatus === 'expired'}
                              >
                                Expire
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateUser(u.id, {
                                    role: u.fields.role === 'admin' ? 'user' : 'admin',
                                  })
                                }
                                className="text-gray-600 hover:text-gray-900"
                              >
                                {u.fields.role === 'admin' ? 'Demote' : 'Promote'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
              <p className="text-gray-600 mb-6">
                Configure platform-wide settings and preferences.
              </p>

              <div className="bg-gray-50 p-8 rounded-xl text-center">
                <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h4>
                <p className="text-gray-600">
                  Platform settings would include email configurations, payment settings, forum
                  moderation tools, and other administrative controls.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
