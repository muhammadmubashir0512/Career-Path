// ── Static data
export const applicationsData = [
  { id: 1, initials: 'JC', fullName: 'John Carter',  email: 'john.carter@email.com',  position: 'Senior React Developer', department: 'Engineering',    appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '5 years', expectedSalary: '$120k–$140k', location: 'Karachi, PK',  skills: ['React', 'Node'],    status: 'Shortlisted', resumeUrl: null, resumeName: 'John_Carter_Resume.pdf',   resumeSize: '245 KB · Updated Mar 2026' },
  { id: 2, initials: 'BR', fullName: 'Buttler Ray',  email: 'buttler.ray@email.com',  position: 'Senior React Developer', department: 'Engineering',    appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '7 years', expectedSalary: '$150k–$170k', location: 'Lahore, PK',   skills: ['React', 'AWS'],     status: 'Interview',   resumeUrl: null, resumeName: 'Buttler_Ray_Resume.pdf',   resumeSize: '198 KB · Updated Feb 2026' },
  { id: 3, initials: 'MM', fullName: 'Muhammad Mubashir',    email: 'zayansaeed222@gmail.com',    position: 'DevOps Engineer',        department: 'Infrastructure', appliedDate: 'May 8, 2026',  appliedDaysAgo: '3 days ago', experience: '4 years', expectedSalary: '$90k–$110k',  location: 'Remote',       skills: ['AWS', 'Docker'],    status: 'Pending',     resumeUrl: null, resumeName: 'Smith_Ali_Resume.pdf',     resumeSize: '310 KB · Updated Apr 2026' },
  { id: 4, initials: 'PP', fullName: 'Priya Patel',  email: 'priya.patel@email.com',  position: 'Full Stack Developer',   department: 'Product',        appliedDate: 'May 7, 2026',  appliedDaysAgo: '4 days ago', experience: '6 years', expectedSalary: '$140k–$160k', location: 'Remote',       skills: ['React', 'Node'],    status: 'Hired',       resumeUrl: null, resumeName: 'Priya_Patel_Resume.pdf',   resumeSize: '275 KB · Updated Jan 2026' },
  { id: 5, initials: 'AJ', fullName: 'Alexa Jehn',   email: 'alexa.jehn@email.com',   position: 'UX Researcher',          department: 'Design',         appliedDate: 'May 7, 2026',  appliedDaysAgo: '4 days ago', experience: '3 years', expectedSalary: '$80k–$100k',  location: 'New York, US', skills: ['Figma', 'UX'],      status: 'Rejected',    resumeUrl: null, resumeName: 'Alexa_Jehn_Resume.pdf',    resumeSize: '189 KB · Updated Mar 2026' },
  { id: 6, initials: 'JL', fullName: 'Jordan Lee',   email: 'jordan.lee@email.com',   position: 'Product Designer',       department: 'Design',         appliedDate: 'May 6, 2026',  appliedDaysAgo: '5 days ago', experience: '4 years', expectedSalary: '$100k–$120k', location: 'Remote',       skills: ['Figma', 'Sketch'],  status: 'Shortlisted', resumeUrl: null, resumeName: 'Jordan_Lee_Resume.pdf',    resumeSize: '220 KB · Updated Feb 2026' },
]


// ── SVG Icons ──
export const BriefcaseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)
export const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
export const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
export const SalaryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
export const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
export const PdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="11" y2="11"/>
  </svg>
)
export const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
export const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)
export const CalEventIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
  </svg>
)
export const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4h10l1 7H6L7 4z"/><path d="M6 11C3.8 11 2 9.2 2 7V4h5"/><path d="M18 11c2.2 0 4-1.8 4-4V4h-5"/>
  </svg>
)
export const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
export const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
export const ScheduleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
  </svg>
)
export const ZoomIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
  </svg>
)






// ── Status config ──
export const statusConfig = {
  Shortlisted: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
  Interview:   { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  Pending:     { bg: 'bg-gray-100',  text: 'text-gray-700',  dot: 'bg-amber-400'  },
  Hired:       { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  Rejected:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400'    },
}

// ── Avatar colors ──
export const avatarColors = [
  'bg-violet-600', 'bg-blue-600', 'bg-emerald-600',
  'bg-amber-600',  'bg-rose-600', 'bg-indigo-600',
]

// Status Buttons
export const statusButtons = [
    { key: 'Shortlisted', label: 'Shortlisted', icon: <BookmarkIcon />, active: 'bg-violet-50 border-violet-400 text-violet-700', inactive: 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' },
    { key: 'Interview',   label: 'Interview',   icon: <CalEventIcon />, active: 'bg-blue-50 border-blue-400 text-blue-700',   inactive: 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' },
    { key: 'Hired',       label: 'Hire',        icon: <TrophyIcon />,   active: 'bg-green-50 border-green-400 text-green-700', inactive: 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' },
    { key: 'Rejected',    label: 'Reject',      icon: <XIcon />,        active: 'bg-red-50 border-red-400 text-red-700',       inactive: 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' },
  ]