import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  User,
  Tag,
  TrendingUp,
  MessageCircle,
  PlusCircle,
  Calendar,
  ArrowUp,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useForum } from '../contexts/ForumContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function Forum() {
  const { filteredPosts, filterPosts, addPost, editPost, deletePost, loading } = useForum();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Discussions', icon: <MessageCircle className="w-4 h-4 mr-2" /> },
    { id: 'introductions', name: 'Introductions', icon: <User className="w-4 h-4 mr-2" /> },
    { id: 'deals', name: 'Deal Talk', icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    { id: 'collaboration', name: 'Collaboration', icon: <PlusCircle className="w-4 h-4 mr-2" /> },
    { id: 'general', name: 'General', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { id: 'announcements', name: 'Announcements', icon: <Tag className="w-4 h-4 mr-2" /> },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterPosts(selectedCategory === 'all' ? undefined : selectedCategory, term);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterPosts(categoryId === 'all' ? undefined : categoryId, searchTerm);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/forum/${postId}`);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tags = newPost.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    addPost({
      authorId: user.id,
      authorName: user.name || 'Unknown User',
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags,
    });

    setNewPost({
      title: '',
      content: '',
      category: 'General',
      tags: '',
    });
    setShowNewPostForm(false);
  };

  const handleEditPost = (post: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    setEditingPostId(post.id);
    setEditingPost({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPostId) return;

    const tags = editingPost.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      await editPost(editingPostId, {
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        tags,
      });
      setEditingPostId(null);
      setEditingPost({
        title: '',
        content: '',
        category: 'General',
        tags: '',
      });
    } catch {
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePost(postId);
    } catch {
      setError('Failed to delete post');
    }
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Announcements: 'bg-purple-100 text-purple-800',
      'Deal Talk': 'bg-green-100 text-green-800',
      Introductions: 'bg-blue-100 text-blue-800',
      Collaboration: 'bg-orange-100 text-orange-800',
      General: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="text-gray-600">Loading forum posts...</p>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-teal-600" />
                Categories
              </h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
                  Filters
                </h2>
                <div className="space-y-2">
                  <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Most Recent
                  </button>
                  <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Most Popular
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
                <button
                  onClick={() => (user ? setShowNewPostForm(true) : navigate('/login'))}
                  className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  New Post
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* New Post Form */}
              {showNewPostForm && (
                <div className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Post</h2>
                  <form onSubmit={handleSubmitPost}>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Content
                      </label>
                      <textarea
                        id="content"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        >
                          <option value="General">General</option>
                          <option value="Introductions">Introductions</option>
                          <option value="Deal Talk">Deal Talk</option>
                          <option value="Collaboration">Collaboration</option>
                          <option value="Announcements">Announcements</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="tags"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          id="tags"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={newPost.tags}
                          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={() => setShowNewPostForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Discussions Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedCategory === 'all'
                    ? 'All Discussions'
                    : categories.find((c) => c.id === selectedCategory)?.name || 'Discussions'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{filteredPosts.length} discussions</span>
                </div>
              </div>

              {/* Edit Post Form */}
              {editingPostId && (
                <div className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Post</h2>
                  <form onSubmit={handleSaveEdit}>
                    <div className="mb-4">
                      <label
                        htmlFor="edit-title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="edit-title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="edit-content"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Content
                      </label>
                      <textarea
                        id="edit-content"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={editingPost.content}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, content: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="edit-category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category
                        </label>
                        <select
                          id="edit-category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={editingPost.category}
                          onChange={(e) =>
                            setEditingPost({ ...editingPost, category: e.target.value })
                          }
                        >
                          <option value="General">General</option>
                          <option value="Introductions">Introductions</option>
                          <option value="Deal Talk">Deal Talk</option>
                          <option value="Collaboration">Collaboration</option>
                          <option value="Announcements">Announcements</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="edit-tags"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          id="edit-tags"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={editingPost.tags}
                          onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={() => setEditingPostId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        Update Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Discussions List */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="relative flex items-start p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              post.category,
                            )}`}
                          >
                            {post.category}
                          </span>
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-teal-600">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <span className="mr-4">{post.authorName}</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="mr-4">{getTimeAgo(new Date(post.createdAt))}</span>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.replies?.length || 0} replies</span>
                          </div>

                          {/* Action buttons for post author or admin */}
                          {(user?.id === post.authorId || user?.role === 'admin') && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPost(post);
                                }}
                                className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                                title="Edit post"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePost(post.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center ml-6">
                        <div className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600">
                          <ArrowUp className="h-4 w-4" />
                          <span>{post.upvotes}</span>
                        </div>
                        <TrendingUp className="h-5 w-5 text-gray-400 mt-2" />
                      </div>

                      {/* Clickable overlay for viewing post */}
                      <div
                        className="absolute inset-0 cursor-pointer z-10"
                        onClick={() => handlePostClick(post.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-500">
                    Be the first to start a discussion in this category!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
