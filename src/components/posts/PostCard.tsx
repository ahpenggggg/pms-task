import React from 'react';
import { motion } from 'framer-motion';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onView, onEdit, onDelete, canEdit = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-gray-400 text-sm mb-2">
        {post.date || 'No date'}
      </div>
      <h3 className="text-lg font-semibold mb-3">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.body}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.slice(0, 3).map((tag, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
          >
            {tag}
          </motion.span>
        ))}
      </div>
      <div className="flex gap-2">
        {canEdit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm transition-colors"
          >
            Edit
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onView}
          className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm transition-colors"
        >
          View
        </motion.button>
        {canEdit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm transition-colors"
          >
            Delete
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;