import React from 'react'
import JobPosts from './JobPosts'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

const PostJob = () => {
  return (
    <div className='flex flex-row'>
      <div className='hidden md:block'>
        <Sidebar/>
      </div>
      <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
        <Topbar/>
        <JobPosts/>
      </div>
    </div>
  )
}

export default PostJob