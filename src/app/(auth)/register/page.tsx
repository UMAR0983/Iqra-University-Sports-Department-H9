'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Mail, Lock, User, Hash, Building } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@iqra.edu.pk')) {
      setError('Registration is strictly restricted to Iqra University email accounts (@iqra.edu.pk).');
      return;
    }
    setError(null);
    router.push('/dashboard/player');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0B3C8C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Trophy className="w-6 h-6 text-[#F2B705]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Create Student Athlete Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign up to represent your department in campus athletic championships
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zain Ul Abideen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Official University Email (@iqra.edu.pk)
            </label>
            <input
              type="email"
              required
              placeholder="zain.student@iqra.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                required
                placeholder="IU-CS-2023-412"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Semester
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Academic Faculty / Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Management Sciences">Management Sciences (BBA/MBA)</option>
              <option value="Engineering & Tech">Engineering & Technology</option>
              <option value="Media Studies">Media & Communication</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Faculty of Law">Faculty of Law</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Fashion & Design">Fashion & Design</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0B3C8C] hover:bg-[#08265E] text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Register Student Profile
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link href="/login" className="text-[#0B3C8C] font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
