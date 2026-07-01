import React from 'react'

const HowItWorks = () => {
    const steps = [
        {
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            title: "Create Profile",
            description: "Showcase your experience, skills, and portfolio to stand out from the crowd."
        },
        {
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Apply Quickly",
            description: "Apply to multiple jobs with a single click and track your applications in real-time."
        },
        {
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Get Hired",
            description: "Ace your interviews with our expert tips and land your next high-tier role."
        },
    ]

    return (
        <section className='bg-[#0f1729] py-10 sm:py-12 px-4 sm:px-6 my-8 sm:my-12'>
            <div className='max-w-6xl mx-auto'>
                
                {/* Heading */}
                <div className='text-center mb-8 sm:mb-10'>
                    <h2 className='text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4'>
                        How It Works
                    </h2>
                    <p className='text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed px-4'>
                        Simple steps to landing your dream position with our guided career ecosystem.
                    </p>
                </div>

                {/* Steps - Mobile: Stacked, Desktop: Row */}
                <div className='relative'>
                    {/* Dashed line - Hide on mobile, show on desktop */}
                    <div className='hidden md:block absolute top-[30px] left-[calc(16.66%+30px)] right-[calc(16.66%+30px)] h-[2px]'
                        style={{
                            backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px)'
                        }}
                    />

                    <div className='flex flex-col md:flex-row gap-8 md:gap-6'>
                        {steps.map((step, idx) => (
                            <div key={idx} className='flex flex-col items-center text-center flex-1'>
                                {/* Icon Circle */}
                                <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E94560] flex items-center justify-center text-white mb-4 sm:mb-6 z-10 shadow-[0_0_20px_rgba(233,69,96,0.4)]'>
                                    {step.icon}
                                </div>

                                {/* Title */}
                                <h3 className='text-white font-bold text-base sm:text-lg mb-2 sm:mb-3'>
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className='text-white/50 text-xs sm:text-sm leading-relaxed max-w-[220px] sm:max-w-[240px] mx-auto'>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks