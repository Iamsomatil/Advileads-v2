import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TrialManager } from '../utils/trialManager';

export default function TrialStatusBanner() {
  const { user } = useAuth();

  if (!user || user.membershipStatus !== 'trial') {
    return null;
  }

  const trialStatus = TrialManager.calculateTrialStatus(user);
  const progress = TrialManager.getTrialProgress(user);
  const badge = TrialManager.getTrialStatusBadge(trialStatus.daysLeft);

  if (trialStatus.isExpired) {
    return (
      <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Your trial has expired</h3>
              <p className="text-red-700">
                Upgrade now to continue accessing premium leads and community features.
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center"
          >
            Upgrade Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (trialStatus.isExpiringSoon) {
    return (
      <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-amber-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900">
                {trialStatus.daysLeft} {trialStatus.daysLeft === 1 ? 'day' : 'days'} left in your
                free trial
              </h3>
              <p className="text-amber-700">
                Upgrade now to continue accessing premium leads and community features.
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center"
          >
            Upgrade Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Crown className="h-8 w-8 text-teal-600 mr-4" />
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-teal-900 mr-3">Free Trial Active</h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-teal-700 mb-3">
              {trialStatus.daysLeft} days remaining • Trial ends{' '}
              {TrialManager.formatTrialEndDate(user)}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-teal-100 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-teal-600">{Math.round(progress)}% of trial used</p>
          </div>
        </div>
        <Link
          to="/pricing"
          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center"
        >
          Upgrade Now
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
