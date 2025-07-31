import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  Zap,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { NotificationManager, AppNotification } from '../utils/notificationManager';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = NotificationManager.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(NotificationManager.getUnreadCount());
  };

  const handleMarkAsRead = (notificationId: string) => {
    NotificationManager.markAsRead(notificationId);
    loadNotifications();
  };

  const handleDeleteNotification = (notificationId: string) => {
    NotificationManager.deleteNotification(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationManager.markAllAsRead();
    loadNotifications();
  };

  const handleNotificationAction = (notification: AppNotification) => {
    if (notification.action) {
      navigate(notification.action.url);
      if (!notification.read) {
        handleMarkAsRead(notification.id);
      }
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'trial':
        return <Clock className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'trial':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>

                              {notification.action && (
                                <button
                                  onClick={() => handleNotificationAction(notification)}
                                  className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center"
                                >
                                  {notification.action.label}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Delete notification"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <Link
                to="/notifications"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
