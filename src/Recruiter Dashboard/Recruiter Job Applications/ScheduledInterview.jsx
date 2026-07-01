import { PdfIcon, XIcon, MailIcon } from "./ApplicationData"
import { useState } from "react"

export const ScheduleModal = ({ isOpen, applicantName, onClose, applicantMail }) => {

  const [interviewType,    setInterviewType]    = useState("")
  const [onsiteDate,       setOnsiteDate]       = useState("")
  const [onsiteTime,       setOnsiteTime]       = useState("")
  const [interviewAddress, setInterviewAddress] = useState("")
  const [meetDate,         setMeetDate]         = useState("")
  const [meetTime,         setMeetTime]         = useState("")

  if (!isOpen) return null

  const clearOnsiteFields = () => {
    setOnsiteDate("")
    setOnsiteTime("")
    setInterviewAddress("")
  }

  const clearMeetFields = () => {
    setMeetDate("")
    setMeetTime("")
  }

  const isFormValid = () => {
    if (interviewType === "OnSite") return onsiteDate && onsiteTime && interviewAddress
    if (interviewType === "Meet")   return meetDate && meetTime
    return false
  }

  const MailSending = () => {
    const subject = "Interview Scheduled"

    if (interviewType === "OnSite") {
      const message = `Your interview has been scheduled.
Date: ${onsiteDate}
Time: ${onsiteTime}
Location: ${interviewAddress}

Please bring your CNIC and portfolio.`
      window.open(`https://mail.google.com/mail/?view=cm&to=${applicantMail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, '_blank')

    } else {
      const message = `Your interview has been scheduled.
Date: ${meetDate}
Time: ${meetTime}

Meeting link will be shared 15 minutes before the interview.

Please join on time.`
      window.open(`https://mail.google.com/mail/?view=cm&to=${applicantMail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, '_blank')
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <PdfIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{applicantName}</p>
              <p className="text-xs text-gray-400">Schedule Interview</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Onsite Card */}
              <div
                onClick={() => { setInterviewType("OnSite"); clearMeetFields() }}
                className={`flex flex-col gap-3 border rounded-xl cursor-pointer p-4 transition-all duration-200
                  ${interviewType === "OnSite"
                    ? "bg-red-50 border-red-400"
                    : "bg-white border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  
                  <p className="text-sm font-semibold text-gray-900">Onsite Interview</p>
                </div>

                <div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Interview Date</label>
                    <input
                      type="date"
                      value={onsiteDate}
                      onChange={e => setOnsiteDate(e.target.value)}
                      disabled={interviewType !== "OnSite"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Interview Time</label>
                    <input
                      type="time"
                      value={onsiteTime}
                      onChange={e => setOnsiteTime(e.target.value)}
                      disabled={interviewType !== "OnSite"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Office Location</label>
                    <textarea
                      value={interviewAddress}
                      onChange={e => setInterviewAddress(e.target.value)}
                      disabled={interviewType !== "OnSite"}
                      placeholder="Enter office address"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm resize-none disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Google Meet Card */}
              <div
                onClick={() => { setInterviewType("Meet"); clearOnsiteFields() }}
                className={`flex flex-col gap-3 border rounded-xl cursor-pointer p-4 transition-all duration-200
                  ${interviewType === "Meet"
                    ? "bg-red-50 border-red-400"
                    : "bg-white border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  
                  <p className="text-sm font-semibold text-gray-900">Google Meet</p>
                </div>

                <div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Interview Date</label>
                    <input
                      type="date"
                      value={meetDate}
                      onChange={e => setMeetDate(e.target.value)}
                      disabled={interviewType !== "Meet"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Interview Time</label>
                    <input
                      type="time"
                      value={meetTime}
                      onChange={e => setMeetTime(e.target.value)}
                      disabled={interviewType !== "Meet"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600 opacity-60">Meet Link</label>
                    <p className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      Link will be shared 15 min before interview
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Button */}
            <button
              onClick={MailSending}
              disabled={!isFormValid()}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                ${isFormValid()
                  ? "bg-[#E94560] text-white hover:bg-[#BB1732] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <MailIcon /> Send Schedule Email
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}