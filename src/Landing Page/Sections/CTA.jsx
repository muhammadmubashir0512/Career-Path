import React from 'react'

const CallToAction = () => {
    return (
        <section className='bg-[#0f1729] py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto text-center'>
                
                {/* Heading */}
                <h2 className='text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4'>
                    Ready to Take the Next Step?
                </h2>
                
                {/* Description */}
                <p className='text-white/60 text-sm sm:text-base mb-8 max-w-2xl mx-auto'>
                    Join thousands of professionals who have found their perfect career match today.
                </p>

                {/* Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <button className='bg-[#E94560] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#d63d56] transition-all duration-300 cursor-pointer'>
                        Find Jobs
                    </button>
                    <button className='border border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer'>
                        Post a Job
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CallToAction