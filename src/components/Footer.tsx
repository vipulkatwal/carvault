import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoWhite.png';


export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="CarManager Logo" className="h-10" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personal car inventory management solution. List, manage, and track your vehicles with ease.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-blue-400 transition-colors duration-300">My Cars</Link>
              </li>
              <li>
                <Link to="/cars/new" className="hover:text-blue-400 transition-colors duration-300">Add New Car</Link>
              </li>
            </ul>
          </div>

          <div className="mt-4 md:mt-0">
            <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div className="mt-4 md:mt-0">
            <h3 className="text-white font-semibold text-lg mb-6">Connect</h3>
            <div className="flex space-x-5">
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}