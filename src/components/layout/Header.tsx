import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken, getUserRole } from '../../utils/auth';
import Button from '../common/Button';

interface HeaderProps {
  onAddPost?: () => void;
  showAddButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddPost, showAddButton = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {showAddButton && (
              <Button variant="primary" onClick={onAddPost}>
                Add New Post
              </Button>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;