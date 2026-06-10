import React, { useState, useEffect } from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import { applicationsData, PdfIcon, PinIcon, MailIcon, ZoomIcon, ClockIcon, SalaryIcon, TrophyIcon, 
  BookmarkIcon,  CalEventIcon, CalendarIcon, BriefcaseIcon, DownloadIcon, XIcon, 
  ScheduleIcon, statusConfig, avatarColors, statusButtons
 } from './ApplicationData'
import { ResumeModal } from './ResumeReview'
import { ScheduleModal } from './ScheduledInterview'


// Create Context for Status Updation
const StatusContext = createContext();

const StatusProvider = ({children})=>{
  const [currentStatus,   setCurrentStatus]   = useState(null)

  const updateStatus = (newStatus) => {
    setCurrentStatus(newStatus)
    console.log("Status updated to:", newStatus)
  }

  return (
    <StatusContext.Provider value={{ currentStatus, updateStatus, setCurrentStatus }}>
      {children}
    </StatusContext.Provider>
  )

}

const useStatus = () => {
  const context = useContext(StatusContext)
  if (!context) {
    throw new Error("useStatus must be used within StatusProvider")
  }
  return context
}

//  ApplicationDetail Component
const ApplicationDetail = ({ isOpen, onClose, applicationId }) => {
  const [applicationInfo, setApplicationInfo] = useState(null)
  const [note,            setNote]            = useState('')
  const [isResumeOpen,    setIsResumeOpen]    = useState(false)
  // const [currentStatus,   setCurrentStatus]   = useState(null)
  const [isScheduled, setIsScheduledOpen] = useState(null)
  const { currentStatus, updateStatus, setCurrentStatus } = useStatus()

  // ── Fetch application by ID ──
  useEffect(() => {
    if (applicationId) {
      const found = applicationsData.find(app => app.id === applicationId)
      setApplicationInfo(found || null)
      setCurrentStatus(found?.status || null)
      if (found) {
        updateStatus(found?.status || null)
      }
      setNote('')
      setIsResumeOpen(false)
    }
  }, [applicationId, isOpen])

  if (!isOpen) return null

  // Status Updation
  const StatusClicked = (statusValue) =>{
    if (currentStatus === "Pending") {
            return statusValue === "Interview" || statusValue === "Rejected"
        }
        if (currentStatus === "Interview") {
            return statusValue === "Rejected" || statusValue === "Shortlisted" || statusValue === "Hired"
        }
        if (currentStatus === "Shortlisted") {
            return statusValue === "Hired" || statusValue === "Rejected"
        }
        if (currentStatus === "Hired" || currentStatus === "Rejected") {
            return false
        }
        return false
  }

  const handleClick = (statusField) => {
        if (StatusClicked(statusField)) {
            updateStatus(statusField)
            console.log(`Field ${statusField} is now enabled`)
        }
    }

  const avatarColor = avatarColors[(applicationId - 1) % avatarColors.length]

  

  return (
    <>
      {/* ── Drawer ── */}
      <div className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900">Application detail</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {applicationInfo ? (
            <div className="flex flex-col gap-0">

              {/* ── Candidate card ── */}
              <div className="m-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {applicationInfo.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{applicationInfo.fullName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{applicationInfo.email}</p>
                  </div>
                </div>
                {/* Tags row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full">
                    <PinIcon /> {applicationInfo.location}
                  </span>
                  <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full">
                    {applicationInfo.experience} exp
                  </span>
                  {applicationInfo.skills.map(skill => (
                    <span key={skill} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Application Info ── */}
              <div className="px-4 pb-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Application info
                </p>
                <div className="flex flex-col divide-y divide-gray-100">
                  {[
                    { icon: <BriefcaseIcon />, label: 'Applied for',      value: applicationInfo.position         },
                    { icon: <CalendarIcon />,  label: 'Applied on',       value: applicationInfo.appliedDate      },
                    { icon: <ClockIcon />,     label: 'Experience',       value: applicationInfo.experience       },
                    { icon: <SalaryIcon />,    label: 'Expected salary',  value: applicationInfo.expectedSalary   },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-gray-400">{row.icon}</span>
                        {row.label}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 mx-4" />

              {/* ── Resume ── */}
              <div className="px-4 py-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Resume
                </p>
                {/* Resume card*/}
                <button
                  onClick={() => setIsResumeOpen(true)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                    <PdfIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {applicationInfo.resumeName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {applicationInfo.resumeSize}
                    </p>
                  </div>
                  <div className="text-gray-300">
                    <DownloadIcon />
                  </div>
                </button>
              </div>

              <hr className="border-gray-100 mx-4" />

              {/* ── Current Status ── */}
              <div className="px-4 py-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Current status
                </p>
                <div className="grid grid-cols-1">
                  <div className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg border transition-all         duration-150 ${statusConfig[currentStatus]?.bg || 'bg-gray-100'}
                  ${statusConfig[currentStatus]?.text || 'text-gray-700'}
                  `}>
                      <span className="text-s font-medium">{currentStatus}</span>
                  </div>
                </div>
              </div>

              {/* ── Update Status ── */}
              <div className="px-4 py-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Update status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {statusButtons.map(btn => {
                    const isCurrentlyEnabled = currentStatus === btn.key
                    const isClickable = StatusClicked(btn.key)
                    return(
                      <button
                        key={btn.key}
                        onClick={() => handleClick(btn.key)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer
                          ${currentStatus === btn.key ? btn.active : btn.inactive}`}
                      >
                        <span className={currentStatus === btn.key ? '' : 'text-gray-400'}>
                          {btn.icon}
                        </span>
                        <span className="text-xs font-medium">{btn.label}</span>
                      </button>
                  )})}
                </div>
              </div>

              <hr className="border-gray-100 mx-4" />

              {/* ── Private Note ── */}
              <div className="px-4 py-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Private note
                </p>
                <textarea
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add internal note about this candidate..."
                  className="w-full text-xs text-gray-700 placeholder-gray-300 border border-gray-200 rounded-xl px-3 py-2.5 resize-none outline-none focus:border-gray-400 transition-colors leading-relaxed"
                />
              </div>

              {/* Bottom spacing */}
              <div className="h-4" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-20">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          )}
        </div>

        {/* ── Footer action buttons ── */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <a href={`mailto:${applicationInfo?.email}`}  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <MailIcon /> Send email
          </a>
          <button
              onClick={()=> setIsScheduledOpen(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer
                  ${currentStatus === "Interview" 
                      ? "bg-[#E94560] text-white hover:bg-[#BB1732]" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              disabled={currentStatus !== "Interview"}
          >
              <ScheduleIcon /> Schedule
          </button>
        </div>
      </div>

      {/* ── Resume Modal ── */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeName={applicationInfo?.resumeName}
        resumeUrl={applicationInfo?.resumeUrl}
      />

      {/* Scheduled Open */}
      <ScheduleModal
        isOpen={isScheduled}
        onClose={() => setIsScheduledOpen(false)}
        applicantName={applicationInfo?.fullName}
      />
    </>
  )
}

export default ApplicationDetail
export { StatusProvider, useStatus }