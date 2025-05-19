"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreatePasswordProps {
  email: string;
  tempCode: string;
}

const CreatePassword: React.FC<CreatePasswordProps> = ({ email, tempCode }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (passwordStrength === 1) return 'Αδύναμο';
    if (passwordStrength === 2) return 'Μέτριο';
    if (passwordStrength === 3) return 'Καλό';
    if (passwordStrength === 4) return 'Ισχυρό';
    return '';
  };

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-500';
    return 'bg-gray-200';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν');
      return;
    }

    if (passwordStrength < 3) {
      setError('Παρακαλώ επιλέξτε ισχυρότερο κωδικό (τουλάχιστον 8 χαρακτήρες, με κεφαλαία, αριθμούς)');
      return;
    }

    setIsLoading(true);

    try {
      // Call API to set the new password
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tempCode,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Σφάλμα κατά την αλλαγή του κωδικού');
      }

      // Success - redirect to login
      router.push('/login?passwordSet=true');
    } catch (err) {
      console.error('Error setting password:', err);
      setError(err instanceof Error ? err.message : 'Προέκυψε σφάλμα');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Δημιουργία Κωδικού</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Νέος Κωδικός
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FB7600]"
            placeholder="Εισάγετε νέο κωδικό"
            required
          />
          
          {/* Password strength indicator */}
          <div className="mt-2">
            <div className="h-2 rounded-full bg-gray-200 mt-1">
              <div
                className={`h-2 rounded-full ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getStrengthLabel()}
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες, ένα κεφαλαίο γράμμα και έναν αριθμό.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Επιβεβαίωση Κωδικού
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FB7600]"
            placeholder="Επαναλάβετε τον κωδικό"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#FB7600] text-white py-2 rounded-lg hover:bg-[#E56A00] transition-all ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Επεξεργασία...' : 'Δημιουργία Κωδικού'}
        </button>
      </form>
    </div>
  );
};

export default CreatePassword; 