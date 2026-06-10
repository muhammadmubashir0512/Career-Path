import React from 'react'

export const categoriesData = [
  {
    id: 1,
    name: 'Development',
    jobCount: 1200,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Design & Creative',
    jobCount: 850,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Finance',
    jobCount: 400,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Marketing',
    jobCount: 620,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Healthcare',
    jobCount: 930,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        <path d="M12 8v8M8 12h8" strokeWidth="2"/>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: 'AI Research',
    jobCount: 310,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
        <path d="M9 15s1 1 3 1 3-1 3-1"/>
      </svg>
    ),
  },
  {
    id: 7,
    name: 'Customer Support',
    jobCount: 1100,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
  },
  {
    id: 8,
    name: 'Human Resources',
    jobCount: 480,
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

export const formatJobCount = (count) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k+'
  return count + '+'
}

const Categories = () => {
  return (
    <div className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore by category
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Find the niche where your talents shine. Curated opportunities across 50+ diverse industries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categoriesData.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 text-center"
            >
              {/* Icon box */}
              <div className={`w-12 h-12 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center flex-shrink-0`}>
                {cat.icon}
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {cat.name}
              </p>

              {/* Count */}
              <p className="text-xs text-gray-400">
                {formatJobCount(cat.jobCount)} Jobs
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories