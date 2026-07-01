import { createContext, useContext, useState } from "react"

const initialApplications = [
  { id: 1, initials: 'JC', fullName: 'John Carter',  email: 'john.carter@email.com',  position: 'Senior React Developer', department: 'Engineering',    appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '5 years', expectedSalary: '$120k–$140k', location: 'Karachi, PK',  skills: ['React', 'Node'],    status: 'Shortlisted', resumeUrl: null, resumeName: 'John_Carter_Resume.pdf',   resumeSize: '245 KB · Updated Mar 2026' },
  { id: 2, initials: 'BR', fullName: 'Buttler Ray',  email: 'buttler.ray@email.com',  position: 'Senior React Developer', department: 'Engineering',    appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '7 years', expectedSalary: '$150k–$170k', location: 'Lahore, PK',   skills: ['React', 'AWS'],     status: 'Interview',   resumeUrl: null, resumeName: 'Buttler_Ray_Resume.pdf',   resumeSize: '198 KB · Updated Feb 2026' },
  { id: 3, initials: 'SA', fullName: 'Smith Ali',    email: 'smith.ali@email.com',    position: 'DevOps Engineer',        department: 'Infrastructure', appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '4 years', expectedSalary: '$90k–$110k',  location: 'Remote',       skills: ['AWS', 'Docker'],    status: 'Pending',     resumeUrl: null, resumeName: 'Smith_Ali_Resume.pdf',     resumeSize: '310 KB · Updated Apr 2026' },
  { id: 4, initials: 'PP', fullName: 'Priya Patel',  email: 'priya.patel@email.com',  position: 'Full Stack Developer',   department: 'Product',        appliedDate: 'May 7, 2026',  appliedDaysAgo: '4 days ago', experience: '6 years', expectedSalary: '$140k–$160k', location: 'Remote',       skills: ['React', 'Node'],    status: 'Hired',       resumeUrl: null, resumeName: 'Priya_Patel_Resume.pdf',   resumeSize: '275 KB · Updated Jan 2026' },
  { id: 5, initials: 'AJ', fullName: 'Alexa Jehn',   email: 'alexa.jehn@email.com',   position: 'UX Researcher',          department: 'Design',         appliedDate: 'May 7, 2026',  appliedDaysAgo: '4 days ago', experience: '3 years', expectedSalary: '$80k–$100k',  location: 'New York, US', skills: ['Figma', 'UX'],      status: 'Rejected',    resumeUrl: null, resumeName: 'Alexa_Jehn_Resume.pdf',    resumeSize: '189 KB · Updated Mar 2026' },
  { id: 6, initials: 'JL', fullName: 'Jordan Lee',   email: 'jordan.lee@email.com',   position: 'Product Designer',       department: 'Design',         appliedDate: 'May 6, 2026',  appliedDaysAgo: '5 days ago', experience: '4 years', expectedSalary: '$100k–$120k', location: 'Remote',       skills: ['Figma', 'Sketch'],  status: 'Shortlisted', resumeUrl: null, resumeName: 'Jordan_Lee_Resume.pdf',    resumeSize: '220 KB · Updated Feb 2026' },
]

const ApplicationContext = createContext()

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(initialApplications)

  const updateStatus = (applicationId, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )
  }

  return (
    <ApplicationContext.Provider value={{ applications, updateStatus }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplications = () => {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider")
  }
  return context
}