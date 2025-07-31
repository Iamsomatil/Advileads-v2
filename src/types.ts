// User type
export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  membershipStatus: 'trial' | 'active' | 'expired';
  trialStartDate?: Date;
  trialEndDate?: Date;
  subscriptionType?: string;
  airtableId?: string;
  // Additional profile fields
  industry?: string;
  jobTitle?: string;
  region?: string;
  linkedinUrl?: string;
  // Trial management fields
  trialDaysLeft?: number;
  lastTrialNotification?: Date;
  emailVerified?: boolean;
  // Notification preferences
  emailNotifications?: boolean;
  trialReminders?: boolean;
}

// Forum types
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  upvotes: number;
  replies: ForumReply[];
  tags: string[];
  hasUpvoted?: boolean;
  mentions?: string[];
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  hasUpvoted?: boolean;
  mentions?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'reply' | 'reaction';
  content: string;
  referenceId: string;
  read: boolean;
  createdAt: Date;
}

// Airtable record types
export interface AirtableRecord<T> {
  id: string;
  createdTime?: string;
  fields: T;
}

export interface ForumPostFields {
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  upvotes: number;
  tags: string[];
  mentions?: string[];
}

export interface ForumReplyFields {
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  mentions?: string[];
}

export interface NotificationFields {
  userId: string;
  type: 'mention' | 'reply' | 'reaction';
  content: string;
  referenceId: string;
  read: boolean;
  createdAt: Date;
}

// Context types
export interface ForumContextType {
  posts: ForumPost[];
  filteredPosts: ForumPost[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies' | 'mentions'>) => Promise<ForumPost>;
  addReply: (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'upvotes' | 'mentions'>) => Promise<ForumReply>;
  upvotePost: (postId: string, userId: string) => Promise<void>;
  upvoteReply: (postId: string, replyId: string, userId: string) => Promise<void>;
  filterPosts: (category?: string, search?: string) => void;
  getPost: (id: string) => ForumPost | undefined;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  getUnreadNotificationsCount: () => number;
}

// Auth context type
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}
