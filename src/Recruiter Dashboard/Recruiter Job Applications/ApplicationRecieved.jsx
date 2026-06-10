import React, { useState, useEffect } from 'react'
import {toast,Toaster} from 'react-hot-toast'
import { StatusProvider } from './ApplicationDetail'
import { useStatus } from './ApplicationDetail'
import { applicationsData } from './ApplicationData'

const ApplicationReceived = ({ onSelect }) => {
    const {currentStatus} = useStatus()
    const [statusFilter, setStatusFilter] = useState("All")
    const [searchval, setSearchval] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Get status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'Shortlisted': return 'bg-yellow-100 text-yellow-700'
            case 'Interview': return 'bg-blue-100 text-blue-700'
            case 'Pending': return 'bg-gray-100 text-gray-700'
            case 'Hired': return 'bg-green-100 text-green-700'
            case 'Rejected': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    // Filter logic
    const filteredApplications = applicationsData.filter((app) => {
        const matchesSearch = searchval === '' || 
            app.fullName?.toLowerCase().includes(searchval.toLowerCase()) ||
            app.position?.toLowerCase().includes(searchval.toLowerCase()) ||
            app.department?.toLowerCase().includes(searchval.toLowerCase())
        
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchval, statusFilter])

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const Shorlistedlength = applicationsData.filter((app)=>app.status === "Shortlisted").length
    const Interviewlength = applicationsData.filter((app)=>app.status === "Interview").length
    const Hiredlength = applicationsData.filter((app)=>app.status === "Hired").length

    return (
        <div className='min-h-screen bg-gray-50 mt-5'>

        <Toaster position="top-right" />
      
        {/* Heading */}
        <div className="flex flex-col gap-1 mb-5">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">Applications</p>
            <p className="text-sm text-gray-400">Manage and review all received applications</p>
        </div>
    
        {/* Stats Cards - Mobile: 2 columns, Tablet+: 4 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 md:mb-6">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-gray-800 sm:text-2xl">{applicationsData.length}</p>
                        <p className="text-xs text-gray-500">Total Applications</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-amber-600 sm:text-2xl">{Shorlistedlength}</p>
                        <p className="text-xs text-gray-500">Shorlisted</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-rose-600 sm:text-2xl">{Interviewlength}</p>
                        <p className="text-xs text-gray-500">Interview</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-xl font-bold text-emerald-600 sm:text-2xl">{Hiredlength}</p>
                        <p className="text-xs text-gray-500">Hired</p>
                    </div>
                    
                </div>

            {/* Filter Tabs */}
            <div className="overflow-x-auto mb-5">
                <div className="flex gap-2 min-w-max">
                    {['All', 'Shortlisted', 'Interview', 'Hired', 'Pending', 'Rejected'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                                ${statusFilter === filter 
                                    ? 'bg-[#E94560] text-white shadow-md' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            {filter}
                            {filter !== 'All' && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                    statusFilter === filter ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                    {applicationsData.filter(a => a.status === filter).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="search" 
                    value={searchval}
                    onChange={(e) => setSearchval(e.target.value)}
                    placeholder="Search by name, position, or department..." 
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-200 shadow-sm"
                />
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3 mb-6">
                {currentItems.length > 0 ? (
                    currentItems.map((app) => (
                        <div 
                            key={app.id}
                            onClick={() => onSelect(app.id)}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#E94560] transition-all duration-200 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E94560] to-[#BB1732] flex items-center justify-center text-white font-semibold">
                                        {app.initials}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800">{app.fullName}</h3>
                                        <p className="text-sm text-gray-500">{app.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs">Position</p>
                                    <p className="text-gray-700 font-medium">{app.position}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Department</p>
                                    <p className="text-gray-700 font-medium">{app.department}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Experience</p>
                                    <p className="text-gray-700 font-medium">{app.experience}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Applied</p>
                                    <p className="text-gray-700 font-medium">{app.appliedDaysAgo}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No applications found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-10 px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="col-span-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</p>
                    </div>
                    <div className="col-span-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {currentItems.length > 0 ? (
                        currentItems.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => onSelect(app.id)} 
                                className="grid grid-cols-10 cursor-pointer px-6 py-4 items-center hover:bg-gray-50 transition-all duration-200">
                                {/* Applicant - col 1 */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E94560] to-[#BB1732] flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
                                        {app.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{app.fullName}</p>
                                        <p className="text-xs text-gray-400 truncate">{app.email}</p>
                                    </div>
                                </div>

                                {/* Position - col 2 */}
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-700 truncate">{app.position}</p>
                                </div>

                                {/* Department - col 3 */}
                                <div className="col-span-2">
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        {app.department}
                                    </div>
                                </div>

                            
                                {/* Applied Date - col 5 */}
                                <div className="col-span-2">
                                    <div>
                                        <p className="text-sm text-gray-700">{app.appliedDate}</p>
                                        <p className="text-xs text-gray-400">{app.appliedDaysAgo}</p>
                                    </div>
                                </div>

                                {/* Status - col 6 */}
                                <div className="col-span-1">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No applications found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {filteredApplications.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                            ${currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E94560]'}`}
                    >
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1
                            // Show only 5 pages at a time
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                            ${currentPage === pageNum 
                                                ? 'bg-[#E94560] text-white shadow-md' 
                                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            }
                            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return <span key={index} className="text-gray-400">...</span>
                            }
                            return null
                        })}
                    </div>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                            ${currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E94560]'}`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Results Count */}
            <div className="text-center mt-4">
                <p className="text-xs text-gray-400">
                    Showing {currentItems.length} of {filteredApplications.length} applications
                </p>
            </div>
        </div>
    )
}

export default ApplicationReceived