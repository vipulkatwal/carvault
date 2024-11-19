import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  password: 'demo123' // Demo password for reference only
};

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  const loginWithDemo = () => {
    localStorage.setItem('demoUser', JSON.stringify(DEMO_USER));
    localStorage.setItem('isDemo', 'true');
    navigate('/');
  };

  const logoutDemo = () => {
    localStorage.removeItem('demoUser');
    localStorage.removeItem('isDemo');
    navigate('/sign-in');
  };

  const isDemo = localStorage.getItem('isDemo') === 'true';
  const currentUser = isDemo ? DEMO_USER : user;

  return {
    user: currentUser,
    isSignedIn: isDemo || isSignedIn,
    isLoaded,
    loginWithDemo,
    logoutDemo,
    isDemo
  };
}