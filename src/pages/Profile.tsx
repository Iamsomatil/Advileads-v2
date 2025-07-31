import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Building,
  Briefcase,
  ExternalLink,
  Edit3,
  Save,
  X,
  Crown,
  Calendar,
  Shield,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TrialManager } from '../utils/trialManager';
import AvatarUploadModal from '../components/AvatarUploadModal';

export default function Profile() {
  const { userId } = useParams();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    industry: user?.industry || '',
    jobTitle: user?.jobTitle || '',
    region: user?.region || '',
    linkedinUrl: user?.linkedinUrl || '',
  });
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, we'll show the current user's profile
  // In a real app, you'd fetch user data based on userId
  const profileUser = user;

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Profile not found</h3>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      industry: user?.industry || '',
      jobTitle: user?.jobTitle || '',
      region: user?.region || '',
      linkedinUrl: user?.linkedinUrl || '',
    });
    setIsEditing(false);
  };

  const getMembershipInfo = () => {
    if (!profileUser.membershipStatus) return null;

    const statusInfo = {
      trial: {
        label: 'Free Trial',
        color: 'bg-amber-100 text-amber-800',
        description: 'Exploring Advileads',
      },
      active: {
        label: 'Pro Member',
        color: 'bg-teal-100 text-teal-800',
        description: 'Full access to all features',
      },
      expired: {
        label: 'Expired',
        color: 'bg-red-100 text-red-800',
        description: 'Membership has expired',
      },
    };

    return statusInfo[profileUser.membershipStatus];
  };

  const membershipInfo = getMembershipInfo();

  const getTrialDaysLeft = () => {
    if (!profileUser.trialStartDate || profileUser.membershipStatus !== 'trial') return 0;
    const trialStatus = TrialManager.calculateTrialStatus(profileUser);
    return trialStatus.daysLeft;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>

        {/* Profile Info */}
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              {/* Avatar */}
              <div className="relative -mt-16 mr-6">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {profileUser.avatar ? (
                    <img
                      src={profileUser.avatar}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  {userId === profileUser.id || !userId ? (
                    <button
                      onClick={() => setShowAvatarUpload(true)}
                      className="absolute bottom-0 right-0 bg-teal-600 text-white p-1 rounded-full hover:bg-teal-700 transition-colors"
                      title="Change avatar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Basic Info */}
              <div className="pt-2">
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">{profileUser.name}</h1>
                  {membershipInfo && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${membershipInfo.color}`}
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      {membershipInfo.label}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-gray-600">
                  {profileUser.jobTitle && (
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {profileUser.jobTitle}
                      {profileUser.industry && ` at ${profileUser.industry}`}
                    </div>
                  )}
                  {profileUser.region && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profileUser.region}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileUser.email}
                    {profileUser.emailVerified ? (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {userId === profileUser.id || !userId ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Details</h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={profileData.industry}
                      onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., SaaS, FinTech"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Sales Director"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={profileData.region}
                    onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Region</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Africa">Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileData.linkedinUrl}
                    onChange={(e) =>
                      setProfileData({ ...profileData, linkedinUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Industry</h3>
                    <p className="text-gray-900">{profileUser.industry || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Job Title</h3>
                    <p className="text-gray-900">{profileUser.jobTitle || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Region</h3>
                    <p className="text-gray-900">{profileUser.region || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h3>
                    {profileUser.linkedinUrl ? (
                      <a
                        href={profileUser.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 flex items-center"
                      >
                        View Profile
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    ) : (
                      <p className="text-gray-900">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Membership Info */}
        <div className="space-y-6">
          {/* Membership Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership</h3>

            {membershipInfo && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${membershipInfo.color}`}
                  >
                    {membershipInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900">{profileUser.subscriptionType || 'Trial'}</span>
                </div>

                {profileUser.membershipStatus === 'trial' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Left</span>
                    <span className="text-amber-600 font-medium">{getTrialDaysLeft()} days</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{membershipInfo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 text-sm">{profileUser.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900 text-sm">
                  {profileUser.trialStartDate
                    ? new Date(profileUser.trialStartDate).toLocaleDateString()
                    : 'Recently'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Role</span>
                <span className="text-gray-900 text-sm capitalize">{profileUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditing && saving && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <span className="text-gray-700">Saving changes...</span>
          </div>
        </div>
      )}

      <AvatarUploadModal isOpen={showAvatarUpload} onClose={() => setShowAvatarUpload(false)} />
    </div>
  );
}
