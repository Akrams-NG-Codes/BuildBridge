import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Home, FolderKanban, Upload, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Layout() {
  const { user, logout, theme } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ 
      '--color-primary': theme.primary,
      '--color-secondary': theme.secondary 
    } as React.CSSProperties}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl text-gray-900">BuildBridge</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/projects" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FolderKanban size={20} />
                <span>Projects</span>
              </Link>
              {(user?.role === 'developer_admin' || user?.role === 'developer_staff') && (
                <Link to="/upload" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Upload size={20} />
                  <span>Upload</span>
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              <Link to="/" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/projects" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
              <Link to="/upload" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Upload</Link>
              <Link to="/profile" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="block py-2 text-red-600 w-full text-left">Logout</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
