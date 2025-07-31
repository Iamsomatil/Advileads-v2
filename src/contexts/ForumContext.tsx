import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getForumPosts,
  createForumPost,
  updateForumPost,
  getForumReplies,
  createForumReply,
  updateForumReply,
  createNotification,
  ForumPostRecord,
  ForumReplyRecord,
} from '../api/airtable';
import { useAuth } from './AuthContext';
import { User, ForumPost, ForumReply, Notification } from '../types';

interface ForumContextType {
  posts: ForumPost[];
  filteredPosts: ForumPost[];
  notifications: Notification[];
  addPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies' | 'hasUpvoted' | 'mentions'>) => Promise<void>;
  addReply: (
    postId: string,
    reply: Omit<ForumReply, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'mentions'>,
  ) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  upvoteReply: (postId: string, replyId: string) => Promise<void>;
  editPost: (postId: string, updates: Partial<Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies'>>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  editReply: (postId: string, replyId: string, content: string) => Promise<void>;
  deleteReply: (postId: string, replyId: string) => Promise<void>;
  filterPosts: (category?: string, search?: string) => void;
  getPost: (id: string) => ForumPost | undefined;
  loading: boolean;
  error: string | null;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  getUnreadNotificationsCount: () => number;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

// Helper function to extract mentions from content
const extractMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
};

export function useForum() {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
}

export const ForumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  
  // Helper function to map airtable posts
  const mapAirtablePost = (record: ForumPostRecord, replies: ForumReply[]): ForumPost => {
    const f = record.fields;
    return {
      id: record.id,
      authorId: f.authorId || '',
      authorName: f.authorName || '',
      title: f.title || '',
      content: f.content || '',
      category: f.category || 'General',
      createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
      upvotes: f.upvotes || 0,
      tags: Array.isArray(f.tags) ? f.tags : [],
      replies,
      hasUpvoted: false,
    };
  };

  // Helper function to map airtable replies
  const mapAirtableReply = (record: ForumReplyRecord): ForumReply => {
    const f = record.fields;
    return {
      id: record.id,
      authorId: f.authorId || '',
      authorName: f.authorName || '',
      content: f.content || '',
      createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
      upvotes: f.upvotes || 0,
      hasUpvoted: false,
    };
  };

  // Helper function to create notifications
  const createMentionNotifications = useCallback(async (
    content: string, 
    referenceId: string, 
    type: 'post' | 'reply', 
    currentUser: User | null
  ) => {
    if (!currentUser) return;
    
    const mentions = extractMentions(content);
    if (mentions.length === 0) return;

    try {
      const notificationPromises = mentions
        .filter(username => username !== currentUser.id)
        .map(async (username) => {
          try {
            await createNotification({
              userId: username,
              type: 'mention',
              content: `${currentUser.name || 'Someone'} mentioned you in a ${type}`,
              referenceId,
              read: false,
            });
          } catch (err) {
            console.error('Failed to create mention notification', err);
          }
        });
      
      await Promise.all(notificationPromises);
    } catch (err) {
      console.error('Error in createMentionNotifications:', err);
    }
  }, []);

  // Fetch posts and their replies from Airtable
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const postRecords = await getForumPosts();
      const postsWithReplies: ForumPost[] = await Promise.all(
        postRecords.map(async (post) => {
          try {
            const replyRecords = await getForumReplies(post.id);
            const replies = replyRecords.map(mapAirtableReply);
            return mapAirtablePost(post, replies);
          } catch (replyError) {
            console.error('Error fetching replies for post:', post.id, replyError);
            return mapAirtablePost(post, []);
          }
        }),
      );
      
