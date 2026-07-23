import React from 'react'
import CandidateSidebar from '../CandidateSidebar'
import Topbar from '../Topbar'
import Cards from './CandidateCards'
import CandidateRecentApplications from './CandidateRecentApplications'

const CandidateDashboard = () => {
  return (
    <div className='flex flex-row'>
      <div className='hidden md:block'>
        <CandidateSidebar/>
      </div>
      <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
        <Topbar/>
        <Cards/>
        <CandidateRecentApplications/>
      </div>
    </div>
  )
}

export default CandidateDashboard