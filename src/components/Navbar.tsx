import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation, Briefcase, BookOpen, FileText, LineChart } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Career Roadmap', icon: Navigation },
    { path: '/jobs', label: 'Job Search', icon: Briefcase },
    { path: '/learn', label: 'Learning Hub', icon: BookOpen },
    { path: '/resume', label: 'Resume Analyzer', icon: FileText },
    { path: '/insights', label: 'Career Insights', icon: LineChart },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;