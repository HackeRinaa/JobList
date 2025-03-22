"use client";
import { useState } from 'react';
import {supabase} from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export default function CustomerSignup() {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    notifications: {
      email: true,
      sms: true
    }
  });

  // Pre-fill form with URL parameters
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // 1. Create auth user in Supabase
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'CUSTOMER',
            name: formData.name,
            phone: formData.phone
          }
        }
      });
  
      if (authError) throw authError;
  
      // Continue with the rest of your logic...
      router.push('/customer/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your customer account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: {...formData.notifications, email: e.target.checked}
                  })}
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  Receive email notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="sms-notifications"
                  name="sms-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                  checked={formData.notifications.sms}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: {...formData.notifications, sms: e.target.checked}
                  })}
                />
                <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                  Receive SMS notifications
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 