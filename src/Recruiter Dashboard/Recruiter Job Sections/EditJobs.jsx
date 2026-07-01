import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'
import ReactQuill from 'react-quill-new'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

const EditJobs = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('myjobs')
    const [workMode, setWorkMode] = useState('Remote')
    const [skills, setSkills] = useState([])
    const [currentSkill, setCurrentSkill] = useState('')
    const [description, setDescription] = useState('')
    const [requirements, setRequirements] = useState('')
    const [benefits, setBenefits] = useState([])
    const [newBenefit, setNewBenefit] = useState('')
    const [jobStatus, setJobStatus] = useState('Active')

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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm()

    // Fetch job details
    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const user = auth.currentUser
                if (!user) {
                    toast.error("Please login first")
                    navigate('/login')
                    return
                }

                const docRef = doc(db, "Jobs", user.uid)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    const jobsArray = data.jobs || []
                    const foundJob = jobsArray.find(job => job.id === parseInt(jobId))
                    
                    if (foundJob) {
                        setJob(foundJob)
                        setValue('Title', foundJob.title)
                        setValue('category', foundJob.category)
                        setValue('experience', foundJob.experience)
                        setValue('jobType', foundJob.jobType)
                        setValue('deadline', foundJob.deadline)
                        setWorkMode(foundJob.workMode || 'Remote')
                        setSkills(foundJob.skills || [])
                        setDescription(foundJob.description || '')
                        setRequirements(foundJob.requirements || '')
                        setBenefits(foundJob.benefits?.map((text, index) => ({ id: index, text })) || [])
                        setJobStatus(foundJob.status || 'Active')
                    } else {
                        toast.error("Job not found")
                        navigate('/recruiter/jobs')
                    }
                } else {
                    toast.error("No jobs found")
                    navigate('/recruiter/jobs')
                }
            } catch (error) {
                console.error("Error fetching job details:", error)
                toast.error("Failed to load job details")
            } finally {
                setLoading(false)
            }
        }

        fetchJobDetail()
    }, [jobId, navigate, setValue])

    const onSubmit = async (data) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("No user logged in");
                return;
            }

            const updatedJob = {
                ...job,
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
                status: jobStatus,
                lastUpdated: new Date().toISOString()
            };

            const jobRef = doc(db, "Jobs", user.uid);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const existingJobs = jobSnap.data().jobs || [];
                const updatedJobsArray = existingJobs.map(j => 
                    j.id === parseInt(jobId) ? updatedJob : j
                );
                
                await updateDoc(jobRef, {
                    jobs: updatedJobsArray,
                    lastUpdated: new Date().toISOString()
                });
                
                toast.success("Job updated successfully!");
                navigate('/recruiter/jobs');
            } else {
                toast.error("Job document not found");
            }
            
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error("Failed to update job");
        }
    }

    const handleStatusChange = async (newStatus) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("No user logged in");
                return;
            }

            setJobStatus(newStatus);

            const updatedJob = {
                ...job,
                status: newStatus,
                lastUpdated: new Date().toISOString()
            };

            const jobRef = doc(db, "Jobs", user.uid);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const existingJobs = jobSnap.data().jobs || [];
                const updatedJobsArray = existingJobs.map(j => 
                    j.id === parseInt(jobId) ? updatedJob : j
                );
                
                await updateDoc(jobRef, {
                    jobs: updatedJobsArray,
                    lastUpdated: new Date().toISOString()
                });
                
                toast.success(`Job ${newStatus === 'Active' ? 'activated' : 'closed'} successfully!`);
            }
            
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            setJobStatus(job.status);
        }
    }

    const goToJobDetail = () => {
        navigate(`/recruiter/job/${jobId}`)
    }

    const handleAddSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()])
            setCurrentSkill('')
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove))
    }

    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleAddBenefit = () => {
        if (newBenefit.trim()) {
            setBenefits([...benefits, { id: Date.now(), text: newBenefit.trim() }])
            setNewBenefit('')
        }
    }

    const handleRemoveBenefit = (idToRemove) => {
        setBenefits(benefits.filter(benefit => benefit.id !== idToRemove))
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin'></div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-gray-500'>Job not found</p>
                    <button onClick={() => navigate('/recruiter/jobs')} className='mt-4 text-[#E94560] hover:underline'>
                        Back to Jobs
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Toaster position="top-right" />
            
            {/* Desktop Sidebar */}
            <div className='hidden md:block'>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>

            {/* Mobile Topbar */}
            <Topbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content - Same as JobDetail */}
            <div className='md:ml-[220px] pt-20 md:pt-5'>
                <div className='max-w-8xl mx-auto px-4 py-4 md:py-8'>
                    
                    {/* Breadcrumb / Navigation */}
                    <div className='mb-4 md:mb-6'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                            <div className='flex items-center gap-2 text-sm'>
                                <button 
                                    onClick={() => navigate('/recruiter/jobs')}
                                    className='text-gray-500 hover:text-[#E94560] transition-colors cursor-pointer'
                                >
                                    My Jobs
                                </button>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className='text-gray-800 font-medium truncate'>{job.title}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className='text-gray-500'>Edit Job</span>
                            </div>

                            <div className='flex items-center gap-3'>
                                {/* Status Display */}
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    jobStatus === 'Active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {jobStatus}
                                </div>
                                
                                {/* Status Toggle Buttons */}
                                <div className='flex gap-2'>
                                    {jobStatus === 'Closed' && (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange('Active')}
                                            className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 cursor-pointer"
                                        >
                                            Reactivate Job
                                        </button>
                                    )}
                                    
                                    {jobStatus === 'Active' && (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange('Closed')}
                                            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 cursor-pointer"
                                        >
                                            Close Job
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Card - Same styling as JobDetail */}
                    <div className='bg-white rounded-2xl shadow-sm  border border-gray-200 overflow-hidden'>
                        
                        {/* Header Section */}
                        <div className='p-4 md:p-8 border-b border-gray-200'>
                            <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                                <div>
                                    <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                                        Edit Job Posting
                                    </h1>
                                    <p className='text-sm text-gray-500'>
                                        Update details for {job.title} position.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warning for Closed Job */}
                        {jobStatus === 'Closed' && (
                            <div className="mx-4 md:mx-8 mt-4 md:mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-700 text-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    This job is currently <strong>Closed</strong>. Candidates cannot apply. Click "Reactivate Job" to reopen applications.
                                </p>
                            </div>
                        )}

                        {/* Form Content */}
                        <div className='p-4 md:p-8'>
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

                                {/* Category & Experience */}
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

                                    {/* Work Mode Toggle */}
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

                                {/* Job Description */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Job Description <span className="text-red-500">*</span>
                                    </label>
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

                                {/* Requirements */}
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

                                {/* Benefits */}
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

                                {/* Deadline */}
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

                                {/* Action Buttons */}
                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={goToJobDetail}
                                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-sm md:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="w-full sm:w-auto px-5 py-2.5 bg-[#E94560] hover:bg-[#eb5b73] text-white rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm md:text-base font-medium"
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Job'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditJobs