import React from 'react'

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            rating: 5,
            quote: "CareerPath changed my job search game. The platform's design is just beautiful. It feels premium and focused. I found a company that matches my work-life balance perfectly.",
            name: "James Wilson",
            title: "Software Engineer @ Google",
            initialColor: "bg-blue-500"
        },
        {
            id: 2,
            rating: 5,
            quote: "CareerPath's filters and personalized job alerts saved me hours. It's not just a job board; it's a career partner for serious professionals.",
            name: "Elena Rodriguez",
            title: "Lead Designer @ Canva",
            initialColor: "bg-purple-500"
        },
        {
            id: 3,
            rating: 5,
            quote: "Within two weeks, I had three interviews with top-tier tech companies. The UI is incredibly smooth.",
            name: "Michael Chang",
            title: "Full Stack Developer",
            initialColor: "bg-green-500"
        }
    ]

    return (
        <section className='bg-white py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                
                {/* Heading */}
                <div className='text-center mb-10 sm:mb-12'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                        What our candidates say
                    </h2>
                    <p className='text-gray-500 text-sm sm:text-base max-w-2xl mx-auto'>
                        Real success stories from professionals who found their dream jobs through CareerPath
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
                    {testimonials.map((testimonial) => (
                        <div 
                            key={testimonial.id}
                            className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                        >
                            {/* Rating Stars */}
                            <div className='flex gap-1 mb-4'>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className='text-gray-600 text-sm leading-relaxed mb-5'>
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className='flex items-center gap-3'>
                                <div className={`w-10 h-10 rounded-full ${testimonial.initialColor} flex items-center justify-center text-white font-semibold text-sm`}>
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-900 text-sm'>{testimonial.name}</p>
                                    <p className='text-gray-400 text-xs'>{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials