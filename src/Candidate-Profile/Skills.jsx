import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore"
import { db, auth } from "../firebase/config"
import { useForm } from "react-hook-form"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "react-hot-toast"
import close from "../assets/close.png"



const CandidateSkills = () => {

    const navigate = useNavigate()
    const [isSaved, setIsSaved] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { isSubmitting },
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


    const saveExperience = async () => {

        const newValue = getValues("Skills");
        if (!newValue) {
            return
        }

        setIsSaved(prev => [
            ...prev,
            { 
                skills: newValue, 
                id: crypto.randomUUID() 
            }
        ])
        reset()
    }


    const deleteExperience = (id) => {
        setIsSaved(prev => prev.filter((edu) => edu.id !== id))
    }


    const onSubmit = async () => {
        if (isSaved.length === 0) {
            toast.error("Please add at least one Skills entry")
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
                skills: isSaved,
                onboardingStep: 3,
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
            toast.success("Candidate Skills saved successfully!")

            setTimeout(() => {
                navigate('/CandidateExperience')
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
                            <div className='w-10 h-10 rounded-full bg-[#E94560] text-white shadow-md flex items-center justify-center text-sm font-bold'>3</div>
                            <p className='text-xs font-medium text-[#E94560]'>Skills</p>
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
                        <p className='text-[17px] font-semibold text-black'>Skills</p>
                        <p className='text-[15px] font-normal text-gray-500'>Highlight your expertise — add technical and soft skills that make you stand out to recruiters.</p>
                    </div>

                    {/* Saved experience Cards */}
                    <div className="flex flex-row w-full flex-wrap gap-4">
                        {
                            isSaved.map((skill) => (
                                <div key={skill.id}>
                                    <div className="bg-gray-200 py-3 px-4  items-center rounded-full hover:shadow-md transition-shadow duration-200">
                                        <div className="flex flex-row gap-4 items-center justify-between">
                                            <span className="text-[16px] font-medium">{skill.skills}</span>
                                            <img src={close} alt="" className="w-3 h-3 cursor-pointer" onClick={() => deleteExperience(skill.id)} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Open / unsaved experience sections */}
                    <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border border-gray-200 p-5 flex flex-col gap-7 bg-white w-full max-w-2xl'>
                        {/* Form Fields */}
                        <div className='space-y-5'>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Skills</label>
                                <input
                                    type="text"
                                    {...register('Skills', {})}
                                    placeholder="e.g., Problem Solving"
                                    className='w-full px-4 py-2.5 bg-[#FAFBFC] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent'
                                />
                            </div>
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={saveExperience}
                        className='px-5 py-3 rounded-lg cursor-pointer border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#E94560] hover:text-[#E94560] transition-all duration-200'
                    >
                        Add Skill
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

export default CandidateSkills