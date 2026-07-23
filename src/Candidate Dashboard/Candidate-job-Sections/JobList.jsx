import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { jobs } from "./JobsData"
import location from "../../assets/location.svg"
import company from "../../assets/company.png"
import JobDetailModal from "./JobDetailModal"

const JobsList = () => {
    const [selectedJob, setSelectedJob] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleJobClick = (job) => {
        setSelectedJob(job)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="flex flex-col gap-5 pt-20 md:pt-5">
            <Toaster position="top-right" />

            {/* Heading */}
            <div className="flex flex-col gap-1">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Find Your Next Job
                </p>
                <p className="text-sm text-gray-400">
                    Browse through hundreds of curated job openings from top companies and find the perfect match for your skills.
                </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        onClick={() => handleJobClick(job)}
                        className="relative flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                    >
                        {/* New badge */}
                        {/* {job.isNew && (
                            <div className="absolute top-3 right-3 bg-[#B71D3F]/10 text-[#B71D3F] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                                New
                            </div>
                        )} */}

                        <div className="flex flex-row gap-3">
                            <div className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] shrink-0 border border-[#C8C5CD]/30 p-2 rounded-lg">
                                <img
                                    src={company}
                                    alt={`${job.company} logo`}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* job heading */}
                            <div className="flex flex-col gap-1.5 min-w-0 pr-6">
                                <p className="text-base sm:text-lg md:text-[20px] font-semibold text-[#1C1B1D] truncate">
                                    {job.title}
                                </p>
                                <p className="text-[#47464C] text-sm sm:text-[16px] font-medium truncate">
                                    {job.company}
                                </p>
                                <div className="flex flex-row gap-2 items-center">
                                    <img src={location} alt="" className="shrink-0" />
                                    <p className="text-sm sm:text-[16px] font-normal text-[#78767D] truncate">
                                        {job.location}
                                    </p>
                                </div>
                                <p className="text-[#B71D3F] text-sm sm:text-[16px] font-bold">
                                    {job.salary}
                                </p>
                            </div>
                        </div>

                        {/* Bottom — tags */}
                        <div className="flex flex-row flex-wrap gap-2">
                            {job.tags.map((tag, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-full bg-[#E5E1E3] py-0.5 px-3"
                                >
                                    <p className="text-[#47464C] text-[12px] font-semibold">
                                        {tag}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Detail Modal */}
            <JobDetailModal
                job={selectedJob}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    )
}

export default JobsList