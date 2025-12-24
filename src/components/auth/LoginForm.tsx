import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { setToken } from '../../utils/auth';
import Button from '../common/Button';
import MessageModal from '../common/messagemodal';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      setModalMessage(data.message);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/home');
      }, 1000);
    },
    onError: (error: any) => {
      setModalMessage(error.response?.data?.message || 'Invalid credentials');
      setShowErrorModal(true);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.email ? 'border-red-500' : 'border-yellow-400'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="Enter your password"
            className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.password ? 'border-red-500' : 'border-yellow-400'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loginMutation.isPending}
          className="w-full mt-2"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-yellow-500 hover:text-yellow-600 font-medium"
          >
            Create an account
          </button>
        </div>
      </form>

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

export default LoginForm;