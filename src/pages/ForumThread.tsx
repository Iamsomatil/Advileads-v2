import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowUp,
  Calendar,
  User,
  MessageSquare,
  Tag,
  Send
} from 'lucide-react';
import { useForum } from '../contexts/ForumContext';
import { useAuth } from '../contexts/AuthContext';

export default function ForumThread() {
  const { threadId } = useParams<{ threadId: string }>();
  const { getPost, addReply, upvotePost, upvoteReply, loading } = useForum();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Add loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Show error if present
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-teal-600 hover:text-teal-700 font-medium">Reload</button>
        </div>
      </div>
    );
  }

  const post = threadId ? getPost(threadId) : null;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Post not found</h3>
          <Link to="/forum" className="text-teal-600 hover:text-teal-700 mt-2 inline-block">
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    addReply(post.id, {
      authorId: user.id,
      authorName: user.name,
      content: replyContent.trim()
    });

    setReplyContent('');
  };

  const handleUpvotePost = () => {
    if (!user) return;
    upvotePost(post.id, user.id);
  };

  const handleUpvoteReply = (replyId: string) => {
    if (!user) return;
    upvoteReply(post.id, replyId, user.id);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Announcements': 'bg-purple-100 text-purple-800',
      'Deal Talk': 'bg-green-100 text-green-800',
      'Introductions': 'bg-blue-100 text-blue-800',
      'Collaboration': 'bg-orange-100 text-orange-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/forum"
        className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </Link>

      {/* Main Post */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.tags.map((tag, index) => (
                <span key={index} className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4 font-medium">{post.authorName}</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{getTimeAgo(post.createdAt)}</span>
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.replies.length} replies</span>
            </div>
          </div>
          
          <button
            onClick={handleUpvotePost}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              post.hasUpvoted 
                ? 'bg-teal-100 text-teal-700' 
                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <ArrowUp className="h-6 w-6" />
            <span className="text-sm font-medium mt-1">{post.upvotes}</span>
          </button>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-6 mb-8">
        {post.replies.map((reply) => (
          <div key={reply.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="font-medium text-gray-900 mr-3">{reply.authorName}</span>
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-500">{getTimeAgo(reply.createdAt)}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
              
              <button
                onClick={() => handleUpvoteReply(reply.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ml-4 ${
                  reply.hasUpvoted 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs font-medium mt-1">{reply.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {user && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Reply</h3>
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}