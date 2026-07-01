import sideimg from '../assets/Authentication/Sideimg.png'
import { useForm } from "react-hook-form";
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Signup = () => {
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm()

    const onSubmit = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.Email, data.Password)
            const user = userCredential.user

            await setDoc(doc(db, "users", user.uid), {
                email: data.Email,
                createdAt: new Date()
            })

            toast.success("Account Created Successfully!")

            reset()

            navigate('/role')

        } catch (error) {
            console.error("Signup error:", error)

            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already in use. Please login instead.")
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password should be at least 6 characters.")
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email format.")
            } else {
                toast.error(error.message)
            }
        }
    };

    const SigninwithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)

            const isNewUser = result._tokenResponse?.isNewUser

            if (!isNewUser) {
                // Already exists — error dikhao
                toast.error("User already existed");

                return;
            }
            toast.success("Google Signup Successfully!")

            navigate('/role')

        } catch (error) {
            console.error("Google signup error:", error)
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Popup closed before completing signup.")
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error("Account exists with different sign-in method.")
            } else {
                toast.error(error.message)
            }
        }
    }

    return (
        <div className='h-screen w-full overflow-hidden bg-white'>
            <Toaster position="top-right" />
            <div className='grid grid-cols-1 lg:grid-cols-2 h-full'>
                {/* Left Section - Form */}
                <div className='flex items-center justify-center px-4 sm:px-6 lg:px-8 h-full overflow-auto'>
                    <div className='w-full max-w-[440px] py-8'>
                        <div className='mb-8'>
                            <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Create Account</h1>
                            <p className='text-sm text-gray-500'>Start your journey towards your dream career today.</p>
                        </div>

                        <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-200 text-sm'
                                    {...register('Email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Invalid email format'
                                        }
                                    })}
                                />
                                {errors.Email && <p className='text-red-500 text-xs mt-1'>{errors.Email.message}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
                                <input
                                    type='password'
                                    placeholder='Create a password'
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-200 text-sm'
                                    {...register('Password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                />
                                {errors.Password && <p className='text-red-500 text-xs mt-1'>{errors.Password.message}</p>}
                            </div>

                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full bg-[#E94560] hover:bg-[#BB1732] cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2'
                            >
                                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className='relative my-6'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-200'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-4 bg-white text-gray-400'>OR</span>
                            </div>
                        </div>

                        <button
                            onClick={SigninwithGoogle}
                            className='w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200'
                        >
                            <svg className='w-5 h-5' viewBox='0 0 24 24'>
                                <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                                <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                                <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                                <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                            </svg>
                            <span className='text-sm font-medium cursor-pointer text-gray-700'>Continue with Google</span>
                        </button>

                        <p className='text-center text-sm text-gray-500 mt-6'>
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/Login')}
                                className='text-[#E94560] hover:text-[#BB1732] hover:underline cursor-pointer font-semibold'
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Section - Image */}
                <div className='hidden lg:block h-full overflow-hidden'>
                    <img
                        src={sideimg}
                        alt='Side illustration'
                        className='w-full h-full object-cover object-center'
                    />
                </div>
            </div>
        </div>
    )
}

export default Signup