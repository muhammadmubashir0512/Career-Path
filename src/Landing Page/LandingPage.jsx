import React from 'react'
import Navbar from './Sections/Navbar'
import Hero from './Sections/Hero'
import Categories from './Sections/Categories'
import FeaturedJobs from './Sections/FeaturedJobs'
import Testimonials from './Sections/Testimonials'
import CallToAction from './Sections/CTA'
import Footer from './Sections/Footer'
import HowItWorks from './Sections/HowItWorks'

const LandingPage = () => {
  return (
    <div className='flex flex-col'>
      <Navbar />

      <section id="find-jobs">
        <Hero />
      </section>

      <section id="categories">
        <Categories />
      </section>

      <section id="featured-jobs">
        <FeaturedJobs />
      </section>

      <section id="blog">
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage