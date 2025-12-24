import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/auth';
import { setToken } from '../../utils/auth';
import Button from '../common/Button';
import MessageModal from '../common/messagemodal';

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required').refine(
    (val) => val === 'user' || val === 'admin',
    { message: 'Invalid role selected' }
  ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
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
      setModalMessage(error.response?.data?.message || 'Registration failed');
      setShowErrorModal(true);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data as any);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register('username')}
            placeholder="Enter your username"
            className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.username ? 'border-red-500' : 'border-yellow-400'
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            {...register('role')}
            className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.role ? 'border-red-500' : 'border-yellow-400'
            }`}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={registerMutation.isPending}
          className="w-full mt-2"
        >
          {registerMutation.isPending ? 'Registering...' : 'Register'}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-yellow-500 hover:text-yellow-600 font-medium"
          >
            Back to Login Page
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

export default RegisterForm;