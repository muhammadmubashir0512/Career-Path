import { PdfIcon } from "./ApplicationData"
import { XIcon } from "./ApplicationData"

import { useState } from "react"

// ScheduleModal Component
export const ScheduleModal = ({isOpen, applicantName, onClose}) =>{

    const[interviewType, setInterviewType] = useState("OnSite");
    const [interviewDate, setInterviewDate] = useState(null)
    const [interviewTime, setInterviewTime] = useState(null)
    const [interviewAddress, setInterviewAddress] = useState(null)

  if (!isOpen) {
    return null
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal box*/}
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <PdfIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{applicantName}</p>
              <p className="text-xs text-gray-400">Interview Scheduled Plan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* OnSite Data */}
            <div onClick={()=>setInterviewType("OnSite")} className={`flex flex-col gap-2 border rounded-lg cursor-pointer p-2  ${interviewType === "OnSite" ? "bg-red-50 border-red-400" : "border-gray-200 bg-white hover:border-gray-300 "}`}>
                <p className="text-[16px] font-semibold">Onsite Data</p>
            </div>

            {/* Google Meet Data */}
            <div onClick={()=>setInterviewType("Meet")} className={`flex flex-col gap-2 border rounded-lg cursor-pointer p-2  ${interviewType === "Meet" ? "bg-red-50 border-red-400" : "border-gray-200 bg-white hover:border-gray-300 "}`}>
                <p className="text-[16px] font-semibold">Google Meet Data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}