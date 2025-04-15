import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AuthLayout from '../components/layouts/AuthLayout';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    try {
      console.log('Email/Password login attempt:', { email, password });
      const user = await signIn(email, password);
      console.log('User signed in with email:', user);
      navigate('/');
    } catch (err) {
      setIsLoading(false);
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      console.log('Google login success:', response);
      setIsLoading(true);
      const user = await signIn(response.credential);
      console.log('User signed in with Google:', user);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setError('Failed to sign in with Google');
      console.error('Google login error:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white"
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white"
                placeholder="Password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="relative flex justify-center w-full"
            >
              {isLoading ? (
                <span className="absolute inset-y-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or continue with</span>
            </div>
          </div>

          <div>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.error('Google login failed');
                  setError('Failed to sign in with Google');
                }}
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignIn; 