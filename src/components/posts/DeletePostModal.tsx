import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../../api/post';
import { Post } from '../../types';
import Modal from '../common/modals';
import Button from '../common/Button';
import MessageModal from '../common/messagemodal';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ isOpen, onClose, post }) => {
  const queryClient = useQueryClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setModalMessage('Post deleted successfully');
      setShowSuccessModal(true);

      // Invalidate ALL related queries
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['totalPostsCount'] });

      // Refetch to ensure data is up to date
      queryClient.refetchQueries({ queryKey: ['myPosts'] });

      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 1000);
    },
    onError: (error: any) => {
      setModalMessage(error.response?.data?.message || 'Failed to delete post');
      setShowErrorModal(true);
    },
  });

  const handleDelete = () => {
    if (post) {
      deletePostMutation.mutate(post.id);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Post Title" size="sm">
        <div className="text-center">
          <p className="text-lg mb-6">
            Are you sure you want to delete this post?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
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

export default DeletePostModal;