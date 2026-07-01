import React from 'react'

const Footer = () => {
    const footerLinks = {
        jobseekers: ['Browse Jobs', 'Career Advice', 'Salary Tools', 'Resume Builder'],
        employers: ['Post a Job', 'Talent Solutions', 'Pricing', 'Resource Center'],
        support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service']
    }

    return (
        <footer className='bg-[#0d0d14] text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10'>
                    
                    {/* Brand Column */}
                    <div className='lg:col-span-2'>
                        <h3 className='text-xl font-bold mb-4'>CareerPath</h3>
                        <p className='text-white/50 text-sm leading-relaxed max-w-sm'>
                            Empowering professionals to navigate their careers and connecting employers with top-tier talent through innovation.
                        </p>
                    </div>

                    {/* Jobseekers Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>
                            JOBSEEKERS
                        </h4>
                        <ul className='space-y-2'>
                            {footerLinks.jobseekers.map((link, idx) => (
                                <li key={idx}>
                                    <a href="#" className='text-white/50 hover:text-white hover:underline text-sm transition-colors duration-200'>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Employers Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>
                            EMPLOYERS
                        </h4>
                        <ul className='space-y-2'>
                            {footerLinks.employers.map((link, idx) => (
                                <li key={idx}>
                                    <a href="#" className='text-white/50 hover:text-white hover:underline text-sm transition-colors duration-200'>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>
                            SUPPORT
                        </h4>
                        <ul className='space-y-2'>
                            {footerLinks.support.map((link, idx) => (
                                <li key={idx}>
                                    <a href="#" className='text-white/50 hover:text-white  hover:underline text-sm transition-colors duration-200'>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='border-t border-white/10 pt-6 text-center'>
                    <p className='text-white/40 text-xs sm:text-sm'>
                        © 2025 CareerPath Premium. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer