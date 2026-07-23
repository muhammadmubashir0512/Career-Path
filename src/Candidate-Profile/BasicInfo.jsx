import React, { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast, Toaster } from 'react-hot-toast'

const CandidateBasicInfo = () => {
    const navigate = useNavigate()
    const [logoPreview, setLogoPreview] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm()

    useEffect(() => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("Please login first")
                navigate("/login")
                return
            }
        } catch (error) {
            console.log("Error..", error)
        }
    }, [navigate])

    const onSubmit = async (data) => {
        setIsUploading(true)

        try {
            const user = auth.currentUser

            const userDocRef = doc(db, "users", user.uid)
            const userDoc = await getDoc(userDocRef)

            const updateData = {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                location: data.location,
                onboardingStep: 1,
                updatedAt: new Date().toISOString(),
                userType: 'candidate'
            }

            // Add profile picture if exists
            if (logoPreview) {
                updateData.profilePicture = logoPreview
            }

            console.log("Updating with data:", updateData)

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    ...updateData,
                    email: user.email,
                    createdAt: new Date().toISOString()
                })
            } else {
                await updateDoc(userDocRef, updateData)
            }

            console.log("Update successful")
            toast.success("Candidate Basic information saved successfully!")

            reset()

            setTimeout(() => {
                navigate('/CandidateEducation')
            }, 500)

        } catch (error) {
            console.error("Error saving info:", error)
            toast.error(error.message || "Failed to save information")
        } finally {
            setIsUploading(false)
        }
    }

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size must be less than 2MB")
                return
            }

            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file")
                return
            }

            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeLogo = () => {
        setLogoPreview(null)
        setLogoFile(null)
    }

    return (
        <div className='w-full bg-gradient-to-br from-gray-50 to-white min-h-screen'>
            <Toaster position="top-right" />
            <div className='h-full flex flex-col gap-6 items-center justify-center px-4 py-6'>

                {/* Header */}
                <div className='text-center mb-2 flex flex-row gap-4 items-center'>
                    <p className='text-3xl font-bold text-black'>Career Path</p>
                    <button className='px-3 text-[14px] rounded-full bg-[#E6E7FC] font-semibold text-[#6373FE]'>Candidate</button>
                </div>

                {/* Step Indicator */}
                <div className='w-full max-w-2xl'>
                    <div className='flex flex-row justify-between items-center relative'>
                        <div className='absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0'></div>
                        <div className='absolute top-5 left-0 h-0.5 bg-[#E94560] transition-all duration-300 -z-0' style={{ width: '0%' }}></div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>1</div>
                            <p className='text-xs font-medium text-[#E94560]'>Basic Info</p>
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
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>5</div>
                            <p className='text-xs font-medium text-gray-500'>Resume & Links</p>
                        </div>

                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border border-gray-200 p-5 flex flex-col gap-7 bg-white w-full max-w-2xl'>

                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Basic Information</p>
                        <p className='text-[15px] font-normal text-gray-500'>Tell us about yourself</p>
                    </div>

                    {/* Upload Profile Picture Section */}
                    <div className='items-center flex flex-col justify-center'>
                        <div className='flex flex-col items-center gap-3'>
                            <div className='relative'>
                                <div className='w-24 h-24 rounded-full cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Profile" className='w-full h-full object-cover' />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                {logoPreview && (
                                    <button type="button" onClick={removeLogo} className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'>×</button>
                                )}
                            </div>
                            <div className='flex flex-col items-center'>
                                <label className='cursor-pointer bg-white border-2 border-gray-200 hover:bg-[#FAFBFC] text-[#0f1729] font-medium py-2 px-3 text-[12px] rounded-lg transition-all duration-200 inline-block'>
                                    Upload Profile Picture
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>
                                <p className='text-gray-400 text-xs mt-2'>PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className='space-y-5'>
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Full Name <span className='text-red-700'>*</span></label>
                            <input
                                type="text"
                                {...register('fullName', {
                                    required: "Full name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                                })}
                                placeholder="e.g., John Doe"
                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                            />
                            {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName.message}</p>}
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Phone Number <span className='text-red-700'>*</span></label>
                            <input
                                type="tel"
                                {...register('phoneNumber', {
                                    required: "Phone number is required",
                                    pattern: { value: /^[0-9+\-\s()]{10,15}$/, message: "Please enter a valid phone number" }
                                })}
                                placeholder="e.g., +1 234 567 8900"
                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                            />
                            {errors.phoneNumber && <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber.message}</p>}
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Bio <span className='text-red-700'>*</span></label>
                            <textarea
                                {...register('location', {
                                    minLength: { value: 2, message: "Location must be at least 2 characters" }
                                })}
                                placeholder="Tell us something about yourself"
                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                            />
                            {errors.bio && <p className='text-red-500 text-xs mt-1'>{errors.bio.message}</p>}
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Location</label>
                            <input
                                type="text"
                                {...register('location', {
                                    minLength: { value: 2, message: "Location must be at least 2 characters" }
                                })}
                                placeholder="e.g., Lahore, Pakistan"
                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                            />
                            {errors.location && <p className='text-red-500 text-xs mt-1'>{errors.location.message}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-row justify-end items-center pt-4 gap-4'>
                        <button type="button" onClick={() => navigate('/candidate/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>Skip for now</button>
                        <button type="submit" disabled={isSubmitting || isUploading} className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isSubmitting || isUploading ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CandidateBasicInfo