      setPosts(postsWithReplies);
      setFilteredPosts(postsWithReplies);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      setError('Failed to load forum posts. Please try again later.');
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback(async (post: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies' | 'hasUpvoted' | 'mentions'>) => {
    try {
      setLoading(true);
      const mentions = extractMentions(post.content);
      const now = new Date();
      
      const postData = {
        ...post,
        upvotes: 0,
        mentions,
        createdAt: now.toISOString(),
      };
      
      const newPost = await createForumPost(postData);
      
      const mappedPost: ForumPost = {
        id: newPost.id,
        authorId: post.authorId,
        authorName: post.authorName,
        title: post.title,
        content: post.content,
        category: post.category,
        createdAt: now,
        upvotes: 0,
        tags: post.tags || [],
        replies: [],
        hasUpvoted: false,
        mentions,
      };
      
      setPosts((prevPosts) => [mappedPost, ...prevPosts]);
      
      if (mentions.length > 0 && currentUser) {
        await createMentionNotifications(post.content, newPost.id, 'post', currentUser);
      }
    } catch (err) {
      setError('Failed to create post');
      console.error('Failed to create post', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser, createMentionNotifications]);

  const addReply = useCallback(
    async (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'mentions'>) => {
      try {
        setLoading(true);
        const mentions = extractMentions(reply.content);
        const now = new Date();
        
        const replyData: Omit<ForumReplyFields, 'id'> = {
          ...reply,
          postId,
          upvotes: 0,
          mentions,
          createdAt: new Date().toISOString(),
        };
        
        const newReply = await createForumReply(replyData);
        
        const mappedReply: ForumReply = {
          id: newReply.id,
          authorId: newReply.fields.authorId,
          authorName: newReply.fields.authorName,
          content: newReply.fields.content,
          createdAt: new Date(newReply.fields.createdAt || new Date()),
          upvotes: newReply.fields.upvotes || 0,
          hasUpvoted: false,
          mentions: newReply.fields.mentions || [],
        };
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { 
                  ...post, 
                  replies: [...post.replies, mappedReply] 
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              }
              : post
          )
        );
        
        if (mentions.length > 0 && currentUser) {
          await createMentionNotifications(reply.content, postId, 'reply', currentUser);
        }
        
        const post = posts.find(p => p.id === postId);
        if (post && currentUser && post.authorId !== currentUser.id) {
          try {
            await createNotification({
              userId: post.authorId,
              type: 'reply',
              content: `${reply.authorName} replied to your post`,
              referenceId: postId,
              read: false,
            });
          } catch (err) {
            console.error('Failed to create reply notification', err);
          }
        }
      } catch (err) {
        setError('Failed to add reply');
        console.error('Failed to add reply', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, posts, createMentionNotifications]
  );

  const upvotePost = useCallback(
    async (postId: string) => {
      try {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        const hasUpvoted = post.hasUpvoted;
        const newUpvotes = hasUpvoted ? post.upvotes - 1 : post.upvotes + 1;
        
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  upvotes: newUpvotes,
                  hasUpvoted: !hasUpvoted,
                }
              : p
          )
        );
        
        await updateForumPost(postId, {
          upvotes: newUpvotes,
        });
        
        if (!hasUpvoted && currentUser && post.authorId !== currentUser.id) {
          try {
            await createNotification({
              userId: post.authorId,
              type: 'reaction',
              content: `${currentUser.name || 'Someone'} upvoted your post`,
              referenceId: postId,
              read: false,
            });
          } catch (err) {
            console.error('Failed to create upvote notification', err);
          }
        }
      } catch (err) {
        setError('Failed to upvote post');
        console.error('Failed to upvote post', err);
        setPosts(posts);
        throw err;
      }
    },
    [posts, currentUser]
  );

  const upvoteReply = useCallback(
    async (postId: string, replyId: string) => {
      try {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        const reply = post.replies.find(r => r.id === replyId);
        if (!reply) return;
        
        const hasUpvoted = reply.hasUpvoted;
        const newUpvotes = hasUpvoted ? reply.upvotes - 1 : reply.upvotes + 1;
        
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  replies: p.replies.map((r) =>
                    r.id === replyId
                      ? {
                          ...r,
                          upvotes: newUpvotes,
                          hasUpvoted: !hasUpvoted,
                        }
                      : r
                  ),
                }
              : p
          )
        );
        
        await updateForumReply(replyId, {
          upvotes: newUpvotes,
        });
        
        if (!hasUpvoted && currentUser && reply.authorId !== currentUser.id) {
          try {
            await createNotification({
              userId: reply.authorId,
              type: 'reaction',
              content: `${currentUser.name || 'Someone'} upvoted your reply`,
              referenceId: replyId,
              read: false,
            });
          } catch (err) {
            console.error('Failed to create upvote notification', err);
          }
        }
      } catch (err) {
        setError('Failed to upvote reply');
        console.error('Failed to upvote reply', err);
        setPosts(posts);
        throw err;
      }
    },
    [posts, currentUser]
  );

  const filterPosts = (category?: string, search?: string) => {
    let filtered = [...posts];
    if (category && category !== 'all') {
      filtered = filtered.filter((post) => post.category === category);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }
    setFilteredPosts(filtered);
  };

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }, []);

  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const editPost = useCallback(async (postId: string, updates: Partial<ForumPostFields>) => {
    try {
      const { createdAt, ...safeUpdates } = updates;
      
      setPosts(prev => 
        prev.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                ...safeUpdates,
                createdAt: updates.createdAt ? new Date(updates.createdAt) : p.createdAt
              }
            : p
        )
      );
      
      await updateForumPost(postId, safeUpdates);
    } catch (err) {
      console.error('Failed to edit post', err);
      throw err;
    }
  }, [posts]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      setPosts(prev => prev.filter(p => p.id !== postId));
      setFilteredPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post', err);
      throw err;
    }
  }, []);

  const editReply = useCallback(async (postId: string, replyId: string, content: string) => {
    try {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? {
                ...post,
                replies: post.replies.map(reply => 
                  reply.id === replyId 
                    ? { ...reply, content }
                    : reply
                )
              }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to edit reply', err);
      throw err;
    }
  }, []);

  const deleteReply = useCallback(async (postId: string, replyId: string) => {
    try {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? {
                ...post,
                replies: post.replies.filter(reply => reply.id !== replyId)
              }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to delete reply', err);
      throw err;
    }
  }, []);

  const value = {
    posts,
    filteredPosts,
    notifications,
    loading,
    error,
    addPost,
    addReply,
    upvotePost,
    upvoteReply,
    editPost,
    deletePost,
    editReply,
    deleteReply,
    filterPosts,
    getPost,
    markNotificationAsRead,
    getUnreadNotificationsCount,
  };

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}