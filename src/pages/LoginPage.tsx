import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUser, setError } from '../store/authSlice';
import { showSuccessNotification, showErrorNotification } from '../utils/toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: 'demo@healthhub.com',
    password: 'demo123456',
    displayName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        })
      );

      showSuccessNotification('Login successful! Welcome back.');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setFormError(errorMessage);
      dispatch(setError(errorMessage));
      showErrorNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!formData.displayName) {
      setFormError('Please enter your name');
      setLoading(false);
      showErrorNotification('Please enter your name');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: formData.displayName,
          photoURL: null,
        })
      );

      showSuccessNotification('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setFormError(errorMessage);
      dispatch(setError(errorMessage));
      showErrorNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-2">🏥</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">HealthHub</h2>
            <p className="text-gray-600">Healthcare SaaS Platform</p>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorAlert
              message={error}
              onDismiss={() => setFormError(null)}
            />
          )}

          {/* Form */}
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="flex items-center">
                  <FiUser className="absolute ml-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <FiMail className="absolute ml-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center">
                <FiLock className="absolute ml-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full mt-6"
              variant="primary"
              size="lg"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormError(null);
                }}
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Demo Credentials:</span>
              <br />
              Email: demo@healthhub.com
              <br />
              Password: demo123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
