import React, { useState } from 'react'
import { db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast, Toaster } from 'react-hot-toast'


const CompanyInfo = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [companyLogoPreview, setCompanyLogoPreview] = useState(null)
    const [companyLogoFile, setCompanyLogoFile] = useState(null)
    const [registrationDocPreview, setRegistrationDocPreview] = useState(null)
    const [registrationDocFile, setRegistrationDocFile] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const handleCompanyLogoUpload = (e) => {
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
            
            setCompanyLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setCompanyLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeCompanyLogo = () => {
        setCompanyLogoPreview(null)
        setCompanyLogoFile(null)
    }

    const handleRegistrationDocUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
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
    }

    const removeRegistrationDoc = () => {
        setRegistrationDocPreview(null)
        setRegistrationDocFile(null)
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        
        try {
            const user = auth.currentUser
            if (!user) {
                toast.error("User not logged in")
                navigate('/login')
                return
            }

            // Check if company logo is uploaded (now mandatory)
            if (!companyLogoPreview) {
                toast.error("Company logo is required")
                setIsSubmitting(false)
                return
            }

            const companyInfo = {
                companyName: data.companyName,
                industry: data.industry,
                companySize: data.companySize,
                website: data.website,
                description: data.description,
                registrationNumber: data.registrationNumber,
                taxId: data.taxId,
                businessLicenseNumber: data.businessLicenseNumber,
                verified: false,
                verificationStatus: 'pending',
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            // Add company logo (mandatory)
            companyInfo.companyLogo = companyLogoPreview

            // Add registration document if uploaded
            if (registrationDocPreview) {
                companyInfo.registrationDocument = registrationDocPreview
            }

            await updateDoc(doc(db, "users", user.uid), {
                companyInfo: companyInfo,
                onboardingStep: 2,
                updatedAt: new Date()
            })

            toast.success("Company information saved! Awaiting verification.")
            navigate('/recruiterContact')
            
        } catch (error) {
            console.error("Error saving company info:", error)
            toast.error(error.message || "Failed to save information")
        } finally {
            setIsSubmitting(false)
        }
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
                        <div className='absolute top-5 left-0 h-0.5 bg-[#E94560] transition-all duration-300 -z-0' style={{ width: '50%' }}></div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className='text-xs font-medium text-[#E94560]'>Recruiter Details</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>2</div>
                            <p className='text-xs font-medium text-[#E94560]'>Company Details</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>3</div>
                            <p className='text-xs font-medium text-gray-500'>Contact Info</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border border-gray-200 p-5 flex flex-col gap-6 bg-white w-full max-w-2xl'>
                    
                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Company Information</p>
                        <p className='text-[15px] font-normal text-gray-500'>Tell us about your company for verification</p>
                    </div>

                    {/* Company Logo Upload Section - MANDATORY */}
                    <div className='items-center flex flex-col justify-center border-b border-gray-100 pb-4'>
                        <div className='flex flex-col items-center gap-3'>
                            <div className='relative'>
                                <div className='w-24 h-24 rounded-full cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'>
                                    {companyLogoPreview ? (
                                        <img src={companyLogoPreview} alt="Company Logo" className='w-full h-full object-cover' />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-4H7v4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6" />
                                        </svg>
                                    )}
                                </div>
                                {companyLogoPreview && (
                                    <button
                                        type="button"
                                        onClick={removeCompanyLogo}
                                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <div className='flex flex-col items-center'>
                                <label className='cursor-pointer bg-white border-2 border-gray-200 hover:bg-[#FAFBFC] text-[#0f1729] font-medium py-2 px-3 text-[12px] rounded-lg transition-all duration-200 inline-block'>
                                    Upload Company Logo *
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCompanyLogoUpload}
                                        className="hidden"
                                        required
                                    />
                                </label>
                                <p className='text-gray-400 text-xs mt-2'>PNG, JPG up to 2MB (Required)</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        {/* Basic Company Info */}
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Company Name *</label>
                            <input type="text" {...register('companyName', { required: "Company name is required" })} placeholder="e.g., Tech Solutions Inc." className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                            {errors.companyName && <p className='text-red-500 text-xs mt-1'>{errors.companyName.message}</p>}
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Industry *</label>
                                <select {...register('industry', { required: "Please select an industry" })} className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'>
                                    <option value="">Select industry</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.industry && <p className='text-red-500 text-xs mt-1'>{errors.industry.message}</p>}
                            </div>

                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Company Size</label>
                                <select {...register('companySize')} className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'>
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Website</label>
                            <input type="url" {...register('website')} placeholder="https://example.com" className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' />
                        </div>

                        {/* Verification Documents Section */}
                        <div className='border-t border-gray-200 pt-4 mt-2'>
                            <p className='text-[15px] font-semibold text-black mb-4'>Verification Documents</p>
                            
                            {/* Registration Number */}
                            <div className='mb-4'>
                                <label className='block text-gray-700 font-medium mb-2'>Company Registration Number *</label>
                                <input 
                                    type="text" 
                                    {...register('registrationNumber', { required: "Registration number is required for verification" })} 
                                    placeholder="e.g., 12345678-9"
                                    className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' 
                                />
                                {errors.registrationNumber && <p className='text-red-500 text-xs mt-1'>{errors.registrationNumber.message}</p>}
                            </div>

                            {/* Tax ID */}
                            <div className='mb-4'>
                                <label className='block text-gray-700 font-medium mb-2'>Tax ID / NTN Number *</label>
                                <input 
                                    type="text" 
                                    {...register('taxId', { required: "Tax ID is required for verification" })} 
                                    placeholder="e.g., 1234567-8"
                                    className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' 
                                />
                                {errors.taxId && <p className='text-red-500 text-xs mt-1'>{errors.taxId.message}</p>}
                            </div>

                            {/* Business License Number */}
                            <div className='mb-4'>
                                <label className='block text-gray-700 font-medium mb-2'>Business License Number</label>
                                <input 
                                    type="text" 
                                    {...register('businessLicenseNumber')} 
                                    placeholder="e.g., BL-2024-12345"
                                    className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' 
                                />
                            </div>

                            {/* Registration Document Upload */}
                            <div className='items-center flex flex-col justify-center border border-dashed border-gray-300 rounded-lg p-4 mt-2'>
                                <div className='flex flex-col items-center gap-3 w-full'>
                                    {registrationDocPreview ? (
                                        <div className='relative w-full'>
                                            <div className='bg-gray-100 rounded-lg p-4 text-center'>
                                                <p className='text-sm text-green-600 mb-2'>Document uploaded successfully</p>
                                                <p className='text-xs text-gray-500'>File ready for verification</p>
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
                                                Upload Registration Certificate
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={handleRegistrationDocUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className='text-gray-400 text-xs mt-2'>PDF, PNG, JPG up to 5MB (Recommended for faster verification)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Company Description */}
                        <div>
                            <label className='block text-gray-700 font-medium mb-2'>Company Description</label>
                            <textarea {...register('description')} rows="3" placeholder="Tell us about your company, mission, and values..." className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent resize-none' />
                        </div>
                    </div>

                    {/* Verification Note */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                        <p className='text-xs text-blue-700'>
                            ⚠️ <span className='font-semibold'>Verification Required:</span> Your company information will be verified by our team. 
                            This process usually takes 1-2 business days. You can continue using the platform while verification is pending.
                        </p>
                    </div>

                    <div className='flex flex-row justify-between items-center pt-4'>
                        <button type="button" onClick={() => navigate('/RecruiterProfile')} className='px-5 bg-white hover:bg-[#edeef0] text-gray-500 cursor-pointer border border-gray-200 font-semibold py-3 rounded-lg transition-all duration-200'>Previous</button>
                        <button type="button" onClick={() => navigate('/recruiter/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>Skip for now</button>
                        <button type="submit" disabled={isSubmitting}  className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isSubmitting ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanyInfo