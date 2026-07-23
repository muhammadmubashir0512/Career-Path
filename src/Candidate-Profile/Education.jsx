import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore"
import { db, auth } from "../firebase/config"
import { useForm, useFieldArray } from "react-hook-form"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "react-hot-toast"

const DEGREE_OPTIONS = [
    "Matriculation",
    "Intermediate",
    "Bachelors",
    "Masters",
    "MPhil",
    "PhD",
]

const FIELD_OF_STUDY_OPTIONS = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Business Administration",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Other",
]

const emptyEducation = { degree: "", Institute: "", FieldofStudy: "", CGPA: "", StartDate: "", EndDate: "" }

const CandidateEducation = () => {

    const navigate = useNavigate()
    const [isSaved, setIsSaved] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const {
        control,
        register,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { education: [emptyEducation] }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
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


    const saveEducation = async (index) => {
        const valid = await trigger(`education.${index}`)
        if (!valid) return

        const data = getValues(`education.${index}`)

        setIsSaved(prev => [
            ...prev,
            { ...data, id: crypto.randomUUID() }
        ])

        remove(index)
    }

    const deleteEducation = (id) => {
        setIsSaved(prev => prev.filter((edu) => edu.id !== id))
    }

    const addEducation = () => {
        append(emptyEducation)
    }

    const onSubmit = async () => {
        if (isSaved.length === 0) {
            toast.error("Please add at least one education entry")
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
                education: isSaved,
                onboardingStep: 2,
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
            toast.success("Candidate Education information saved successfully!")

            setTimeout(() => {
                navigate('/CandidateSkills')
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
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>2</div>
                            <p className='text-xs font-medium text-[#E94560]'>Education</p>
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

                <div className='rounded-lg border border-gray-200 p-5 flex flex-col gap-6 bg-white w-full max-w-2xl px-5'>
                    <div className='flex flex-col gap-1 w-full text-start'>
                        <p className='text-[17px] font-semibold text-black'>Education</p>
                        <p className='text-[15px] font-normal text-gray-500'>Add your educational background that showcase your academic journey.</p>
                    </div>

                    {/* Saved Education Cards */}
                    {
                        isSaved.map((edu) => (
                            <div key={edu.id} className="w-full">
                                <div className="w-full flex-col gap-7 justify-between border border-gray-200 rounded-lg bg-white p-5 hover:shadow-md transition-shadow duration-200">
                                    <div className="w-full flex justify-end">
                                        <div onClick={() => deleteEducation(edu.id)} className="bg-red-500 text-center w-[70px] text-white rounded-lg py-2 px-3 hover:bg-red-600 transition-colors cursor-pointer mb-4">
                                            Delete
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between">
                                        {/* Left Column */}
                                        <div className="flex flex-col gap-3 items-start">
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Degree:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.degree || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Field of Study:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.FieldofStudy || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Start Date:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.StartDate || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="flex flex-col gap-3 items-start mt-3 md:mt-0">
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">Institute:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.Institute || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">CGPA:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.CGPA || 'N/A'}</span>
                                            </div>

                                            <div className="flex flex-row gap-2 items-center">
                                                <span className="text-sm font-semibold text-black min-w-[90px]">End Date:</span>
                                                <span className="text-sm text-gray-500 font-medium">{edu.EndDate || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }

                    {/* Open / unsaved education sections */}
                    {
                        fields.map((field, index) => (
                            <div key={field.id} className='space-y-7 rounded-lg border border-gray-200 p-5 flex flex-col bg-white w-full '>
                                {/* Degree - dropdown */}
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Degree <span className='text-red-700'>*</span></label>
                                    <select
                                        {...register(`education.${index}.degree`, {
                                            required: "Degree is required",
                                        })}
                                        className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                    >
                                        <option value="">Select Degree</option>
                                        {DEGREE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.education?.[index]?.degree && <p className='text-red-500 text-xs mt-1'>{errors.education[index].degree.message}</p>}
                                </div>

                                {/* Institute */}
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Institute <span className='text-red-700'>*</span></label>
                                    <input
                                        type="text"
                                        {...register(`education.${index}.Institute`, {
                                            required: "Institute Name is required",
                                        })}
                                        placeholder="e.g., University of the Punjab"
                                        className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                    />
                                    {errors.education?.[index]?.Institute && <p className='text-red-500 text-xs mt-1'>{errors.education[index].Institute.message}</p>}
                                </div>

                                {/* Field of Study - dropdown */}
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Field of Study <span className='text-red-700'>*</span></label>
                                    <select
                                        {...register(`education.${index}.FieldofStudy`, {
                                            required: "Field of study is required",
                                        })}
                                        className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                    >
                                        <option value="">Select Field of Study</option>
                                        {FIELD_OF_STUDY_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.education?.[index]?.FieldofStudy && <p className='text-red-500 text-xs mt-1'>{errors.education[index].FieldofStudy.message}</p>}
                                </div>

                                {/* CGPA */}
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>CGPA <span className='text-red-700'>*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`education.${index}.CGPA`, {
                                            required: "CGPA is required",
                                            min: { value: 0, message: "CGPA cannot be less than 0" },
                                            max: { value: 4, message: "CGPA cannot be greater than 4" },
                                            valueAsNumber: true,
                                        })}
                                        placeholder="e.g., 3.80"
                                        className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                    />
                                    {errors.education?.[index]?.CGPA && <p className='text-red-500 text-xs mt-1'>{errors.education[index].CGPA.message}</p>}
                                </div>

                                <div className="flex flex-row gap-4 items-center w-full">
                                    {/* Start Date */}
                                    <div className="w-1/2">
                                        <label className='block text-gray-700 font-medium mb-2'>Start Date <span className='text-red-700'>*</span></label>
                                        <input
                                            type="date"
                                            {...register(`education.${index}.StartDate`, {
                                                required: "Start Date is required",
                                            })}
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        />
                                        {errors.education?.[index]?.StartDate && <p className='text-red-500 text-xs mt-1'>{errors.education[index].StartDate.message}</p>}
                                    </div>

                                    {/* End Date */}
                                    <div className="w-1/2">
                                        <label className='block text-gray-700 font-medium mb-2'>End Date</label>
                                        <input
                                            type="date"
                                            {...register(`education.${index}.EndDate`)}
                                            className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                        />
                                        {errors.education?.[index]?.EndDate && <p className='text-red-500 text-xs mt-1'>{errors.education[index].EndDate.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className='px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200'
                                    >
                                        Remove Education
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => saveEducation(index)}
                                        disabled={isSubmitting || isUploading}
                                        className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isSubmitting || isUploading ? 'Saving...' : 'Save Education'}
                                    </button>
                                </div>
                            </div>
                        ))
                    }

                    <button
                        type="button"
                        onClick={addEducation}
                        className='px-5 py-3 rounded-lg cursor-pointer border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#E94560] hover:text-[#E94560] transition-all duration-200'
                    >
                        Add Education
                    </button>

                    {/* Action Buttons */}
                    <div className='flex flex-row justify-end items-center pt-4 gap-4'>
                        <button type="button" onClick={() => navigate('/candidate/dashboard')} className='text-[#E94560] hover:text-[#eb5b73] cursor-pointer font-medium px-5 py-3'>Skip for now</button>
                        <button type="submit" onClick={() => onSubmit()} disabled={isSubmitting || isUploading} className='px-5 bg-[#E94560] hover:bg-[#eb5b73] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isSubmitting || isUploading ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CandidateEducation