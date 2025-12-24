import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { viewPost } from '../../api/post';
import Button from '../common/Button';

const ViewPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => viewPost(Number(id)),
    enabled: !!id,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-red-500">Failed to load post</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="primary" onClick={() => navigate('/home')}>
            Back
          </Button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            logout
          </button>
        </div>

        <h1 className="text-3xl font-semibold text-center mb-12">View Post</h1>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">{post.title}</h2>
          <div className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {post.body}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;