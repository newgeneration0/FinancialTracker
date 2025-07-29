
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Menu,
  X,
  BarChart3,
  Target,
  Lightbulb,
  Users,
  Home,
  Moon,
  Sun,
  Receipt
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentCurrency } = useCurrency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home, route: '/' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/analytics' },
    { id: 'recurringTransactions', label: 'Recurring', icon: Receipt },
    // { id: 'goals', label: 'Goals', icon: Target, route: '/goals' },
    { id: 'insights', label: 'Insights', icon: Lightbulb, route: '/insights' },
    // { id: 'social', label: 'Social', icon: Users, route: '/socials' },
    { id: 'profile', label: 'Profile', icon: User, route: '/profile'},
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WW</span>
            </div>
            <h2 className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-gray-100">
              {/* FinanceTracker */}
              WealthWise
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {/* //hidden md:flex */}
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  // onClick={() => setActiveTab(tab.id)}
                  onClick={() => {
                    setActiveTab(tab.id)
                    // navigate(tab.route)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      // ? 'bg-indigo-100 text-indigo-700' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      // : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className=''>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side - Notifications, Logout and Profile */}
          <div className="flex items-center space-x-2">
             {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex h-6 w-6 p-0"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

              {/* Currency Display */}
            <div className="hidden lg:flex items-center space-x- text-sm text-gray-600 dark:text-gray-300">
              <span>{currentCurrency.code}</span>
            </div>

            {/* Direct Logout Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="hidden lg:flex items-center space-x- text-red-600 border-red-200 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <img
                    className="h-8 w-8 rounded-full"
                    // src={user?.avatar}
                    alt={user?.firstName}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              
              {/* Currency Display */}
              <div className="w-full flex items-center space-x- px-4 py-2  text-sm text-gray-600 dark:text-gray-300">
                <span>{currentCurrency.code}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="w-full flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 mt-4"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
