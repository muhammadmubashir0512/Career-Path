import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'

const MyJobs = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchval, setSearchval] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const jobsPerPage = 10

    // Jobs Fetch from firebase
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

                // ── Deadline check
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                let hasExpiredJobs = false

                const updatedJobs = jobsArray.map(job => {
                    if (
                        job.status === 'Active' &&
                        job.deadline &&
                        new Date(job.deadline) < today
                    ) {
                        hasExpiredJobs = true
                        return { ...job, status: 'Expired' }
                    }
                    return job
                })

                if (hasExpiredJobs) {
                    await updateDoc(docRef, { jobs: updatedJobs })
                }

                const sortedJobs = [...updatedJobs].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                setJobs(sortedJobs)

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

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    // Status color function
    const getStatusColor = (status) => {
        switch(status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700'
            case 'Closed': return 'bg-rose-100 text-rose-700'
            case 'Expired': return 'bg-amber-100 text-amber-700'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    // Filter logic
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = searchval === '' || 
            job.title?.toLowerCase().includes(searchval.toLowerCase()) ||
            job.category?.toLowerCase().includes(searchval.toLowerCase())
        
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter
        const matchesType = typeFilter === 'All' || job.jobType === typeFilter
        
        return matchesSearch && matchesStatus && matchesType
    })

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage
    const indexOfFirstJob = indexOfLastJob - jobsPerPage
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchval, statusFilter, typeFilter])

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Filter counts
    const activeCount = jobs.filter(job => job.status === 'Active').length
    const closedCount = jobs.filter(job => job.status === 'Closed').length
    const expiredCount = jobs.filter(job => job.status === 'Expired').length

    // Handle job click
    const handleJobClick = (jobId) => {
        navigate(`/recruiter/job/${jobId}`)
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin'></div>
                <p className='mt-4 text-gray-500'>Loading jobs...</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
            <Toaster position="top-right" />
            
            {/* Mobile First Container */}
            <div className=" pt-20 md:pt-5">
                
                {/* Header Section - Mobile First */}
                <div className="mb-5 md:mb-6 lg:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                        My Jobs
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 sm:text-base">
                        Manage and track all your job postings
                    </p>
                </div>

                {/* Stats Cards - Mobile: 2 columns, Tablet+: 4 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 md:mb-6">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-gray-800 sm:text-2xl">{jobs.length}</p>
                        <p className="text-xs text-gray-500">Total Jobs</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-emerald-600 sm:text-2xl">{activeCount}</p>
                        <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-rose-600 sm:text-2xl">{closedCount}</p>
                        <p className="text-xs text-gray-500">Closed</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-amber-600 sm:text-2xl">{expiredCount}</p>
                        <p className="text-xs text-gray-500">Expired</p>
                    </div>
                </div>

                {/* Filter Tabs - Horizontal Scroll on Mobile */}
                <div className="overflow-x-auto pb-2 mb-4 md:mb-5">
                    <div className="flex gap-2 min-w-max">
                        <button 
                            onClick={() => setStatusFilter('All')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                                ${statusFilter === 'All' ? 'bg-[#E94560] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            All Jobs ({jobs.length})
                        </button>
                        <button 
                            onClick={() => setStatusFilter('Active')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                                ${statusFilter === 'Active' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            Active ({activeCount})
                        </button>
                        <button 
                            onClick={() => setStatusFilter('Closed')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                                ${statusFilter === 'Closed' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            Closed ({closedCount})
                        </button>
                        <button 
                            onClick={() => setStatusFilter('Expired')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                                ${statusFilter === 'Expired' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            Expired ({expiredCount})
                        </button>
                    </div>
                </div>

                {/* Search Bar - Full width on mobile */}
                <div className="relative mb-4 md:mb-5">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="search" 
                        value={searchval}
                        onChange={(e) => setSearchval(e.target.value)}
                        placeholder="Search by job title or category..." 
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                </div>

                {/* Mobile Card View - Visible on mobile, hidden on desktop */}
                <div className="block md:hidden space-y-3 mb-4">
                    {currentJobs.length > 0 ? (
                        currentJobs.map((job) => (
                            <div 
                                key={job.id} 
                                onClick={() => handleJobClick(job.id)}
                                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#E94560] transition-all duration-200 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-base font-semibold text-gray-800 flex-1">
                                        {job.title}
                                    </h3>
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                        {job.status || 'Active'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{job.category || 'N/A'}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                                    <span>{formatDate(job.createdAt)}</span>
                                    <span>{job.applicants || 0} applicants</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No jobs found</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-2 lg:gap-3 px-3 lg:px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicants</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted Date</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                        {currentJobs.length > 0 ? (
                            currentJobs.map((job) => (
                                <div 
                                    key={job.id} 
                                    onClick={() => handleJobClick(job.id)}
                                    className="grid grid-cols-6 gap-2 lg:gap-3 px-3 lg:px-4 py-3 cursor-pointer items-center hover:bg-gray-50 transition-all duration-200 group"
                                >
                                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#E94560] transition-colors">
                                        {job.title}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">{job.category || 'N/A'}</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                                            {job.applicants || 0}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">{formatDate(job.createdAt)}</p>
                                    <p className="text-sm text-gray-500">{formatDate(job.deadline)}</p>
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                            {job.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No jobs found</p>
                                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination - Mobile First */}
                {filteredJobs.length > jobsPerPage && (
                    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-5 md:mt-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer
                                ${currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E94560]'}`}
                        >
                            Prev
                        </button>
                        <div className="flex gap-1">
                            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = index + 1
                                } else if (currentPage <= 3) {
                                    pageNum = index + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + index
                                } else {
                                    pageNum = currentPage - 2 + index
                                }
                                
                                if (pageNum <= totalPages && pageNum > 0) {
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => goToPage(pageNum)}
                                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer
                                                ${currentPage === pageNum 
                                                    ? 'bg-[#E94560] text-white shadow-md' 
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer
                                ${currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E94560]'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyJobs