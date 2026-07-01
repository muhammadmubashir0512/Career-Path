import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from './Landing Page/LandingPage';
import Role from './Role Selection/Role';
import Login from './auth/Login';
import Signup from './auth/Signup';
import CompanyInfo from './Recrutier Profile/CompanyInfo';
import RecruiterProfile from './Recrutier Profile/RecruiterProfile';
import RecruiterContact from './Recrutier Profile/ContactInfo';
import RecRuiterDashboard from './Recruiter Dashboard/Home section/RecRuiterDashboard';
import Jobs from './Recruiter Dashboard/Recruiter Job Sections/Jobs';
import PostJob from './Recruiter Dashboard/Recruiter Job Sections/Postjob';
import JobDetail from './Recruiter Dashboard/Recruiter Job Sections/JobDetails';
import EditJobs from './Recruiter Dashboard/Recruiter Job Sections/EditJobs';
import ProtectedRoute from './components/ProtecedRoutes';
import Applications from './Recruiter Dashboard/Recruiter Job Applications/Applications';
import Settings from './Recruiter Dashboard/Recruiter Settings/Settings';
import CompanyProfile from './Recruiter Dashboard/Recruiter Settings/CompanyProfile';
import BasicInfo from './Candidate Profile/BasicInfo';
import CandidateEducation from './Candidate Profile/Education';
import CandidateExperience from './Candidate Profile/Experience';
import CandidateSkills from './Candidate Profile/Skills';
import CandidateResume from './Candidate Profile/ResumeLinks';


function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAppLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // App level loading
  if (appLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1729]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading Application...</p>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />
    },
    {
      path: '/role',
      element: <Role />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/companyinfo',
      element: <CompanyInfo />
    },
    {
      path: '/RecruiterProfile',
      element: <RecruiterProfile />
    },
    {
      path: '/Recruitercontact',
      element: <RecruiterContact />
    },
    {
      path: '/candidateprofile',
      element: <BasicInfo/>
    },
    {
      path: '/CandidateEducation',
      element: <CandidateEducation/>
    },
    {
      path: '/candidateExperience',
      element: <CandidateExperience/>
    },
    {
      path: '/CandidateSkills',
      element: <CandidateSkills/>
    },
    {
      path: '/CandidateResume',
      element: <CandidateResume/>
    },
    // PROTECTED ROUTES
    {
      path: '/recruiter/dashboard',
      element: (
        <ProtectedRoute>
          <RecRuiterDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/jobs',
      element: (
        <ProtectedRoute>
          <Jobs />
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/postjob',
      element: (
        <ProtectedRoute>
          <PostJob />
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/job/:jobId',
      element: (
        <ProtectedRoute>
          <JobDetail />
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/edit-job/:jobId',
      element: (
        <ProtectedRoute>
          <EditJobs />
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/applications',
      element: (
        <ProtectedRoute>
          <Applications/>
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/settings',
      element: (
        <ProtectedRoute>
          <Settings/>
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/personalprofile',
      element: (
        <ProtectedRoute>
          <personalprofile/>
        </ProtectedRoute>
      )
    },
    {
      path: '/recruiter/settings',
      element: (
        <ProtectedRoute>
          <CompanyProfile/>
        </ProtectedRoute>
      )
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;