import React from 'react';
import { Link } from 'react-router-dom';
import { AssessmentForm } from '../components/AssessmentForm';

export default function Assessment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Digi Greece
            </h1>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <AssessmentForm />
      </main>
    </div>
  );
}