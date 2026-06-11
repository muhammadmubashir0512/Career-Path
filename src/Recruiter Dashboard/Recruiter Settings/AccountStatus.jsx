import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { auth } from '../../firebase/config'
import { useNavigate } from 'react-router'
import toast, { Toaster } from 'react-hot-toast'

const AccountStatus = () => {
    const [currentStatus, setCurrentStatus] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    const statusConfig = {
        PENDING:   { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending Verification' },
        APPROVED:  { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Approved' },
        REJECTED:  { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
    }

    useEffect(() => {
        const GetStatus = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate("/login")
                    return
                }
                
                const statusData = await getDoc(doc(db, "users", user.uid))
                if (statusData.exists()) {
                    const data = statusData.data()
                    console.log("User Data......", data)
                    console.log("Verification Status.....", data.approvalStatus)
                    setCurrentStatus(data.approvalStatus || 'PENDING')
                }
            } catch (error) {
                console.error("Error:", error)
            }
        }

        GetStatus()
    }, [navigate])

    // Delete Account permanently
    

    const handleCancelDelete = () => {
        setShowDeleteModal(false)
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            const user = auth.currentUser
            if (!user) return

            await deleteDoc(doc(db, "users", user.uid))
            await deleteDoc(doc(db, "Jobs", user.uid))
            await user.delete()
            
            toast.success("Account deleted successfully")
            setTimeout(() => navigate("/"), 1500)
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Failed to delete account")
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const getStatusConfig = () => {
        return statusConfig[currentStatus] || statusConfig.PENDING
    }

    const statusInfo = getStatusConfig()

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
            <Toaster position="top-right" />
            <div className="pt-20 md:pt-5 px-4 sm:px-5 md:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 sm:text-base">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Status Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-base font-semibold text-gray-800">Account Verification Status</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Your current verification status</p>
                    </div>
                    
                    <div className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Status Badge */}
                            <div className="flex flex-row items-center gap-3">
                                <p className="text-sm font-medium text-gray-600">Profile Status</p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bg}`}>
                                    <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                                    <span className={`text-sm font-semibold ${statusInfo.text}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            </div>

                            {/* Message according to profile status*/}
                            {currentStatus === 'PENDING' && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-xs text-amber-700">
                                        Your account is pending verification. Our team will review your documents within 1-2 business days.
                                    </p>
                                </div>
                            )}
                            {currentStatus === 'APPROVED' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-xs text-green-700">
                                        Your account has been verified! You can now post jobs and access all features.
                                    </p>
                                </div>
                            )}
                            {currentStatus === 'REJECTED' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-xs text-red-700">
                                        Your verification was rejected. Please contact support for more information.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Personal Profile Settings */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-800">Personal Profile</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-500">Manage your account preferences and security settings.</p>
                            <button 
                                onClick={() => navigate('/recruiter/profilesettings')}
                                className="mt-3 text-sm text-[#E94560] hover:underline cursor-pointer"
                            >
                                Edit Personal Profile
                            </button>
                        </div>
                    </div>

                    {/* Company Profile Settings */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-800">Company Profile</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-500">Manage your email and notification preferences.</p>
                            <button 
                                onClick={() => navigate('/recruiter/companysettings')}
                                className="mt-3 text-sm text-[#E94560] hover:underline cursor-pointer"
                            >
                                Edit Company Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete Account Section */}
                <div className="mt-6">
                    <div className="bg-red-50 rounded-xl border border-red-200 shadow-sm overflow-hidden">
                        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-red-200 bg-gradient-to-r from-red-50 to-white">
                            <h3 className="text-sm font-semibold text-red-800">Delete Account</h3>
                            <p className="text-xs text-red-500 mt-0.5">Permanently delete your account and all associated data</p>
                        </div>
                        
                        <div className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                        
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">This action cannot be undone</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Deleting your account will permanently remove all your jobs, applications, 
                                                and personal information from our system.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete Account Confirmation (Popup) ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                        onClick={handleCancelDelete}
                    />
                    
                    {/* Modal */}
                    <div className="relative min-h-screen flex items-center justify-center p-4">
                        <div className="relative bg-[#0f1729] rounded-2xl w-full max-w-[380px] shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <h3 className="text-white text-lg font-semibold">Delete Account</h3>
                                <button
                                    onClick={handleCancelDelete}
                                    className="text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Body */}
                            <div className="p-5">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                            fill="none" stroke="#E94560" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-white/70 text-center text-sm">
                                    Are you sure you want to delete your account?
                                </p>
                                <p className="text-white/40 text-center text-xs mt-1">
                                    This action cannot be undone. All your jobs, applications, and personal data will be permanently removed.
                                </p>
                            </div>
                            
                            {/* Confirmations Buttons */}
                            <div className="flex gap-3 p-5 pt-0">
                                <button
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountStatus