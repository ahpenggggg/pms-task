import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editPost } from '../../api/post';
import { Post } from '../../types';
import { TAGS_LIST } from '../../utils/constant';
import Modal from '../common/modals';
import Button from '../common/Button';
import MessageModal from '../common/messagemodal';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

type PostFormData = z.infer<typeof postSchema>;

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, post }) => {
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        body: post.body,
        tags: post.tags,
      });
      setSelectedTags(post.tags);
    }
  }, [post, reset]);

  const editPostMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: PostFormData }) =>
      editPost(postId, data),
    onSuccess: () => {
      setModalMessage('Post updated successfully');
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      setTimeout(() => {
        setShowSuccessModal(false);
        handleClose();
      }, 1000);
    },
    onError: (error: any) => {
      setModalMessage(error.response?.data?.message || 'Failed to update post');
      setShowErrorModal(true);
    },
  });

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    setValue('tags', newTags, { shouldValidate: true });
  };

  const onSubmit = (data: PostFormData) => {
    if (post) {
      editPostMutation.mutate({ postId: post.id, data });
    }
  };

  const handleClose = () => {
    reset();
    setSelectedTags([]);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Edit Post" size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Enter post title"
              className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                errors.title ? 'border-red-500' : 'border-yellow-400'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              {...register('body')}
              placeholder="Enter post content"
              rows={6}
              className={`w-full px-4 py-2 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none ${
                errors.body ? 'border-red-500' : 'border-yellow-400'
              }`}
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="border-2 border-yellow-400 rounded-2xl p-3 max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedTags.join(', ')}
              </div>
            )}
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          <div className="flex gap-3 justify-center mt-6">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={editPostMutation.isPending}
            >
              {editPostMutation.isPending ? 'Updating...' : 'Edit'}
            </Button>
          </div>
        </form>
      </Modal>

      <MessageModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type="success"
      />

      <MessageModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={modalMessage}
        type="error"
      />
    </>
  );
};

export default EditPostModal;