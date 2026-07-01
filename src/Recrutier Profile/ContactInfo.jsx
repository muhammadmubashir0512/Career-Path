import React, { useState } from 'react'
import { db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast, Toaster } from 'react-hot-toast'

const RecruiterContact = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        
        try {
            const user = auth.currentUser
            if (!user) {
                toast.error("User not logged in")
                navigate('/login')
                return
            }

            const contactInfo = {
                email: data.email,
                linkedin: data.linkedin,
                twitter: data.twitter,
                officeAddress: data.officeAddress,
                updatedAt: new Date().toISOString()
            }

            await updateDoc(doc(db, "users", user.uid), {
                contactInfo: contactInfo,
                onboardingStep: 3,
                approvalStatus: 'PENDING',
                submittedAt: new Date(),
                updatedAt: new Date()
            })

            toast.success("Profile submitted for approval!")
            setShowApprovalModal(true)
            reset()
            
        } catch (error) {
            console.error("Error saving contact info:", error)
            toast.error(error.message || "Failed to save contact information")
        } finally {
            setIsSubmitting(false)
        }
    }

    const goToDashboard = () => {
        setShowApprovalModal(false)
        navigate('/recruiter/dashboard')
    }

    return (
        <div className='w-full bg-gradient-to-br from-gray-50 to-white min-h-screen'>
            <Toaster position="top-right" />
            <div className='h-full flex flex-col gap-6 items-center justify-center px-4 py-6'>
                
                <div className='text-center mb-2 flex flex-row gap-4 items-center'>
                    <p className='text-3xl font-bold text-black'>Career Path</p>
                    <button className='px-3 text-[14px] rounded-full bg-[#E6E7FC] font-semibold text-[#6373FE]'>Recruiter</button>
                </div>

                {/* Step Indicator */}
                <div className='w-full max-w-2xl'>
                    <div className='flex flex-row justify-between items-center relative'>
                        <div className='absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0'></div>
                        <div className='absolute top-5 left-0 right-0 h-0.5 bg-[#E94560] -z-0'></div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className='text-xs font-medium text-[#E94560]'>Recruiter Details</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className='text-xs font-medium text-[#E94560]'>Company Details</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>3</div>
                            <p className='text-xs font-medium text-[#E94560]'>Contact Info</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border border-gray-200 p-5 flex flex-col gap-6 bg-white w-full max-w-2xl'>
                    
                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Contact Information</p>
                        <p className='text-[15px] font-normal text-gray-500'>How can candidates reach you?</p>
                    </div>

                    <div className='space-y-5'>
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Email Address *</label>
                            <input type="email" {...register('email', { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Please enter a valid email address" } })} placeholder="e.g., john@company.com" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>LinkedIn Profile</label>
                            <input type="url" {...register('linkedin')} placeholder="https://linkedin.com/in/username" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Twitter/X Profile</label>
                            <input type="url" {...register('twitter')} placeholder="https://twitter.com/username" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Office Address</label>
                            <textarea {...register('officeAddress')} rows="3" placeholder="Company office address (optional)" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent resize-none' />
                        </div>
                    </div>

                    <div className='flex flex-row justify-between items-center pt-4'>
                        <button type="button" onClick={() => navigate('/companyInfo')} className='px-5 bg-white hover:bg-[#edeef0] text-gray-500 cursor-pointer border border-gray-200 font-semibold py-3 rounded-lg transition-all duration-200'>Previous</button>
                        <button type="button" onClick={() => navigate('/recruiter/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>Skip for now</button>
                        <button type="submit" disabled={isSubmitting} className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Approval Pending Modal */}
            {showApprovalModal && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl max-w-md w-full p-6 shadow-xl'>
                        <div className='flex justify-center mb-4'>
                            <div className='w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center'>
                                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className='text-2xl font-bold text-center text-gray-800 mb-2'>Profile Under Review</h2>

                        <div className='text-center mb-6'>
                            <p className='text-gray-600 mb-2'>Your recruiter profile has been successfully submitted!</p>
                            <p className='text-gray-500 text-sm'>Our admin team will review your information and verify your profile within <span className='font-semibold text-[#E94560]'>24-48 hours</span>.</p>
                        </div>

                        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6'>
                            <div className='flex items-center gap-2 justify-center'>
                                <div className='w-2 h-2 rounded-full bg-yellow-500 animate-pulse'></div>
                                <span className='text-yellow-700 font-medium'>Status: Pending Approval</span>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <button onClick={goToDashboard} className='w-full bg-[#E94560] hover:bg-[#eb5b73] text-white font-semibold py-3 rounded-lg transition-all duration-200'>Go to Dashboard</button>
                            <button onClick={goToDashboard} className='w-full border border-gray-300 text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-all duration-200'>Maybe Later</button>
                        </div>

                        <p className='text-center text-gray-400 text-xs mt-4'>You will receive an email once your profile is approved</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecruiterContact