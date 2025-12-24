import React from 'react';
import { motion } from 'framer-motion';
import { Post } from '../../types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  onViewPost: (postId: number) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  canEdit?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost,
  canEdit = true,
}) => {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500 text-lg">No posts found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <PostCard
            post={post}
            onView={() => onViewPost(post.id)}
            onEdit={() => onEditPost(post)}
            onDelete={() => onDeletePost(post)}
            canEdit={canEdit}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostList;