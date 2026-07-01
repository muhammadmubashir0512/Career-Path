import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import HeroImg from '../../../src/assets/LandingPage/Hero.png'

// ── Search icons ──
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-gray-400 flex-shrink-0">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-gray-400 flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const popularTags = ['Remote', 'UI/UX Design', 'Python', 'Marketing', 'React']

const Hero = () => {
  const [locationQuery, setLocationQuery] = useState('')
  const navigate = useNavigate()

  

  return (
    <section id="find-jobs" className="bg-white">

      {/* ── Hero content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left */}
        <div className="flex flex-col gap-5">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find Your{' '}
            <span className="text-[#E94560]">Dream Job</span>{' '}
            Today
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md">
            Connecting top talent with world-class companies through an intelligent,
            career-first platform designed for modern professionals.
          </p>

          {/* Search bar */}
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-gray-400 transition-colors">
            {/* Job field */}
            <div className="flex items-center gap-2 px-4 flex-1 h-12 border-r border-gray-200">
              <SearchIcon />
              <input
                type="text"
                disabled
                placeholder="Job title or keywords"
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {/* Location field */}
            <div className="flex items-center gap-2 px-4 flex-1 h-12">
              <PinIcon />
              <input
                type="text"
                disabled
                placeholder="City or remote"
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {/* Button */}
            <button
              className="bg-[#0f1729] hover:bg-gray-800 text-white text-sm font-semibold px-6 h-12 transition-colors whitespace-nowrap cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Popular tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Popular:</span>
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setJobQuery(tag)}
                className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right — image (Figma se export karke replace karo) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
            {/* 
              BHAI: heroMockup ki jagah apni Figma exported image lagao.
              Import karo upar: import heroMockup from '../../assets/LandingPage/hero-mockup.png'
              Tab tak placeholder dikh raha hai.
            */}
            <img
              src={HeroImg}
              alt="CareerPath dashboard preview"
              className="w-full h-auto object-cover"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            {/* Placeholder — image load na ho tab dikhe */}
            <div
              className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 hidden items-center justify-center"
              style={{ display: 'none' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-300 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <p className="text-sm text-slate-400">Figma se image export karke lagao</p>
                <p className="text-xs text-slate-400 mt-1">assets/LandingPage/hero-mockup.png</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-[#0f1729] py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-white/10">
          {[
            { num: '50,000+', label: 'Jobs available'   },
            { num: '10,000+', label: 'Active companies'  },
            { num: '1M+',     label: 'Candidates'        },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 md:px-8">
              <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {stat.num.replace('+', '')}
                <span className="text-blue-400">+</span>
                {stat.num.includes('M') && <span className="text-blue-400">M</span>}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default Hero