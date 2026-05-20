import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-border bg-card px-4 py-3 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Smart Leads</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden text-sm font-medium text-foreground sm:inline-block">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-destructive hover:text-destructive/80"
              >
                <LogOut size={18} className="mr-1" />
                <span className="hidden sm:inline-block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
