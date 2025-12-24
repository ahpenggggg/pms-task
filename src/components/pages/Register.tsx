import React from 'react';
import RegisterForm from '../auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-8">Register User</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;