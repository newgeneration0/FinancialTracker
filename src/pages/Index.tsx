import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { FinancialProvider } from '../contexts/FinancialContext';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/dashboard/Dashboard';
import { Toaster } from '../components/ui/toaster';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import ForgetPassword from './ForgetPassword';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // console.log('loading=', isLoading, 'authenticated=', isAuthenticated);
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <CurrencyProvider>
                <FinancialProvider>
                  <Dashboard />
                </FinancialProvider>
              </CurrencyProvider>
            ) : (
              <LoginForm />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
