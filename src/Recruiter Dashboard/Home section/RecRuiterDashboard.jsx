import React from 'react'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'
import Cards from './Cards'
import RecentApplications from './RecentApplications'
import RecentJobs from './RecentJobs'

const Home = () => {
  return (
    <div className='flex flex-row'>
      <div className='hidden md:block'>
        <Sidebar/>
      </div>
      <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
        <Topbar/>
        <Cards/>
        <RecentApplications/>
        <RecentJobs/>
      </div>
    </div>
  )
}

export default Home