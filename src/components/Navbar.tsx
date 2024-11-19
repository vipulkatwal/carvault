import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Car, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import appLogo from '../assets/carVault-logo.png';


export default function Navbar() {
  const { isSignedIn, isDemo, logoutDemo } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
              <img src={appLogo} alt="CarManager Logo" className="h-10" />
          </Link>

          {isSignedIn && (
            <div className="flex items-center space-x-4">
              {isDemo ? (
                <button
                  onClick={logoutDemo}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Exit Demo
                </button>
              ) : (
                <UserButton
                  afterSignOutUrl="/sign-in"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-lg"
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}