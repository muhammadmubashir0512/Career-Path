// Resume Modal Component
export const ResumeModal = ({ isOpen, onClose, resumeName, resumeUrl }) => {
  if (!isOpen) return null

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
              <p className="text-sm font-semibold text-gray-900">{resumeName}</p>
              <p className="text-xs text-gray-400">PDF Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Download button */}
            {resumeUrl && (
              <a
                href={resumeUrl}
                download={resumeName}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DownloadIcon />
                Download
              </a>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Modal body — PDF viewer ya placeholder */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {resumeUrl ? (
            // Firebase se URL aane ke baad yeh iframe kaam karega
            <iframe
              src={resumeUrl}
              className="w-full h-full min-h-[500px]"
              title={resumeName}
            />
          ) : (
            // Placeholder — jab tak Firebase se URL nahi aata
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
                <ZoomIcon />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{resumeName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Firebase se resume URL connect hone ke baad yahan preview dikhe ga
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <p className="text-xs text-amber-600 font-medium">resumeUrl — Firebase Storage link</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}