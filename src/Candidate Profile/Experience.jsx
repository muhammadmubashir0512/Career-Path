import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore"
import { db, auth } from "../firebase/config"
import { useForm, useFieldArray } from "react-hook-form"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "react-hot-toast"

const EmploymentType = [
    "Part-Time",
    "Full-Time",
    "Internship",
    "Freelance",
]

const emptyExperience = { jobTitle: "", CompanyName: "", EmploymentType: "", Responsibilties: "", StartDate: "", EndDate: "" }

const CandidateExperience = () => {

    const navigate = useNavigate()
    const [isSaved, setIsSaved] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const {
        control,
        register,
        trigger,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { experience: [emptyExperience] }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience"
    })

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


    const saveExperience = async (index) => {
        const valid = await trigger(`experience.${index}`)
        if (!valid) return

        const data = getValues(`experience.${index}`)

        setIsSaved(prev => [
            ...prev,
            { ...data, id: crypto.randomUUID() }
        ])

        remove(index)
    }

    const deleteExperience = (id) => {
        setIsSaved(prev => prev.filter((edu) => edu.id !== id))
    }

    const addExperience = () => {
        append(emptyExperience)
    }

    const onSubmit = async () => {
        if (isSaved.length === 0) {
            toast.error("Please add at least one experience entry")
            return
        }

        setIsUploading(true)
        try {
            const user = auth.currentUser

            if (!user) {
                toast.error("Please login first")
                navigate("/login")
                return
            }

            const userDocRef = doc(db, "users", user.uid)
            const userDoc = await getDoc(userDocRef)

            const updateData = {
                experience: isSaved,
                onboardingStep: 4,
                updatedAt: new Date().toISOString(),
            }

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    ...updateData,
                    email: user.email,
                    createdAt: new Date().toISOString()
                }, { merge: true })
            } else {
                await updateDoc(userDocRef, updateData)
            }

            console.log("Update successful")
            toast.success("Candidate Experience information saved successfully!")

            setTimeout(() => {
                navigate('/CandidateResume')
            }, 500)
        } catch (error) {
            console.error("Error saving info:", error)
            toast.error(error.message || "Failed to save information")
        } finally {
            setIsUploading(false)
        }
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
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>4</div>
                            <p className='text-xs font-medium text-[#E94560]'>Experience</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>5</div>
                            <p className='text-xs font-medium text-gray-500'>Resume & Links</p>
                        </div>

                        <div className='flex flex-col gap-2 items-center relative z-10 bg-white px-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 text-gray-500 border-2 border-gray-300 flex items-center justify-center text-sm font-bold'>6</div>
                            <p className='text-xs font-medium text-gray-500'>Job Preference</p>
                        </div>
                    </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-5 flex flex-col gap-6 bg-white w-full max-w-2xl px-5'>
                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Experience</p>
                        <p className='text-[15px] font-normal text-gray-500'>Add your work experience that highlight your professional background.</p>
                    </div>

                    {/* Saved experience Cards */}
                    {
                        isSaved.map((edu) => (
                            <div key={edu.id} className="w-full">
                                <div className="w-full flex-col gap-7 justify-between border border-gray-200 rounded-lg bg-white p-5 hover:shadow-md transition-shadow duration-200">
                                    <div className="w-full flex justify-end">
                                        <div onClick={() => deleteExperience(edu.id)} className="bg-red-500 text-center w-[70px] text-white rounded-lg py-2 px-3 hover:bg-red-600 transition-colors cursor-pointer mb-4">
                                            Delete
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between">
                                        {/* Left Column */}
                                        <div className="flex flex-col gap-3 items-start">
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Job Title:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.jobTitle || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Employment Type:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.EmploymentType || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Start Date:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.StartDate || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="flex flex-col gap-3 items-start mt-3 md:mt-0">
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Company Name:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.CompanyName || 'N/A'}</span>
                                            </div>

                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Responsibilties:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.Responsibilties || 'N/A'}</span>
                                            </div>

                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">End Date:</span>
                                                <span className="text-sm text-gray-500 font-medium">
                                                    {edu.currentlyWorking ? "Present" : edu.EndDate || 'N/A'}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }

                    {/* Open / unsaved experience sections */}
                    {
                        fields.map((field, index) => {

                            const currentlyWorking = watch(`experience.${index}.currentlyWorking`)

                            return (
                                <div key={field.id} className='space-y-7 rounded-lg border border-gray-200 p-5 flex flex-col bg-white w-full '>
                                    {/* jobTitle*/}
                                    <div>
                                        <label className='block text-gray-700 font-medium mb-2'>Job Title</label>
                                        <input
                                            type="text"
                                            {...register(`experience.${index}.jobTitle`, {
                                            })}
                                            placeholder="Enter Job Title"
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        >
                                        </input>
                                        {errors.experience?.[index]?.jobTitle && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].jobTitle.message}</p>}
                                    </div>

                                    {/* CompanyName */}
                                    <div>
                                        <label className='block text-gray-700 font-medium mb-2'>CompanyName</label>
                                        <input
                                            type="text"
                                            {...register(`experience.${index}.CompanyName`, {
                                            })}
                                            placeholder="Enter company name"
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        />
                                        {errors.experience?.[index]?.CompanyName && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].CompanyName.message}</p>}
                                    </div>

                                    {/* EmploymentType - dropdown */}
                                    <div>
                                        <label className='block text-gray-700 font-medium mb-2'>Employment Type</label>
                                        <select
                                            {...register(`experience.${index}.EmploymentType`, {
                                            })}
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        >
                                            <option value="">Select Employment Type</option>
                                            {EmploymentType.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        {errors.experience?.[index]?.EmploymentType && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].EmploymentType.message}</p>}
                                    </div>

                                    {/* Responsibilties */}
                                    <div>
                                        <label className='block text-gray-700 font-medium mb-2'>Responsibilties</label>
                                        <textarea
                                            {...register(`experience.${index}.Responsibilties`, {
                                            })}
                                            placeholder="Enter your responsibilities"
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        />
                                        {errors.experience?.[index]?.Responsibilties && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].Responsibilties.message}</p>}
                                    </div>

                                    <div className="flex flex-row gap-4 items-center w-full">
                                        {/* Start Date */}
                                        <div className="w-1/2">
                                            <label className='block text-gray-700 font-medium mb-2'>Start Date</label>
                                            <input
                                                type="date"
                                                {...register(`experience.${index}.StartDate`, {
                                                })}
                                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                            />
                                            {errors.experience?.[index]?.StartDate && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].StartDate.message}</p>}
                                        </div>

                                        {/* End Date */}
                                        <div className="w-1/2">
                                            <label className='block text-gray-700 font-medium mb-2'>End Date</label>
                                            <input
                                                type="date"
                                                {...register(`experience.${index}.EndDate`)}
                                                disabled={currentlyWorking}
                                                className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                            />
                                            {errors.experience?.[index]?.EndDate && <p className='text-red-500 text-xs mt-1'>{errors.experience[index].EndDate.message}</p>}
                                        </div>
                                    </div>

                                    {/* Currently Working Checkbox */}
                                    <div className="flex flex-row gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            {...register(`experience.${index}.currentlyWorking`)}
                                            className="w-4 h-4 accent-[#E94560]"
                                        />
                                        <label className="text-gray-700 font-medium">Currently Working Here</label>
                                    </div>


                                    <div className="flex flex-row gap-3">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className='px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200'
                                        >
                                            Remove Experience
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => saveExperience(index)}
                                            disabled={isSubmitting || isUploading}
                                            className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {isSubmitting || isUploading ? 'Saving...' : 'Save Experience'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <button
                        type="button"
                        onClick={addExperience}
                        className='px-5 py-3 rounded-lg cursor-pointer border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#E94560] hover:text-[#E94560] transition-all duration-200'
                    >
                        Add Experience
                    </button>

                    {/* Action Buttons */}
                    <div className='flex flex-row justify-between items-center pt-4'>
                        <button type="button" onClick={() => navigate('/candidate/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>Skip for now</button>
                        <button type="submit" disabled={isSubmitting}  className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isSubmitting ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CandidateExperience