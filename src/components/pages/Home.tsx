import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../utils/auth';
import { Post } from '../../types';
import { getAllPosts, getMyPosts } from '../../api/post';
import { POSTS_PER_PAGE } from '../../utils/constant';
import { getAllAccounts } from '../../api/auth';
import Layout from '../layout/Layout';
import StatsCard from '../layout/StatCard';
import PostList from '../posts/PostList';
import Pagination from '../common/paginator';
import AddPostModal from '../posts/AddPostModal';
import EditPostModal from '../posts/EditPostModal';
import DeletePostModal from '../posts/DeletePostModal';

type TabType = 'my-posts' | 'all-posts';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';

  const [activeTab, setActiveTab] = useState<TabType>('my-posts');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Fetch MY posts
  const { data: myPostsData, isLoading: myPostsLoading, error: myPostsError } = useQuery({
    queryKey: ['myPosts', currentPage],
    queryFn: () => getMyPosts(currentPage, POSTS_PER_PAGE),
    enabled: activeTab === 'my-posts',
  });

  // Fetch ALL posts - for admin
  const { data: allPostsData, isLoading: allPostsLoading, error: allPostsError } = useQuery({
    queryKey: ['allPosts', currentPage],
    queryFn: () => getAllPosts(currentPage, POSTS_PER_PAGE),
    enabled: isAdmin && activeTab === 'all-posts',
  });

  // Fetch ALL accounts - for admin stats
  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
    enabled: isAdmin,
  });

  // Fetch total posts count for stats
  const { data: totalPostsCount } = useQuery({
    queryKey: ['totalPostsCount'],
    queryFn: () => getAllPosts(1, 1000), // Get all to count
    enabled: isAdmin,
  });

  const handleViewPost = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 when switching tabs
  };

  // Determine which data to display
  const currentData = activeTab === 'my-posts' ? myPostsData : allPostsData;
  const isLoading = activeTab === 'my-posts' ? myPostsLoading : allPostsLoading;
  const error = activeTab === 'my-posts' ? myPostsError : allPostsError;
  const totalPages = currentData?.totalPages || 1;

  // Check if current user owns the post (for edit/delete permissions)
  const canEditPost = (post: Post): boolean => {
    if (activeTab === 'all-posts') {
      return false; // No edit/delete on "All Posts" view
    }
    return true; // Can edit on "My Posts" view
  };

  return (
    <Layout onAddPost={() => setShowAddModal(true)} showAddButton>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">Post List</h1>

        {/* Admin Stats */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Account"
              value={
                accountsData?.totalAccounts || 
                accountsData?.total || 
                accountsData?.data?.length || 
                accountsData?.accounts?.length || 
                0
              }
              color="yellow"
            />
            <StatsCard
              title="Total Post"
              value={totalPostsCount?.totalPosts || 0}
              color="red"
            />
            <StatsCard
              title="My Post"
              value={myPostsData?.totalPosts || 0}
              color="green"
            />
          </div>
        )}

        {/* Tabs - Only for Admin */}
        {isAdmin && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => handleTabChange('my-posts')}
              className={`px-8 py-3 rounded-full font-medium transition-colors ${
                activeTab === 'my-posts'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => handleTabChange('all-posts')}
              className={`px-8 py-3 rounded-full font-medium transition-colors ${
                activeTab === 'all-posts'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Posts
            </button>
          </div>
        )}

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading posts: {(error as any)?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <PostList
              posts={currentData?.data || []}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              canEdit={activeTab === 'my-posts'}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AddPostModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={selectedPost}
      />
      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        post={selectedPost}
      />
    </Layout>
  );
};

export default Home;