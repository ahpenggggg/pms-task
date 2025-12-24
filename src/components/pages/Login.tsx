import React from 'react';
import LoginForm from '../auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-8">Login Page</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;