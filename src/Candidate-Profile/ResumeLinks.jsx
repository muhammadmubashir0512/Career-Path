import React, { useState } from 'react'
import { db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast, Toaster } from 'react-hot-toast'


const CandidateResume = () => {
    const navigate = useNavigate()
    const [registrationDocPreview, setRegistrationDocPreview] = useState(null)
    const [registrationDocFile, setRegistrationDocFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm()

    const handleRegistrationDocUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            toast.error("Please upload resume in PDF format")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB")
            return
        }

        setRegistrationDocFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setRegistrationDocPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const removeRegistrationDoc = () => {
        setRegistrationDocPreview(null)
        setRegistrationDocFile(null)
    }

    const onSubmit = async (data) => {
        if (!registrationDocPreview) {
            toast.error("Please upload your resume")
            return
        }

        setIsUploading(true)
        try {
            const user = auth.currentUser
            if (!user) {
                toast.error("User not logged in")
                navigate('/login')
                return
            }

            const LinksData = {
                website: data.website || "",
                portfolio: data.PortfolioUrl || "",
                GitHub: data.GitHub || "",
                registrationDocument: registrationDocPreview,
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await updateDoc(doc(db, "users", user.uid), {
                ResumeLinks: LinksData,
                onboardingStep: 5,
                updatedAt: new Date()
            })

            toast.success("Resume & links saved successfully!")
            setShowApprovalModal(true)
            navigate('/CandidateJobPreference')

        } catch (error) {
            console.error("Error saving info:", error)
            toast.error(error.message || "Failed to save information")
        } finally {
            setIsUploading(false)
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

                {/* Header */}
                <div className='text-center mb-2 flex flex-row gap-4 items-center'>
                    <p className='text-3xl font-bold text-black'>Career Path</p>
                    <button type="button" className='px-3 text-[14px] rounded-full bg-[#E6E7FC] font-semibold text-[#6373FE]'>Candidate</button>
                </div>

                {/* Step Indicator */}
                <div className='w-full max-w-2xl'>
                    <div className='flex flex-row justify-between items-center relative'>
                        <div className='absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0'></div>
                        <div className='absolute top-5 left-0 h-0.5 bg-[#E94560] transition-all duration-300 -z-0' style={{ width: '0%' }}></div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>1</div>
                            <p className='text-xs font-medium text-gray-500'>Basic Info</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>2</div>
                            <p className='text-xs font-medium text-gray-500'>Education</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>3</div>
                            <p className='text-xs font-medium text-gray-500'>Skills</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>4</div>
                            <p className='text-xs font-medium text-gray-500'>Experience</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>5</div>
                            <p className='text-xs font-medium text-[#E94560]'>Resume & Links</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border border-gray-200 p-5 flex flex-col gap-6 bg-white w-full max-w-2xl'>

                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Resume & Links</p>
                        <p className='text-[15px] font-normal text-gray-500'>Upload your resume and add your professional links</p>
                    </div>

                    <div className='space-y-7'>

                        {/* Portfolio URL */}
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Portfolio URL <span className='text-gray-400 text-sm font-normal'>(Optional)</span></label>
                            <input type="url" {...register('PortfolioUrl')} placeholder="https://portfolio.com" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        {/* Website */}
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Website <span className='text-gray-400 text-sm font-normal'>(Optional)</span></label>
                            <input type="url" {...register('website')} placeholder="https://example.com" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        {/* GitHub */}
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>GitHub <span className='text-gray-400 text-sm font-normal'>(Optional)</span></label>
                            <input type="url" {...register('GitHub')} placeholder="https://github.com/username" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        {/* Resume Upload */}
                        <div className='border-t border-gray-200 pt-4'>
                            <p className='text-[15px] font-semibold text-black mb-4'>Upload Resume <span className='text-red-500'>*</span></p>

                            <div className='items-center flex flex-col justify-center border border-dashed border-gray-300 rounded-lg p-4'>
                                <div className='flex flex-col items-center gap-3 w-full'>
                                    {registrationDocPreview ? (
                                        <div className='relative w-full'>
                                            <div className='bg-gray-100 rounded-lg p-4 text-center'>
                                                <p className='text-sm text-green-600 mb-2'>Resume uploaded successfully</p>
                                                <p className='text-xs text-gray-500'>{registrationDocFile?.name}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeRegistrationDoc}
                                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <label className='cursor-pointer bg-white border-2 border-gray-200 hover:bg-[#FAFBFC] text-[#0f1729] font-medium py-2 px-4 text-[14px] rounded-lg transition-all duration-200 inline-block'>
                                                Upload Your Resume
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleRegistrationDocUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className='text-gray-400 text-xs mt-2'>Only PDF format accepted (Max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-row justify-end items-center pt-4 gap-4'>
                        <button type="button" onClick={() => navigate('/candidate/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>
                            Skip for now
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isSubmitting || isUploading ? 'Saving...' : 'Continue'}
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

export default CandidateResume