import React from 'react'
 
const applications = [
  { name: "John Carter",  post: "Senior React Developer", date: "May 8, 2026", status: "Shortlisted" },
  { name: "Buttler Ray",  post: "Senior React Developer", date: "May 8, 2026", status: "Interview"   },
  { name: "Smith Ali",    post: "DevOps Engineer",        date: "May 8, 2026", status: "Pending"     },
  { name: "Priya Patel",  post: "Full Stack Developer",   date: "May 8, 2026", status: "Hired"       },
  { name: "Alexa Jehn",   post: "UX Researcher",          date: "May 8, 2026", status: "Rejected"    },
  { name: "Jordan Lee",   post: "Product Designer",       date: "May 8, 2026", status: "Shortlisted" },
]
 
const statusStyles = {
  Shortlisted: { badge: "bg-violet-100 text-violet-800", dot: "bg-violet-400" },
  Interview:   { badge: "bg-blue-100   text-blue-800",   dot: "bg-blue-400"   },
  Pending:     { badge: "bg-amber-100  text-amber-800",  dot: "bg-amber-400"  },
  Hired:       { badge: "bg-green-100  text-green-800",  dot: "bg-green-500"  },
  Rejected:    { badge: "bg-red-100    text-red-800",    dot: "bg-red-400"    },
}
 
const avatarColors = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500",  "bg-pink-500", "bg-orange-500",
]
 
const getInitials = (name) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
 
const RecentApplications = () => {
  return (
    <div className="flex flex-col gap-3 p-5 border border-gray-200 shadow-sm bg-white rounded-2xl w-full">
 
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[20px] font-bold text-gray-900">Recent applications</p>
          <p className="text-xs text-gray-400 mt-0.5">6 received this week</p>
        </div>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          View all →
        </button>
      </div>
 
      {/* List */}
      <div className="flex flex-col divide-y divide-gray-100">
        {applications.map((item, index) => {
          const style = statusStyles[item.status] || { badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" }
          const avatarBg = avatarColors[index % avatarColors.length]
 
          return (
            <div
              key={index}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-semibold tracking-wide">
                  {getInitials(item.name)}
                </span>
              </div>
 
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {item.post}&nbsp;·&nbsp;{item.date}
                </p>
              </div>
 
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${style.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                {item.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
 
export default RecentApplications