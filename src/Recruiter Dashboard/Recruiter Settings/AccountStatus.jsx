import React from 'react'

const AccountStatus = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
        <div  className=" pt-20 md:pt-5">
            {/* Header Section - Mobile First */}
            <div className="mb-5 md:mb-6 lg:mb-8">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                    Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1 sm:text-base">
                    Update your personal details
                </p>
            </div>

            {/* Profil Status Tag */}
            <div className=''>
                <p>Tag</p>
            </div>
        </div>
    </div>
  )
}

export default AccountStatus