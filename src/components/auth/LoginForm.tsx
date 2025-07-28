
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from '../../hooks/use-toast';
import { Eye, EyeOff, Wallet, Sun, Moon, } from 'lucide-react';
import { supabase } from './SupabaseClient.js'
import { useNavigate } from 'react-router-dom';
import googleLogo from '/public/google_logo.svg';
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const { isDarkMode, toggleTheme } = useTheme();

  const { login, register, handleGoogleAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if(isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = isLogin
      ? await login(email, password)
      : await register(firstName, lastName, email, password)
      // : await register(displayName, email, password);

    if (success) {
      toast({
        title: `${isLogin ? 'Login' : 'Signup'} successful`,
        description: 'Redirecting...',
      });
    } else {
      toast({
        title: 'Authentication failed',
        description: 'Please check your crendentials',
        variant: 'destructive'
      });
    }

    // if (!success) {
    //   setError("Too many attempts. Please wait a few seconds and try again.");
    //   toast({
    //     title: 'Rate limited',
    //     description: 'Please wait a few seconds before trying again.',
    //     variant: 'destructive',
    //   });
    //   setIsLoading(false);
    //   return;
    // }


    setIsLoading(false)
  }

  // const handleGoogleAuth = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: window.location.origin,
  //     },
  //   })
  //   if (error) {
  //     console.error('Google login error:', error.message);
  //     alert("google sign in failed")
  //   }
  // }

  return (
    <div 
    // className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    className='min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700'>       
            <div className='fle items-cente justif-en'>
              {/* Theme Toggle */}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hidden sm:flex h-8 w-8 p-0 text-black"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button> */}
            </div>
      <div className="w-full max-w-md space-y-8">
        <div className='flex items-center justify-end'>
             {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex h-8 w-8 p-0 text-black dark:text-gray-100"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
        </div>
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-50 bg-clip-text text-transparent">
            {/* FinanceTracker */}
            WealthWise
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {/* Take control of your financial future */}
            Protect your finances. Stay on track.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-gray-100">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-center text-gray-900 dark:text-gray-400">
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Enter your details to create a new account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter Your Name"
                    value={firstName}
                    // onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    className="h-11"
                  />
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter Your Surname"
                    value={lastName}
                    // onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    className="h-11"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email ID"
                  value={email}
                  // onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    // onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-gray-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}

                 {/* {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )} */}
              </Button>
            </form>
            
            <div className="text-center text-gray-900 dark:text-gray-100 hover:text-gray-300 pt- w-full h-11 flex bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 dark:hover:bg-gradient-to-r dark:hover:from-gray-900 dark:hover:to-gray-600  border border-indigo-700 dark:border-gray-800 items-center justify-center space-x-1">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="text-sm font-medium "
              >
                {isLogin 
                  ? "Sign In with Google " 
                  : "Sign Up with Google"
                } 
              </button>
                <FcGoogle className='text-2xl'/>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
            
            <div className="text-center pt-">
              {isLogin && (
                <button 
                type='button'
                className='bloc text-sm text-indigo-600 hover:text-indigo-700 font-medium'
                // onClick={()=> alert('handle forget password')}
                onClick={()=> navigate("/forgetpassword")}
                >
                  Forget Password
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="text-center text-sm text-gray-500">
          {/* <p>Demo: Use any email and password to get started</p> */}
          {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
          {message && <p className='text-green-600 text-sm mt-2'>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
