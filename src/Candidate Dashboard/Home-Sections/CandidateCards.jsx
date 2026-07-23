import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'

// SVG icons
const icons = {
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="12"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  fileText: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  checkCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  trophy: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/>
      <line x1="12" y1="17" x2="12" y2="11"/>
      <path d="M7 4h10l1 7H6L7 4z"/>
      <path d="M6 11C3.8 11 2 9.2 2 7V4h5"/>
      <path d="M18 11c2.2 0 4-1.8 4-4V4h-5"/>
    </svg>
  ),
}

const CandidateCards = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Firebase se jobs fetch karo
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          toast.error("Please login first")
          navigate('/login')
          return
        }

        const docRef = doc(db, "Jobs", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          const jobsArray = data.jobs || []
          setJobs(jobsArray)
          console.log("Fetched jobs:", jobsArray)
        } else {
          setJobs([])
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast.error("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [navigate])

  // Real data calculations
  const totalJobs = jobs.length
  const activeJobs = jobs.filter(job => job.status === 'Active').length
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
  const hiredThisMonth = jobs.filter(job => {
    return job.hired || 0
  }).reduce((sum, job) => sum + (job.hired || 0), 0)

  // Cards data with REAL values
  const cardsData = [
    {
      id: 1,
      title: "Applied Jobs",
      value: totalJobs,
      icon: icons.briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accentColor: "bg-blue-500",
      change: totalJobs > 0 ? `+${totalJobs}%` : "0%",
      changeType: totalJobs > 0 ? "increase" : "decrease",
    },
    {
      id: 2,
      title: "Saved Jobs",
      value: totalApplications,
      icon: icons.fileText,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accentColor: "bg-violet-500",
      change: totalApplications > 0 ? `+${Math.min(totalApplications, 99)}%` : "0%",
      changeType: totalApplications > 0 ? "increase" : "decrease",
    },
    {
      id: 3,
      title: "Interviews",
      value: activeJobs,
      icon: icons.checkCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accentColor: "bg-green-500",
      change: activeJobs > 0 ? `+${activeJobs}%` : "0%",
      changeType: activeJobs > 0 ? "increase" : "decrease",
    },
    // {
    //   id: 4,
    //   title: "Hired this month",
    //   value: hiredThisMonth,
    //   icon: icons.trophy,
    //   iconBg: "bg-amber-50",
    //   iconColor: "text-amber-600",
    //   accentColor: "bg-amber-500",
    //   change: hiredThisMonth > 0 ? `+${hiredThisMonth}%` : "0%",
    //   changeType: hiredThisMonth > 0 ? "increase" : "decrease",
    // },
  ]

  if (loading) {
    return (
      <div className="flex flex-col gap-5 pt-20 md:pt-5">
        <div className="flex flex-col gap-1">
          <p className="text-2xl md:text-3xl font-bold text-gray-900">Candidate Dashboard</p>
          <p className="text-sm text-gray-400">Loading your Applications activity...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
              <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 pt-20 md:pt-5">
      <Toaster position="top-right" />
      
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl md:text-3xl font-bold text-gray-900">Candidate Dashboard</p>
        <p className="text-sm text-gray-400">Here's your hiring activity overview</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="relative flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Top row — icon + change badge */}
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.changeType === "increase"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {card.change}
              </span>
            </div>
            
            {/* Bottom — label + value */}
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>

            {/* Accent bottom strip */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${card.accentColor} opacity-70`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CandidateCards