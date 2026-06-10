import React, { useState } from 'react'
import { useNavigate } from 'react-router'

// ─── Hamburger SVG (img tag hata diya — SVG hamesha render hoga) ───
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
)

// ─── Nav items — sectionId wo id hai jo tumhare section mein lagaani hai ───
const navItems = [
  { label: 'Find Jobs',     sectionId: 'find-jobs'      },
  { label: 'Categories',   sectionId: 'categories'     },
  { label: 'Featured Jobs', sectionId: 'featured-jobs'  },
  { label: 'Blog',          sectionId: 'blog'           },
]

const Navbar = () => {
  const [isActive, setIsActive] = useState('Find Jobs')
  const [isOpen,   setIsOpen]   = useState(false)
  const navigate = useNavigate()

  // ─── Smooth scroll function ───
  const handleNavClick = (item) => {
    setIsActive(item.label)
    setIsOpen(false)

    const section = document.getElementById(item.sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <HamburgerIcon />
          </button>
          <span className="font-bold text-lg md:text-xl text-gray-900 tracking-tight cursor-pointer"
            onClick={() => navigate('/')}>
            Career<span className="text-[#E94560]">Path</span>
          </span>
        </div>

        {/* Center — nav links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive === item.label
                  ? 'text-[#E94560] bg-red-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right — auth buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-lg px-3 md:px-5 py-1.5 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#E94560] hover:bg-[#d63652] text-white rounded-lg px-3 md:px-5 py-1.5 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-lg text-gray-900">
            Career<span className="text-[#E94560]">Path</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive === item.label
                  ? 'text-[#E94560] bg-red-50 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Drawer auth buttons */}
        <div className="px-4 pt-4 border-t border-gray-100 flex flex-col gap-2 mx-3">
          <button
            onClick={() => { navigate('/login'); setIsOpen(false) }}
            className="w-full border border-gray-200 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => { navigate('/signup'); setIsOpen(false) }}
            className="w-full bg-[#E94560] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#d63652] transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar