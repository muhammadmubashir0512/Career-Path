import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../firebase/config'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { Icons } from './SidebarIcons'



const navItems = [
  { label: 'Dashboard',    path: '/recruiter/dashboard',    icon: Icons.dashboard,    badge: null },
  { label: 'My Jobs',      path: '/recruiter/jobs',         icon: Icons.jobs,         badge: null },
  { label: 'Post a Job',   path: '/recruiter/postjob',      icon: Icons.postJob,      badge: null },
  { label: 'Applications', path: '/recruiter/applications', icon: Icons.applications, badge: null },
  { label: 'Settings',     path: '/recruiter/settings',     icon: Icons.settings,     badge: null },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [profileImg, setProfileImg] = useState(null)
  const [UserName, setUserName] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Logout confirmation popup state
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const user = auth.currentUser
        
        if (!user) {
          console.log("No user logged in")
          setLoading(false)
          return
        }

        const userId = user.uid
        const userRef = doc(db, "users", userId)
        const userPic = await getDoc(userRef)

        if (userPic.exists()) {
          const userData = userPic.data()
          console.log("User data:", userData)
          
          setProfileImg(userData.profilePicture || userData.logo || null)
          setUserName(userData.fullName || null)
          setUserRole(userData.Role || null)
        } else {
          console.log("No such document!")
          setProfileImg(null)
        }
      } catch (error) {
        console.error("Error getting document:", error)
        setProfileImg(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchImage()
  }, [])

  const handleNav = (path) => {
    navigate(path)
  }

  // Handle logout button click
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  // Confirm logout
  const handleConfirmLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully!")
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setShowLogoutModal(false)
    }
  }

  // Cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
      <div className="flex flex-col h-screen w-[220px] bg-[#0f1729] fixed top-0 left-0 z-50 flex-shrink-0 py-5 px-3">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-2 pb-5 mb-2 border-b border-white/10 cursor-pointer" onClick={()=> navigate("/recruiter/dashboard")}>
          <div className="w-8 h-8 bg-[#E94560] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            Career<span className="text-[#E94560]">Path</span>
          </span>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer group
                  ${isActive
                    ? 'bg-[#E94560] text-white'
                    : 'text-white/50 hover:bg-white/7 hover:text-white/80'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                )}

                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                  {item.icon}
                </span>

                <span className="text-sm font-medium flex-1">{item.label}</span>

                {item.badge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : item.label === 'Messages'
                        ? 'bg-[#E94560] text-white'
                        : 'bg-white/10 text-white/60'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* ── User profile bottom (Logout Button) ── */}
        <div className="border-t border-white/10 pt-3 mt-3">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/7 cursor-pointer group transition-colors"
          >
            <div>
              {profileImg ? (
                <img src={profileImg} alt="profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#E94560]/20 flex items-center justify-center text-white text-xs font-semibold">
                  {UserName ? UserName[0] : "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-xs font-medium truncate">{UserName || "User"}</p>
              <p className="text-white/40 text-[10px] truncate">{userRole || "Role"}</p>
            </div>
            <span className="text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">
              {Icons.logout}
            </span>
          </button>
        </div>
      </div>

      {/* ── Logout Confirmation Modal (Popup) ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={handleCancelLogout}
          />
          
          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#0f1729] rounded-2xl w-full max-w-[380px] shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-white text-lg font-semibold">Confirm Logout</h3>
                <button
                  onClick={handleCancelLogout}
                  className="text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                >
                  {Icons.close}
                </button>
              </div>
              
              {/* Body */}
              <div className="p-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#E94560]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                      fill="none" stroke="#E94560" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </div>
                </div>
                <p className="text-white/70 text-center text-sm">
                  Are you sure you want to logout?
                </p>
                <p className="text-white/40 text-center text-xs mt-1">
                  You'll need to login again to access your account.
                </p>
              </div>
              
              {/* Footer Buttons */}
              <div className="flex gap-3 p-5 pt-0">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#E94560] hover:bg-[#BB1732] text-white font-medium text-sm transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar