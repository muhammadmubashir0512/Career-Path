import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'
import ApplicationRecieved from './ApplicationRecieved'
import ApplicationDetail from './ApplicationDetail'
import { ApplicationProvider } from '../../context/ApplicationContext'
import { StatusProvider } from './ApplicationDetail'

const Applications = () => {
  const [selectedId,  setSelectedId]  = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <ApplicationProvider>
      <div className='flex flex-row'>
        <div className='hidden md:block'>
          <Sidebar />
        </div>
        <div className='flex flex-col w-full p-4 gap-4 md:ml-[220px]'>
          <Topbar />
          <StatusProvider>
            <ApplicationRecieved
              onSelect={(id) => {
                setSelectedId(id)
                setIsPanelOpen(true)
              }}
              />
            <ApplicationDetail
              isOpen={isPanelOpen}
              onClose={() => setIsPanelOpen(false)}
              applicationId={selectedId}
              />
            </StatusProvider>
        </div>
      </div>
    </ApplicationProvider>
  )
}

export default Applications