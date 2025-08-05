import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Tag,
  MapPin,
  Building,
  TrendingUp,
  Grid,
  List,
  Download,
} from 'lucide-react';
import { useLeads } from '../contexts/LeadsContext';
import { useAuth } from '../contexts/AuthContext';

export default function Leads() {
  const { filteredLeads } = useLeads();
  const { user, loading: userLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    dealSize: '',
    status: '',
  });

  const exportLeads = () => {
    const csvContent = [
      [
        'Name',
        'Company',
        'Industry',
        'Region',
        'Deal Size',
        'Status',
        'Email',
        'Phone',
        'LinkedIn',
      ],
      ...filteredLeads.map((lead) => [
        lead.contactName,
        lead.companyName,
        lead.industry,
        lead.region,
        lead.dealSize,
        lead.status,
        lead.email,
        lead.phone || '',
        lead.linkedinUrl || '',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advitravels-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Show loading spinner if user or leads are loading
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Restrict access for expired users
  if (user?.membershipStatus === 'expired') {
    return (
      <div className="max-w-xl mx-auto mt-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your membership has expired</h2>
        <p className="text-gray-600 mb-4">
          To continue accessing premium leads, please upgrade your membership.
        </p>
        <a
          href="/pricing"
          className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      industry: '',
      region: '',
      dealSize: '',
      status: '',
    });
    setSearchTerm('');
    // clearFilters(); // This line was removed from the new_code, so it's removed here.
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDealSizeColor = (dealSize: string) => {
    const colors = {
      small: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      large: 'bg-green-100 text-green-800',
    };
    return colors[dealSize as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const industries = ['SaaS', 'FinTech', 'E-commerce', 'CleanTech', 'HealthTech', 'EdTech'];
  const regions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Middle East',
    'Africa',
  ];
  const dealSizes = ['small', 'medium', 'large'];
  const statuses = ['new', 'contacted', 'qualified', 'closed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Leads</h1>
        <p className="text-gray-600">Discover high-quality leads across industries and regions</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies, contacts, industries, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={filters.dealSize}
            onChange={(e) => handleFilterChange('dealSize', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Deal Sizes</option>
            {dealSizes.map((size) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)} Deal
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredLeads.length} leads found</span>
            {(searchTerm || Object.values(filters).some((f) => f)) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportLeads}
              className="flex items-center px-3 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Leads Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 p-6 group hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.companyName}</h3>
                  <p className="text-gray-600 mb-2">{lead.contactName}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Building className="h-4 w-4 mr-1" />
                    {lead.industry}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {lead.region}
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lead.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDealSizeColor(
                    lead.dealSize,
                  )}`}
                >
                  {lead.dealSize} deal
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    lead.status,
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              {lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {lead.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {lead.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{lead.tags.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <a
                    href={`mailto:${lead.email}`}
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Send email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Call"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                  {lead.linkedinUrl && (
                    <a
                      href={lead.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="LinkedIn"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Size
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
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.companyName}</div>
                        <div className="text-sm text-gray-500">
                          {lead.description.slice(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.contactName}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDealSizeColor(
                          lead.dealSize,
                        )}`}
                      >
                        {lead.dealSize}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          lead.status,
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                        {lead.linkedinUrl && (
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or clearing the filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
