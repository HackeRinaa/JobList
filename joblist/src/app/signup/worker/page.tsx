"use client";
import { useState } from 'react';
import {supabase} from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  skills: string[];
  hourlyRate: string;
  workRadius: string;
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export default function WorkerSignup() {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    skills: [],
    hourlyRate: '',
    workRadius: '10',
    availability: {
      weekdays: true,
      weekends: false,
      evenings: false
    },
    notifications: {
      email: true,
      sms: true
    }
  });

  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // Create auth user in Supabase
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'WORKER',
            name: formData.name,
            phone: formData.phone,
            skills: formData.skills,
            hourlyRate: formData.hourlyRate,
            workRadius: formData.workRadius,
            availability: formData.availability
          }
        }
      });
  
      if (authError) throw authError;
  
      // Redirect to worker profile
      router.push('/worker/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FloatingNavbar />
      <div className="flex-grow flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your worker account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start receiving job opportunities that match your skills
          </p>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
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

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (€)
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  required
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="workRadius" className="block text-sm font-medium text-gray-700">
                  Work Radius (km)
                </label>
                <input
                  id="workRadius"
                  name="workRadius"
                  type="range"
                  min="1"
                  max="100"
                  className="mt-1 block w-full"
                  value={formData.workRadius}
                  onChange={(e) => setFormData({...formData, workRadius: e.target.value})}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.workRadius} km
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-orange-400 hover:text-orange-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="weekdays"
                      name="weekdays"
                      type="checkbox"
                      className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                      checked={formData.availability.weekdays}
                      onChange={(e) => setFormData({
                        ...formData,
                        availability: {...formData.availability, weekdays: e.target.checked}
                      })}
                    />
                    <label htmlFor="weekdays" className="ml-2 block text-sm text-gray-700">
                      Weekdays
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="weekends"
                      name="weekends"
                      type="checkbox"
                      className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                      checked={formData.availability.weekends}
                      onChange={(e) => setFormData({
                        ...formData,
                        availability: {...formData.availability, weekends: e.target.checked}
                      })}
                    />
                    <label htmlFor="weekends" className="ml-2 block text-sm text-gray-700">
                      Weekends
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="evenings"
                      name="evenings"
                      type="checkbox"
                      className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                      checked={formData.availability.evenings}
                      onChange={(e) => setFormData({
                        ...formData,
                        availability: {...formData.availability, evenings: e.target.checked}
                      })}
                    />
                    <label htmlFor="evenings" className="ml-2 block text-sm text-gray-700">
                      Evenings
                    </label>
                  </div>
                </div>
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 