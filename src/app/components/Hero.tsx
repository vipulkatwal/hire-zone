'use client'

import React from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Hero() {
  const [searchPhrase, setSearchPhrase] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchPhrase);
  };

  return (
    <section className="container my-16 px-4">
      <h1 className="text-5xl font-bold text-center mb-4">
        Find your next<br />
        <span className="text-blue-600">dream job</span>
      </h1>
      <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
        Discover opportunities that match your skills and aspirations.
        Connect with innovative companies and take the next step in your career.
      </p>
      <form onSubmit={handleSearch} className="flex gap-2 mt-8 max-w-xl mx-auto relative">
        <input
          type="search"
          className="border-2 border-gray-300 w-full py-3 px-4 pr-12 rounded-full focus:outline-none focus:border-blue-500 transition-all duration-300"
          placeholder="Search jobs, companies, or skills..."
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
          aria-label="Search jobs"
        >
          <Search size={24} />
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Popular searches: Software Engineer, Data Analyst, Product Manager</p>
      </div>
    </section>
  );
}