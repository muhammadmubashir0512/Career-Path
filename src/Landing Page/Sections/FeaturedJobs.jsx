import React from 'react'
import { useNavigate } from 'react-router'

const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    salary: '$140k–$190k',
    jobType: 'Full-time',
    workType: 'On-site',
    logoBg: 'bg-blue-50',
    logoColor: 'text-blue-600',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Creative Minds',
    location: 'Remote',
    salary: '$110k–$155k',
    jobType: 'Remote',
    workType: 'Remote',
    logoBg: 'bg-violet-50',
    logoColor: 'text-violet-600',
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'Metrics Hub',
    location: 'New York, NY',
    salary: '$95k–$130k',
    jobType: 'Full-time',
    workType: 'On-site',
    logoBg: 'bg-green-50',
    logoColor: 'text-green-600',
  },
  {
    id: 4,
    title: 'Growth Marketer',
    company: 'SkyRocket AI',
    location: 'Austin, TX',
    salary: '$80k–$120k',
    jobType: 'Remote',
    workType: 'Remote',
    logoBg: 'bg-amber-50',
    logoColor: 'text-amber-600',
  },
  {
    id: 5,
    title: 'HR Manager',
    company: 'Global Reach Co.',
    location: 'Chicago, IL',
    salary: '$105k–$145k',
    jobType: 'Full-time',
    workType: 'Hybrid',
    logoBg: 'bg-pink-50',
    logoColor: 'text-pink-600',
  },
  {
    id: 6,
    title: 'Clinical Director',
    company: 'HealHealth Med',
    location: 'Boston, MA',
    salary: '$180k–$240k',
    jobType: 'Full-time',
    workType: 'On-site',
    logoBg: 'bg-red-50',
    logoColor: 'text-red-500',
  },
]

const jobTypeBadge = {
  'Full-time': 'bg-green-100 text-green-700',
  'Remote':    'bg-blue-100 text-blue-700',
  'Part-time': 'bg-amber-100 text-amber-700',
}

const workTypeBadge = {
  'On-site': 'bg-gray-100 text-gray-600',
  'Remote':  'bg-blue-50 text-blue-600',
  'Hybrid':  'bg-violet-50 text-violet-600',
}

// Location icon
const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

// Salary icon
const SalaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="flex-shrink-0">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const getInitials = (title) =>
  title.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

const FeaturedJobs = () => {

    const Navigate = useNavigate()
  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Featured jobs
          </h2>
          <p className="text-gray-400 text-sm">
            Hand-picked opportunities from leading organizations
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobListings.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300"
            >
              {/* Top — logo + job type badge */}
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl ${job.logoBg} ${job.logoColor} flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
                  {getInitials(job.title)}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${jobTypeBadge[job.jobType] || 'bg-gray-100 text-gray-600'}`}>
                  {job.jobType}
                </span>
              </div>

              {/* Title + company */}
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
                <p className="text-xs text-gray-400">{job.company}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <PinIcon />
                    <span>{job.location}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${workTypeBadge[job.workType] || 'bg-gray-100 text-gray-600'}`}>
                    {job.workType}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <SalaryIcon />
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Apply button */}
              <button className="w-full mt-auto bg-[#E94560] text-white text-sm font-medium cursor-pointer py-2.5 rounded-lg" onClick={()=>Navigate('/signup')}>
                Apply now
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default FeaturedJobs