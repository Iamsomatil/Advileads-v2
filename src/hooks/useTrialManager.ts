import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrialManager } from '../utils/trialManager';
import { NotificationManager } from '../utils/notificationManager';

export function useTrialManager() {
  const { user } = useAuth();

  const checkTrialStatus = useCallback(() => {
    if (!user) return;

    const trialStatus = TrialManager.calculateTrialStatus(user);
    
    // Check if trial has expired and update user status
    if (trialStatus.isExpired && user.membershipStatus !== 'expired') {
      // In a real app, you would update the user status in the database
      console.log('Trial expired for user:', user.id);
    }

    // Check for trial notifications
    if (TrialManager.shouldSendTrialNotification(user)) {
      const message = TrialManager.getTrialNotificationMessage(trialStatus.daysLeft);
      
      NotificationManager.addNotification({
        type: 'trial',
        title: 'Trial Update',
        message,
        action: {
          label: 'Upgrade Now',
          url: '/pricing',
        },
        dismissible: true,
      });
    }
  }, [user]);

  // Check trial status on mount and every hour
  useEffect(() => {
    if (!user) return;

    // Check immediately
    checkTrialStatus();

    // Set up interval to check every hour
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, checkTrialStatus]);

  // Check trial status when user changes
  useEffect(() => {
    if (user) {
      checkTrialStatus();
    }
  }, [user?.id, checkTrialStatus]);

  return {
    trialStatus: user ? TrialManager.calculateTrialStatus(user) : null,
    shouldRestrictAccess: user ? TrialManager.shouldRestrictAccess(user) : false,
    trialProgress: user ? TrialManager.getTrialProgress(user) : 0,
    formatTrialEndDate: user ? () => TrialManager.formatTrialEndDate(user) : () => '',
  };
} 