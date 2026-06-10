import React, { useState } from 'react'
import { auth, db } from '../../firebase/config'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const JobPosts = () => {
    const navigate = useNavigate()
    const [workMode, setWorkMode] = useState('Remote')
    const [skills, setSkills] = useState([])
    const [currentSkill, setCurrentSkill] = useState('')
    const [description, setDescription] = useState('')
    const [requirements, setRequirements] = useState('')
    const [benefits, setBenefits] = useState([
        { id: 1, text: 'Healthcare' },
        { id: 3, text: 'Home Office Stipend' }
    ])
    const [newBenefit, setNewBenefit] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    // Quill toolbar configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    }

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'link'
    ]

    // Add skill
    const handleAddSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()])
            setCurrentSkill('')
        }
    }

    // Remove skill
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove))
    }

    // Handle key press (Enter)
    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    // Add benefit
    const handleAddBenefit = () => {
        if (newBenefit.trim()) {
            setBenefits([...benefits, { id: Date.now(), text: newBenefit.trim() }])
            setNewBenefit('')
        }
    }

    // Remove benefit
    const handleRemoveBenefit = (idToRemove) => {
        setBenefits(benefits.filter(benefit => benefit.id !== idToRemove))
    }

    const onSubmit = async (data) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user logged in");
                return;
            }

            const jobInfo = {
                id: Date.now(),
                title: data.Title,
                category: data.category,
                experience: data.experience,
                jobType: data.jobType,
                workMode: workMode,
                skills: skills,
                description: description,
                requirements: requirements,
                benefits: benefits.map(b => b.text),
                deadline: data.deadline,
                createdAt: new Date().toISOString(),
                status: "Active"
            };

            const jobRef = doc(db, "Jobs", user.uid);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const existingJobs = jobSnap.data().jobs || [];
                await updateDoc(jobRef, {
                    jobs: [...existingJobs, jobInfo],
                    lastUpdated: new Date().toISOString()
                });
            } else {
                await setDoc(jobRef, {
                    jobs: [jobInfo],
                    createdAt: new Date().toISOString()
                });
            }

            navigate('/recruiter/jobs');
            
        } catch (error) {
            console.error("Error posting job:", error);
        }
    }

    const goToDashboard = () => {
        navigate('/recruiter/dashboard')
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Mobile Container */}
            <div className="pt-20 md:pt-5">
                
                {/* Header - Mobile First */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Create New Job Listing
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 md:text-base">
                        Fill in the details below to find your next great hire.
                    </p>
                </div>

                {/* Form Card - Full width on mobile, centered on desktop */}
                <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8">
                        
                        <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit(onSubmit)}>
                            
                            {/* Job Title */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    {...register('Title', {required: "Job Title is required"})} 
                                    placeholder="e.g., Senior Software Engineer" 
                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-200 text-sm md:text-base"
                                />
                                {errors.Title && <p className="text-red-500 text-xs mt-1">{errors.Title.message}</p>}
                            </div>

                            {/* Category & Experience - Stack on mobile, row on tablet+ */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        {...register('category', {required: "Job Category is required"})} 
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm md:text-base"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Experience Level <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        {...register('experience', {required: "Experience is required"})} 
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm md:text-base"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Entry Level">Entry Level</option>
                                        <option value="Advanced Level">Advanced Level</option>
                                        <option value="Pro Level">Pro Level</option>
                                    </select>
                                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
                                </div>
                            </div>

                            {/* Job Type & Work Mode */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Job Type <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        {...register('jobType', {required: "Job Type is required"})} 
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm md:text-base"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Contract Based">Contract Based</option>
                                    </select>
                                    {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
                                </div>

                                {/* Work Mode - Custom Toggle */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Work Mode</label>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-gray-500 flex-1">Remote vs. On-site</p>
                                        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                                            <button 
                                                type="button" 
                                                onClick={() => setWorkMode('Remote')} 
                                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer
                                                    ${workMode === 'Remote' ? 'bg-[#E94560] text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                Remote
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setWorkMode('Onsite')} 
                                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer
                                                    ${workMode === 'Onsite' ? 'bg-[#E94560] text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                On-site
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Required Skills</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-[#E94560]/10 text-[#E94560] rounded-full text-xs md:text-sm">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 ml-1 text-base">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="text"
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyPress={handleSkillKeyPress}
                                        placeholder="Type a skill and press Enter"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddSkill} 
                                        className="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm font-medium cursor-pointer"
                                    >
                                        + Add Skill
                                    </button>
                                </div>
                            </div>

                            {/* Job Description - ReactQuill */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Job Description <span className="text-red-500">*</span>
                                </label>
                                <div className="text-sm">
                                    <ReactQuill 
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Describe the role, impact, and who you're looking for..."
                                        className="bg-white rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Requirements - ReactQuill */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Requirements <span className="text-red-500">*</span>
                                </label>
                                <ReactQuill 
                                    theme="snow"
                                    value={requirements}
                                    onChange={setRequirements}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="List specific qualifications, tools, or experience needed..."
                                    className="bg-white rounded-lg"
                                />
                            </div>

                            {/* Benefits & Perks */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Benefits & Perks</label>
                                <div className="space-y-2 mb-3">
                                    {benefits.map((benefit) => (
                                        <div key={benefit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">• {benefit.text}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveBenefit(benefit.id)} 
                                                className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="text"
                                        value={newBenefit}
                                        onChange={(e) => setNewBenefit(e.target.value)}
                                        placeholder="Add a benefit (e.g., Healthcare)"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddBenefit} 
                                        className="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm font-medium cursor-pointer"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Application Deadline */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Application Deadline <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="date"
                                    {...register('deadline', {required: "Deadline is required"})}
                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] text-sm"
                                />
                                {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                            </div>

                            {/* Action Buttons - Stack on mobile, row on tablet+ */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={goToDashboard}
                                    className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full sm:w-auto px-5 py-2.5 bg-[#E94560] hover:bg-[#eb5b73] text-white rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm md:text-base font-medium"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobPosts