import { User } from '../types';

export interface TrialStatus {
  daysLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  shouldShowWarning: boolean;
  trialEndDate: Date;
}

export class TrialManager {
  private static TRIAL_DURATION_DAYS = 14;
  private static WARNING_DAYS = [12, 13, 14]; // Days to show warnings

  /**
   * Calculate trial status for a user
   */
  static calculateTrialStatus(user: User): TrialStatus {
    if (!user.trialStartDate || user.membershipStatus !== 'trial') {
      return {
        daysLeft: 0,
        isExpired: true,
        isExpiringSoon: false,
        shouldShowWarning: false,
        trialEndDate: new Date(),
      };
    }

    const startDate = new Date(user.trialStartDate);
    const currentDate = new Date();
    const trialEndDate = new Date(startDate.getTime() + (this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));
    
    const diffTime = trialEndDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(diffTime / (24 * 60 * 60 * 1000));
    
    const isExpired = daysLeft <= 0;
    const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
    const shouldShowWarning = this.WARNING_DAYS.includes(daysLeft);

    return {
      daysLeft: Math.max(0, daysLeft),
      isExpired,
      isExpiringSoon,
      shouldShowWarning,
      trialEndDate,
    };
  }

  /**
   * Check if user should receive trial expiration notification
   */
  static shouldSendTrialNotification(user: User): boolean {
    if (user.membershipStatus !== 'trial') return false;
    
    const status = this.calculateTrialStatus(user);
    if (!status.shouldShowWarning) return false;

    // Check if we've already sent a notification today
    const lastNotification = user.lastTrialNotification;
    if (lastNotification) {
      const today = new Date();
      const lastNotificationDate = new Date(lastNotification);
      if (today.toDateString() === lastNotificationDate.toDateString()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get trial notification message based on days left
   */
  static getTrialNotificationMessage(daysLeft: number): string {
    switch (daysLeft) {
      case 14:
        return "Welcome to Advileads! Your 14-day free trial has started.";
      case 12:
        return "Your trial expires in 2 days. Upgrade now to continue accessing premium leads!";
      case 13:
        return "Your trial expires tomorrow! Don't lose access to your leads.";
      case 14:
        return "Your trial has expired. Upgrade now to restore access to all features.";
      default:
        return `Your trial expires in ${daysLeft} days. Upgrade now to continue!`;
    }
  }

  /**
   * Check if user should be restricted due to trial expiration
   */
  static shouldRestrictAccess(user: User): boolean {
    if (user.membershipStatus === 'active') return false;
    if (user.membershipStatus === 'expired') return true;
    
    const status = this.calculateTrialStatus(user);
    return status.isExpired;
  }

  /**
   * Get trial progress percentage
   */
  static getTrialProgress(user: User): number {
    if (!user.trialStartDate || user.membershipStatus !== 'trial') return 0;
    
    const startDate = new Date(user.trialStartDate);
    const currentDate = new Date();
    const elapsed = currentDate.getTime() - startDate.getTime();
    const total = this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  /**
   * Format trial end date for display
   */
  static formatTrialEndDate(user: User): string {
    if (!user.trialStartDate) return 'N/A';
    
    const status = this.calculateTrialStatus(user);
    return status.trialEndDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get trial status color for UI
   */
  static getTrialStatusColor(daysLeft: number): string {
    if (daysLeft <= 0) return 'text-red-600';
    if (daysLeft <= 3) return 'text-amber-600';
    if (daysLeft <= 7) return 'text-orange-600';
    return 'text-green-600';
  }

  /**
   * Get trial status badge for UI
   */
  static getTrialStatusBadge(daysLeft: number): { label: string; color: string } {
    if (daysLeft <= 0) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    if (daysLeft <= 3) {
      return { label: 'Expiring Soon', color: 'bg-amber-100 text-amber-800' };
    }
    if (daysLeft <= 7) {
      return { label: 'Active Trial', color: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'Active Trial', color: 'bg-green-100 text-green-800' };
  }
} 