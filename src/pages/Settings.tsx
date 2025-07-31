import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Mail,
  Eye,
  EyeOff,
  Save,
  X,
  Crown,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TrialManager } from '../utils/trialManager';
import { NotificationManager } from '../utils/notificationManager';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    trialReminders: user?.trialReminders ?? true,
    forumNotifications: true,
    leadUpdates: true,
  });

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    industry: user?.industry || '',
    jobTitle: user?.jobTitle || '',
    region: user?.region || '',
    linkedinUrl: user?.linkedinUrl || '',
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Please log in to access settings</h3>
        </div>
      </div>
    );
  }

  const trialStatus = TrialManager.calculateTrialStatus(user);
  const progress = TrialManager.getTrialProgress(user);

  const handleSaveNotifications = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        emailNotifications: notificationSettings.emailNotifications,
        trialReminders: notificationSettings.trialReminders,
      });
      setSuccess('Notification settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile(profileSettings);
      setSuccess('Profile settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const clearAllNotifications = () => {
    NotificationManager.clearAll();
    setSuccess('All notifications cleared!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'trial', label: 'Trial Status', icon: Crown },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
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
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Trial Reminders</h4>
                    <p className="text-sm text-gray-600">Get notified about trial expiration</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.trialReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        trialReminders: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Forum Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified about forum activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.forumNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        forumNotifications: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Lead Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about new leads</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.leadUpdates}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        leadUpdates: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={clearAllNotifications}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all notifications
                  </button>
                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={profileSettings.industry}
                      onChange={(e) => setProfileSettings({ ...profileSettings, industry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., SaaS, FinTech"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={profileSettings.jobTitle}
                      onChange={(e) => setProfileSettings({ ...profileSettings, jobTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Sales Director"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={profileSettings.region}
                    onChange={(e) => setProfileSettings({ ...profileSettings, region: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={profileSettings.linkedinUrl}
                    onChange={(e) => setProfileSettings({ ...profileSettings, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trial Tab */}
          {activeTab === 'trial' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Trial Status</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Crown className="h-6 w-6 text-teal-600 mr-3" />
                      <h4 className="text-lg font-medium text-gray-900">Free Trial</h4>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      trialStatus.isExpired ? 'bg-red-100 text-red-800' :
                      trialStatus.isExpiringSoon ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {trialStatus.isExpired ? 'Expired' :
                       trialStatus.isExpiringSoon ? 'Expiring Soon' :
                       'Active'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className="font-medium">{trialStatus.daysLeft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trial Ends:</span>
                      <span className="font-medium">{TrialManager.formatTrialEndDate(user)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {trialStatus.isExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">Your trial has expired</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">
                      Upgrade now to continue accessing premium leads and community features.
                    </p>
                  </div>
                )}

                {trialStatus.isExpiringSoon && !trialStatus.isExpired && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-amber-700 font-medium">Trial expiring soon</span>
                    </div>
                    <p className="text-amber-600 text-sm mt-1">
                      Your trial will expire in {trialStatus.daysLeft} days. Upgrade now to continue.
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <Link
                    to="/pricing"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Verification</h4>
                      <p className="text-sm text-gray-600">
                        {user.emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700 font-medium">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Change your account password</p>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700 font-medium">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Account Deletion</h4>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 