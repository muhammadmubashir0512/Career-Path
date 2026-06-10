import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

const JobDetail = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('myjobs')

    useEffect(() => {
        const fetchJobDetail = async () => {
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
                    const foundJob = jobsArray.find(job => job.id === parseInt(jobId))
                    
                    if (foundJob) {
                        setJob(foundJob)
                    } else {
                        toast.error("Job not found")
                        navigate('/recruiter/jobs')
                    }
                } else {
                    toast.error("No jobs found")
                    navigate('/recruiter/jobs')
                }
            } catch (error) {
                console.error("Error fetching job details:", error)
                toast.error("Failed to load job details")
            } finally {
                setLoading(false)
            }
        }

        fetchJobDetail()
    }, [jobId, navigate])

    // const handleShare = () => {
    //     navigator.clipboard.writeText(window.location.href)
    //     toast.success("Job link copied to clipboard!")
    // }

    const handleEdit = () => {
        navigate(`/recruiter/edit-job/${job?.id}`)
    }

    const handleViewApplications = () => {
        navigate(`/recruiter/applications/${job?.id}`)
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin'></div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-gray-500'>Job not found</p>
                    <button onClick={() => navigate('/recruiter/jobs')} className='mt-4 text-[#E94560] hover:underline'>
                        Back to Jobs
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Toaster position="top-right" />
            
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className='hidden md:block'>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>

            {/* Mobile Topbar */}
            <Topbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content - Mobile First */}
            <div className='md:ml-[220px] pt-20 md:pt-5'>
                <div className='max-w-5xl mx-auto px-4 py-4 md:py-8'>
                    
                    {/* Breadcrumb / Navigation */}
                    <div className='mb-4 md:mb-6'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                            <div className='flex items-center gap-2 text-sm'>
                                <button 
                                    onClick={() => navigate('/recruiter/jobs')}
                                    className='text-gray-500 hover:text-[#E94560] transition-colors cursor-pointer'
                                >
                                    My Jobs
                                </button>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className='text-gray-800 font-medium truncate'>{job.title}</span>
                            </div>
                            <div className='flex gap-2'>
                                <button 
                                    onClick={handleEdit}
                                    className='px-4 py-1.5 border border-[#E94560] text-[#E94560] rounded-lg text-sm font-medium hover:bg-[#E94560] hover:text-white transition-all duration-200 cursor-pointer'
                                >
                                    Edit Job
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
                        
                        {/* Header Section */}
                        <div className='p-4 md:p-8 border-b border-gray-200'>
                            <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                                <div>
                                    <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                                        {job.title}
                                    </h1>
                                    <div className='flex flex-wrap items-center gap-2 md:gap-3 text-gray-600 text-sm'>
                                        <span className='flex items-center gap-1'>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            {job.companyName || "..."}
                                        </span>
                                        <span className='w-1 h-1 bg-gray-300 rounded-full hidden sm:block'></span>
                                        <span className='flex items-center gap-1'>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location || "..."}
                                        </span>
                                        <span className='w-1 h-1 bg-gray-300 rounded-full hidden sm:block'></span>
                                        <span className='px-2 py-0.5 bg-[#E94560]/10 text-[#E94560] rounded-full text-xs font-medium'>
                                            {job.jobType || "Full-time"}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                            ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {job.status || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className='p-4 md:p-8 space-y-6 md:space-y-8'>
                            
                            {/* Job Description */}
                            <div>
                                <h2 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>Job Description</h2>
                                <div className='text-gray-600 text-sm md:text-base leading-relaxed prose max-w-none'
                                    dangerouslySetInnerHTML={{ __html: job.description || "TechFlow Solutions is seeking an experienced professional to lead our front-end evolution. You will be responsible for architecting high-performance web applications, mentoring junior engineers, and driving technical excellence across our product suite." }} />
                            </div>

                            {/* Requirements */}
                            <div>
                                <h2 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>Key Requirements</h2>
                                <div className='text-gray-600 text-sm md:text-base leading-relaxed prose max-w-none'
                                    dangerouslySetInnerHTML={{ __html: job.requirements || "5+ years of professional experience with React and modern JavaScript. Deep expertise in TypeScript, State Management, and Hooks. Proven track record of optimizing web performance." }} />
                            </div>

                            {/* Skills Required */}
                            <div>
                                <h2 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>Skills Required</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {job.skills && job.skills.length > 0 ? (
                                        job.skills.map((skill, index) => (
                                            <span key={index} className='px-2 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm'>
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        ['React', 'Node.js', 'TypeScript', 'AWS', 'Git'].map((skill, index) => (
                                            <span key={index} className='px-2 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm'>
                                                {skill}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Benefits & Perks */}
                            <div>
                                <h2 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>Benefits & Perks</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {job.benefits && job.benefits.length > 0 ? (
                                        job.benefits.map((benefit, index) => (
                                            <span key={index} className='px-2 md:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs md:text-sm'>
                                                {benefit}
                                            </span>
                                        ))
                                    ) : (
                                        ['Competitive Salary', 'Premium Health', 'Remote Setup'].map((benefit, index) => (
                                            <span key={index} className='px-2 md:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs md:text-sm'>
                                                {benefit}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='p-4 md:p-8 border-t border-gray-200 bg-gray-50'>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <button 
                                    onClick={handleViewApplications}
                                    className='w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-[#E94560] hover:bg-[#eb5b73] text-white font-medium rounded-lg transition-all duration-200 cursor-pointer text-sm md:text-base'
                                >
                                    View Applications
                                </button>
                            </div>
                            <p className='text-xs text-gray-400 mt-4'>
                                Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetail