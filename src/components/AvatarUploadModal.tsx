import React, { useState, useRef } from 'react';
import { X, Upload, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarUploadModal({ isOpen, onClose }: AvatarUploadModalProps) {
  const { user, updateProfile } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // In a real app, you would upload to a cloud service like Firebase Storage
      // For now, we'll create a data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        // Update user profile with new avatar
        await updateProfile({ avatar: dataUrl });
        
        setUploading(false);
        onClose();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Update Profile Picture</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-teal-400 bg-teal-50'
                : 'border-gray-300 hover:border-teal-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? 'Drop your image here' : 'Upload a new profile picture'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              PNG, JPG, or GIF up to 5MB
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            {uploading && (
              <div className="px-4 py-2 text-teal-600 font-medium">
                Uploading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 