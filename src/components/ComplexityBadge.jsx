import React from 'react';

const complexityColors = {
  'O(1)': 'bg-green-500/20 text-green-400 border-green-500/30',
  'O(log n)': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'O(n)': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'O(n log n)': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'O(n²)': 'bg-red-500/20 text-red-400 border-red-500/30',
  'O(2ⁿ)': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const complexityDescriptions = {
  'O(1)': 'Constant - Operations always take the same time/space',
  'O(log n)': 'Logarithmic - Grows slowly as input size increases',
  'O(n)': 'Linear - Grows directly with input size',
  'O(n log n)': 'Linearithmic - Common in sorting algorithms',
  'O(n²)': 'Quadratic - Grows significantly with input size',
  'O(2ⁿ)': 'Exponential - Grows extremely rapidly',
};

const ComplexityBadge = ({ type, complexity }) => {
  const colorClass = complexityColors[complexity] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const description = complexityDescriptions[complexity] || 'Complexity not specified';

  return (
    <div className="relative group">
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {type === 'time' ? (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )}
        {complexity}
      </div>
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900/95 rounded-lg shadow-xl border border-white/10 text-xs text-gray-300 z-10">
        <p>{type === 'time' ? 'Time Complexity' : 'Space Complexity'}</p>
        <p className="mt-1 text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default ComplexityBadge;
