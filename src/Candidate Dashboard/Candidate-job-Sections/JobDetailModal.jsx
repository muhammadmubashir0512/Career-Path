import { useEffect, useState } from "react"

// Uncomment these once icons are added to assets folder
// import bookmarkIcon from "../../assets/bookmark.png"
// import shareIcon from "../../assets/share.png"
// import checkIcon from "../../assets/check.png"
// import starIcon from "../../assets/star.png"
// import arrowIcon from "../../assets/arrow.png"
// import closeIcon from "../../assets/close.png"
// import locationPinIcon from "../../assets/locationPin.png"

const JobDetailModal = ({ job, isOpen, onClose }) => {
    const [shouldRender, setShouldRender] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsAnimating(true))
            })
            document.body.style.overflow = "hidden"
        } else {
            setIsAnimating(false)
            document.body.style.overflow = ""
            const timeout = setTimeout(() => setShouldRender(false), 300)
            return () => clearTimeout(timeout)
        }
    }, [isOpen])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isOpen, onClose])

    if (!shouldRender || !job) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                    isAnimating ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Panel */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative h-full w-full sm:w-[90%] md:w-[520px] bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                    {/* <img src={closeIcon} alt="close" className="h-4 w-4" /> */}
                    ✕
                </button>

                <div className="flex flex-col gap-6 p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-row items-start justify-between gap-3">
                        <div className="flex flex-row gap-3">
                            <div className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] shrink-0 border border-[#C8C5CD]/30 rounded-lg bg-[#1C1B1D] flex items-center justify-center">
                                <div className="h-3 w-3 bg-white rounded-sm" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <p className="text-xl sm:text-2xl font-bold text-[#1C1B1D] leading-tight">
                                    {job.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                                    <span className="font-medium text-gray-600">{job.company}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1">
                                        {/* <img src={locationPinIcon} alt="location" className="h-3.5 w-3.5" /> */}
                                        {job.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action icons*/}
                        <div className="hidden sm:flex flex-row gap-2 shrink-0">
                            <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#B71D3F] hover:border-[#B71D3F]/30 transition-colors">
                                {/* <img src={bookmarkIcon} alt="save" className="h-4 w-4" /> */}
                            </button>
                            <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#B71D3F] hover:border-[#B71D3F]/30 transition-colors">
                                {/* <img src={shareIcon} alt="share" className="h-4 w-4" /> */}
                            </button>
                        </div>
                    </div>

                    {/* Salary / Job type / Apply */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
                        <div className="flex flex-row gap-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Salary
                                </p>
                                <p className="text-[#B71D3F] font-bold text-sm sm:text-base">
                                    {job.salary} / year
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Job Type
                                </p>
                                <p className="text-[#1C1B1D] font-semibold text-sm sm:text-base">
                                    {job.tags?.[1] || "Full-time"}
                                </p>
                            </div>
                        </div>

                        <button className="w-full sm:w-auto bg-[#1C1B1D] hover:bg-[#B71D3F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                            Apply Now
                        </button>
                    </div>

                    {/* Job Overview */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#B71D3F] rounded-full" />
                            <p className="font-semibold text-[#1C1B1D]">Job Overview</p>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {job.overview ||
                                `We are looking for a ${job.title} to join our team at ${job.company}. You will work closely with cross-functional teams to solve complex problems through thoughtful, elegant solutions. This role requires strong expertise and a passion for craftsmanship.`}
                        </p>
                    </div>

                    {/* Responsibilities */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#B71D3F] rounded-full" />
                            <p className="font-semibold text-[#1C1B1D]">Responsibilities</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {(job.responsibilities || [
                                "Lead the end-to-end delivery of high-impact features.",
                                "Partner with cross-functional teams to ensure quality.",
                                "Contribute to internal documentation and best practices.",
                                "Conduct research to validate decisions and identify gaps.",
                            ]).map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    {/* <img src={checkIcon} alt="check" className="h-4 w-4 shrink-0 mt-0.5" /> */}
                                    <span className="text-[#B71D3F] shrink-0 mt-0.5 text-sm">✓</span>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#B71D3F] rounded-full" />
                            <p className="font-semibold text-[#1C1B1D]">Requirements</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {(job.requirements || [
                                "5+ years of experience in a related field.",
                                "Portfolio or track record showcasing strong skills.",
                                "Experience working at scale in a fast-paced team.",
                                "Excellent communication and storytelling abilities.",
                            ]).map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    {/* <img src={starIcon} alt="star" className="h-4 w-4 shrink-0 mt-0.5" /> */}
                                    <span className="text-[#B71D3F] shrink-0 mt-0.5 text-sm">★</span>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About company */}
                    <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
                        <div className="flex flex-row gap-3 items-center">
                            <div className="h-10 w-10 rounded-lg bg-[#1C1B1D] flex items-center justify-center shrink-0">
                                <div className="h-2.5 w-2.5 bg-white rounded-sm" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-[#1C1B1D] text-sm">
                                    About {job.company}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Software Development • 1,000–5,000 employees
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {job.about ||
                                `${job.company} builds products used by millions of people around the world. We're on a mission to make great tools accessible to everyone.`}
                        </p>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-[#1C1B1D] w-fit hover:gap-2.5 transition-all">
                            View Company Profile
                            {/* <img src={arrowIcon} alt="arrow" className="h-3.5 w-3.5" /> */}
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetailModal