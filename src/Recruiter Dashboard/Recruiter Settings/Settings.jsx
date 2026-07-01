import React from 'react'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'
import AccountStatus from './AccountStatus'

const Settings = () => {
  return (
    <div className='flex flex-row'>
      <div className='hidden md:block'>
        <Sidebar/>
      </div>
      <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
        <Topbar/>
        <AccountStatus/>
      </div>
    </div>
  )
}

export default Settings