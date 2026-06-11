import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useNavigate, useLocation } from 'react-router-dom'
import Hamburger from '../assets/LandingPage/Hamburger.png'
import { Icons } from './SidebarIcons'


const navItems = [
  { label: 'Dashboard',    path: '/recruiter/dashboard',    icon: Icons.dashboard,    badge: null },
  { label: 'My Jobs',      path: '/recruiter/jobs',       icon: Icons.jobs,         badge: null },
  { label: 'Post a Job',   path: '/recruiter/postjob',     icon: Icons.postJob,      badge: null },
  { label: 'Applications', path: '/recruiter/applications', icon: Icons.applications, badge: null },
  { label: 'Settings',     path: '/recruiter/settings',     icon: Icons.settings,     badge: null },
]

const Topbar = () => {
  const [profileImg, setProfileImg] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          setLoading(false)
          return
        }
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          setProfileImg(data.profilePicture || data.logo || null)
          setUserName(data.fullName || data.companyName || 'User')
          setUserRole(data.Role || data.role || 'Recruiter')
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleNav = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    auth.signOut().then(() => navigate('/login')).catch(console.error)
  }

  const getActiveClass = (path) => {
    return location.pathname === path
  }

  if (loading) {
    return (
      <div className='flex items-center justify-between p-3 border-b border-gray-200 w-full bg-white md:hidden'>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

  return (
    <>
      {/* Only visible on mobile (md:hidden) */}
      <div className='md:hidden flex items-center justify-between p-3 rounded-lg border-b border-white/10 w-[calc(100%-8px)] bg-[#0f1729] fixed top-2 left-1 right-1 z-50'>
        {/* Hamburger Menu Button */}
        <button onClick={() => setIsOpen(true)} className="text-white/70 hover:text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Logo */}
        {/* <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E94560] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">CP</span>
          </div>
          <span className="text-white font-bold text-sm">Career<span className="text-[#E94560]">Path</span></span>
        </div> */}

        {/* User Avatar */}
        <button onClick={() => navigate('/recruiter/settings')} className="cursor-pointer">
          {profileImg ? (
            <img src={profileImg} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white/20"/>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E94560] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{userName?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          )}
        </button>
      </div>

      {/* Sidebar Drawer - Same as original Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-[260px] bg-[#0f1729] z-50 flex flex-col py-5 px-3 shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white text-2xl cursor-pointer">✕</button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 pb-5 mb-2 border-b border-white/10" onClick={()=> navigate("/recruiter/dashboard")}>
              <div className="w-8 h-8 bg-[#E94560] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base">Career<span className="text-[#E94560]">Path</span></span>
            </div>

            <p className="text-[10px] text-white/30 uppercase tracking-widest px-3 mb-2">Main menu</p>

            {/* Navigation Items */}
            <nav className="flex flex-col gap-0.5 flex-1">
              {navItems.map((item) => {
                const isActive = getActiveClass(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer group
                      ${isActive ? 'bg-[#E94560] text-white' : 'text-white/50 hover:bg-white/7 hover:text-white/80'}`}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />}
                    <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0
                        ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* User Section + Logout */}
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/7 cursor-pointer group transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#E94560] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden">
                  {profileImg ? (
                    <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{userName || 'User'}</p>
                  <p className="text-white/40 text-[10px] truncate">{userRole || 'Recruiter'}</p>
                </div>
                <button onClick={handleLogout} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 cursor-pointer">
                  {Icons.logout}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Topbar