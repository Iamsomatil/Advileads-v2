import { Notification } from '../types';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

// Table names
const USERS_TABLE = 'Users';
const LEADS_TABLE = 'Leads';
const FORUM_POSTS_TABLE = 'ForumPosts';
const FORUM_REPLIES_TABLE = 'ForumReplies';
const NOTIFICATIONS_TABLE = 'Notifications';

// Base URLs
const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;
const USERS_URL = `${AIRTABLE_BASE_URL}/${USERS_TABLE}`;
const LEADS_URL = `${AIRTABLE_BASE_URL}/${LEADS_TABLE}`;
const FORUM_POSTS_URL = `${AIRTABLE_BASE_URL}/${FORUM_POSTS_TABLE}`;
const FORUM_REPLIES_URL = `${AIRTABLE_BASE_URL}/${FORUM_REPLIES_TABLE}`;
const NOTIFICATIONS_URL = `${AIRTABLE_BASE_URL}/${NOTIFICATIONS_TABLE}`;

// Common headers for Airtable API requests
const getHeaders = () => ({
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
});

// Airtable record type
interface AirtableRecord<T> {
  id: string;
  createdTime?: string;
  fields: T;
}

// Notification types
interface NotificationFields {
  userId: string;
  type: 'mention' | 'reply' | 'reaction';
  content: string;
  referenceId: string;
  read: boolean;
  createdAt: string;
}

type NotificationRecord = AirtableRecord<NotificationFields>;

// Forum post and reply types
interface ForumPostFields {
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  upvotes: number;
  tags: string[];
  mentions?: string[];
}

interface ForumReplyFields {
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  upvotes: number;
  mentions?: string[];
}

type ForumPostRecord = AirtableRecord<ForumPostFields>;
type ForumReplyRecord = AirtableRecord<ForumReplyFields>;

// Lead fields type
export interface LeadFields {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  region: string;
  dealSize: 'small' | 'medium' | 'large';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  description: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  tags: string[];
}

// Lead record type
export interface Lead {
  id: string;
  fields: LeadFields;
}

// User functions
export async function getUserByEmail(email: string) {
  const sanitizedEmail = encodeURIComponent(email);
  const res = await fetch(
    `${USERS_URL}?filterByFormula={email}='${sanitizedEmail}'`,
    { headers: getHeaders() }
  );
  
  if (!res.ok) throw new Error('Failed to fetch user');
  
  const data = await res.json();
  return data.records?.[0] || null;
}

export async function createUser(user: {
  uid: string;
  email: string;
  name: string;
  membershipStatus: string;
  trialStartDate: string;
}) {
  const res = await fetch(USERS_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fields: user }),
  });
  
  if (!res.ok) throw new Error('Failed to create user');
  
  return res.json();
}

// Alias for updateUser to maintain backward compatibility
export const updateUserProfile = updateUser;

export async function updateUser(recordId: string, fields: Record<string, any>) {
  const res = await fetch(`${USERS_URL}/${recordId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to update user');
  
  return res.json();
}

export async function getAllUsers() {
  const res = await fetch(USERS_URL, { headers: getHeaders() });
  
  if (!res.ok) throw new Error('Failed to fetch users');
  
  const data = await res.json();
  return data.records || [];
}

// Lead functions
export async function getLeads(
  filters: {
    industry?: string;
    region?: string;
    dealSize?: string;
  } = {}
): Promise<Lead[]> {
  const filterFormula = [];
  
  if (filters.industry) {
    filterFormula.push(`{industry}='${encodeURIComponent(filters.industry)}'`);
  }
  if (filters.region) {
    filterFormula.push(`{region}='${encodeURIComponent(filters.region)}'`);
  }
  if (filters.dealSize) {
    filterFormula.push(`{dealSize}='${encodeURIComponent(filters.dealSize)}'`);
  }
  
  const filterStr = filterFormula.length 
    ? `?filterByFormula=AND(${filterFormula.join(',')})` 
    : '';
    
  const res = await fetch(`${LEADS_URL}${filterStr}`, {
    headers: getHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch leads');
  
  const data = await res.json();
  return data.records || [];
}

export async function createLead(fields: Record<string, any>) {
  const res = await fetch(LEADS_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to create lead');
  
  return res.json();
}

export async function updateLead(recordId: string, fields: Record<string, any>) {
  const res = await fetch(`${LEADS_URL}/${recordId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to update lead');
  
  return res.json();
}

export async function deleteLead(recordId: string) {
  const res = await fetch(`${LEADS_URL}/${recordId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to delete lead');
  
  return res.json();
}

// Forum post functions
export async function getForumPosts(): Promise<ForumPostRecord[]> {
  const res = await fetch(FORUM_POSTS_URL, { headers: getHeaders() });
  
  if (!res.ok) throw new Error('Failed to fetch forum posts');
  
  const data = await res.json();
  return data.records || [];
}

export async function createForumPost(fields: ForumPostFields): Promise<ForumPostRecord> {
  const res = await fetch(FORUM_POSTS_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to create forum post');
  
  return res.json();
}

export async function updateForumPost(
  id: string,
  fields: Partial<ForumPostFields>
): Promise<ForumPostRecord> {
  const res = await fetch(`${FORUM_POSTS_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to update forum post');
  
  return res.json();
}

export async function deleteForumPost(recordId: string) {
  const res = await fetch(`${FORUM_POSTS_URL}/${recordId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to delete forum post');
  
  return res.json();
}

// Reply functions
export async function getForumReplies(postId: string): Promise<ForumReplyRecord[]> {
  const sanitizedPostId = encodeURIComponent(postId);
  const res = await fetch(
    `${FORUM_REPLIES_URL}?filterByFormula={postId}='${sanitizedPostId}'`,
    { headers: getHeaders() }
  );
  
  if (!res.ok) throw new Error('Failed to fetch forum replies');
  
  const data = await res.json();
  return data.records || [];
}

export async function createForumReply(fields: ForumReplyFields): Promise<ForumReplyRecord> {
  const res = await fetch(FORUM_REPLIES_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to create forum reply');
  
  return res.json();
}

export async function updateForumReply(
  id: string,
  fields: Partial<ForumReplyFields>
): Promise<ForumReplyRecord> {
  const res = await fetch(`${FORUM_REPLIES_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  });
  
  if (!res.ok) throw new Error('Failed to update forum reply');
  
  return res.json();
}

export async function deleteForumReply(recordId: string) {
  const res = await fetch(`${FORUM_REPLIES_URL}/${recordId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to delete forum reply');
  
  return res.json();
}

// Notification functions
export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<Notification> {
  const response = await fetch(NOTIFICATIONS_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      fields: {
        userId: notification.userId,
        type: notification.type,
        content: notification.content,
        referenceId: notification.referenceId,
        read: notification.read,
        createdAt: new Date().toISOString(),
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create notification');
  }
  
  const data = await response.json();
  return {
    id: data.id,
    ...data.fields,
    createdAt: new Date(data.fields.createdAt),
  };
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const sanitizedUserId = encodeURIComponent(userId);
  const response = await fetch(
    `${NOTIFICATIONS_URL}?filterByFormula={userId}='${sanitizedUserId}'&sort[0][field]=createdAt&sort[0][direction]=desc`,
    { headers: getHeaders() }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  
  const data = await response.json();
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
    createdAt: new Date(record.fields.createdAt),
  }));
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({
      fields: { read: true },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
}

// Export types
export type {
  ForumPostFields,
  ForumReplyFields,
  ForumPostRecord,
  ForumReplyRecord,
  NotificationFields,
  NotificationRecord,
};