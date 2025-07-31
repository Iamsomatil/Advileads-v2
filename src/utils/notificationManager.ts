import { User } from '../types';
import { TrialManager } from './trialManager';

export interface AppNotification {
  id: string;
  type: 'trial' | 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  dismissible: boolean;
  createdAt: Date;
  read: boolean;
}

export class NotificationManager {
  private static STORAGE_KEY = 'advileads_notifications';

  /**
   * Get all notifications for a user
   */
  static getNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const notifications = JSON.parse(stored);
      return notifications.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  /**
   * Add a new notification
   */
  static addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): void {
    try {
      const notifications = this.getNotifications();
      const newNotification: AppNotification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date(),
        read: false,
      };
      
      notifications.unshift(newNotification);
      
      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  /**
   * Mark notification as read
   */
  static markAsRead(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead(): void {
    try {
      const notifications = this.getNotifications();
      const updated = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  /**
   * Delete a notification
   */
  static deleteNotification(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const updated = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  /**
   * Get unread notifications count
   */
  static getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Check and create trial notifications
   */
  static checkTrialNotifications(user: User): void {
    if (!user) return;

    const trialStatus = TrialManager.calculateTrialStatus(user);
    
    // Check if we should send a trial notification
    if (TrialManager.shouldSendTrialNotification(user)) {
      const message = TrialManager.getTrialNotificationMessage(trialStatus.daysLeft);
      
      this.addNotification({
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
  }

  /**
   * Create welcome notification for new users
   */
  static createWelcomeNotification(user: User): void {
    this.addNotification({
      type: 'success',
      title: 'Welcome to Advileads!',
      message: `Hi ${user.name}, welcome to your 14-day free trial. Start exploring our premium leads and community features.`,
      action: {
        label: 'Get Started',
        url: '/leads',
      },
      dismissible: true,
    });
  }

  /**
   * Create trial expiration warning
   */
  static createTrialExpirationWarning(user: User, daysLeft: number): void {
    const messages = {
      12: 'Your trial expires in 2 days. Upgrade now to continue accessing premium leads!',
      13: 'Your trial expires tomorrow! Don\'t lose access to your leads.',
      14: 'Your trial has expired. Upgrade now to restore access to all features.',
    };

    this.addNotification({
      type: 'warning',
      title: 'Trial Expiring Soon',
      message: messages[daysLeft as keyof typeof messages] || `Your trial expires in ${daysLeft} days.`,
      action: {
        label: 'Upgrade Now',
        url: '/pricing',
      },
      dismissible: false,
    });
  }

  /**
   * Create forum activity notification
   */
  static createForumNotification(type: 'mention' | 'reply' | 'reaction', content: string): void {
    const titles = {
      mention: 'You were mentioned',
      reply: 'New reply to your post',
      reaction: 'New reaction to your post',
    };

    this.addNotification({
      type: 'info',
      title: titles[type],
      message: content,
      action: {
        label: 'View',
        url: '/forum',
      },
      dismissible: true,
    });
  }

  /**
   * Clear all notifications
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 