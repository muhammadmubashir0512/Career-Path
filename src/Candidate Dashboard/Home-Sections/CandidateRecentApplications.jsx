import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const statusStyles = {
  Active: "bg-green-100 text-green-800",
  Closed: "bg-red-100 text-red-800",
  Draft: "bg-gray-100 text-gray-600",
  Paused: "bg-amber-100 text-amber-800",
  Expired: "bg-gray-100 text-gray-500",
};

const CandidateRecentApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("User not logged in");
          navigate("/login");
          return;
        }

        const jobData = doc(db, "Jobs", user.uid);
        const jobsCollection = await getDoc(jobData);
        
        if (jobsCollection.exists()) {
          const data = jobsCollection.data();
          const jobsArray = data.jobs || [];
          // Sort by createdAt (latest first) and take first 6
          const sortedJobs = [...jobsArray].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setJobs(sortedJobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [navigate]);

  // Get active jobs count
  const activeJobsCount = jobs.filter((job) => job.status === "Active").length;
  
  // Show only 6 recent jobs
  const recentJobs = jobs.slice(0, 6);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-5 border border-gray-200 shadow-sm bg-white rounded-2xl w-full">
        <div className="flex justify-between items-center">
          <div>
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-3 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-white">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-5 border border-gray-200 shadow-sm bg-white rounded-2xl w-full">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[20px] font-bold text-gray-900">Recent Applied Applications</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {activeJobsCount} active applictions
          </p>
        </div>
        <button
          onClick={() => navigate("/candidate/")}
          className="text-xs font-medium text-[#E94560] hover:text-[#eb5b73] transition-colors cursor-pointer"
        >
          View all →
        </button>
      </div>

      {/* Cards Grid */}
      {recentJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentJobs.map((job, index) => (
            <div
              key={job.id || index}
              onClick={() => navigate(`/recruiter/job/${job.id}`)}
              className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#E94560] hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
            >
              {/* Title + Status */}
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
                  {job.title || "Untitled Job"}
                </p>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                    statusStyles[job.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {job.status || "Draft"}
                </span>
              </div>

              {/* Category + Job Type */}
              <span className="inline-block w-fit text-xs text-gray-500 bg-gray-100 rounded-md px-2.5 py-1 font-medium">
                {job.category || "Uncategorized"} · {job.jobType || "Not specified"}
              </span>

              <hr className="border-gray-100" />

              {/* Meta info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-5.356-3.712M9 20H4v-2a4 4 0 015.356-3.712M15 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>
                    {job.applicants || 0}{" "}
                    {job.applicants === 1 ? "applicant" : "applicants"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Footer */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Posted {formatDate(job.createdAt)}
                </span>
                <span className="text-xs font-semibold text-[#E94560] bg-[#E94560]/10 px-2.5 py-0.5 rounded-full">
                  {job.applicants || 0}{" "}
                  {job.applicants === 1 ? "applied" : "applied"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-gray-500 font-medium">No jobs applied yet</h3>
          <p className="text-gray-400 text-sm mt-1">
            Apply your first job to get started
          </p>
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="mt-4 px-4 py-2 bg-[#E94560] text-white rounded-lg text-sm font-medium hover:bg-[#eb5b73] transition-colors cursor-pointer"
          >
            Apply to Job
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateRecentApplications;