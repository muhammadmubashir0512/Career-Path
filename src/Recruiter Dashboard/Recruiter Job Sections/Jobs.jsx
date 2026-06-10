import React from 'react'
import MyJobs from './MyJobs'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

const Jobs = () => {
  return (
    <div className='flex flex-row'>
      <div className='hidden md:block'>
        <Sidebar/>
      </div>
      <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
        <Topbar/>
        <MyJobs/>
      </div>
    </div>
  )
}

export default Jobs