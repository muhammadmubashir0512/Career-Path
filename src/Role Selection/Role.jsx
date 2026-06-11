import { useState, useEffect } from 'react'
import cardData from './CardData'
import { auth } from '../firebase/config'
import { db } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

const Role = () => {
    const [selectedRole, setSelectedRole] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const cards = [cardData.jobSeeker, cardData.recruiter]
    const navigate = useNavigate()

    // Check authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login')
            }
            setIsCheckingAuth(false)
        })
        
        return () => unsubscribe()
    }, [navigate])

    const handleRoleAction = async (roleId, shouldNavigate = false) => {
        if (!shouldNavigate) {
            console.log("Selecting role:", roleId)
            setSelectedRole(roleId)
            return
        }
        
        if (isLoading) return
        
        setIsLoading(true)
        
        try {
            const user = auth.currentUser;
            if (!user) {
                navigate("/login")
                return
            }
            
            // SelectedRole
            await setDoc(doc(db, "users", user.uid), {
                Role: selectedRole,
                updatedAt: new Date()
            }, { merge: true })
            
            console.log("Role saved:", selectedRole)
            
            // Navigation condition
            if (selectedRole === "recruiter_001") {
                navigate('/RecruiterProfile')
            } else if (selectedRole === "job_seeker_001") {
                navigate('/candidateprofile')
            }
            
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // loading
    if (isCheckingAuth) {
        return (
            <div className='h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white'>
                <div className='text-center'>
                    <div className='w-10 h-10 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-500'>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white'>
            <div className='h-full flex flex-col items-center justify-center px-4 py-6'>
                {/* Header */}
                <div className='text-center mb-6'>
                    <p className='text-lg font-semibold text-[#E94560] mb-1'>Career Path</p>
                    <p className='text-3xl font-bold text-black'>I am....</p>
                    <p className='text-sm text-gray-500 mt-1'>Tell us who you are so we can tailor your experience perfectly.</p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleRoleAction(card.id, false)}
                            className={`
                                cursor-pointer rounded-xl p-4 transition-all duration-300
                                ${selectedRole === card.id 
                                    ? 'ring-2 ring-[#E94560] shadow-lg transform -translate-y-0.5' 
                                    : 'hover:shadow-md hover:-translate-y-0.5 border border-gray-200'
                                }
                            `}
                            style={{
                                backgroundColor: selectedRole === card.id 
                                    ? `${card.colorTheme.bg}60` 
                                    : 'white'
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-2xl mb-1">{card.icon}</div>
                                    <h2 className="text-xl font-bold">{card.title}</h2>
                                    <p className="text-gray-500 text-xs mt-0.5">{card.subtitle}</p>
                                </div>
                                {selectedRole === card.id && (
                                    <div className="bg-[#E94560] text-white rounded-full p-0.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                                {card.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                                {card.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-xs text-gray-600">
                                        <span className="text-[#E94560] mr-1 text-xs">✓</span>
                                        <span className="truncate">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                className={`
                                    w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 mt-2
                                    ${selectedRole === card.id 
                                        ? 'bg-[#E94560] text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-[#E94560] hover:text-white'
                                    }
                                `}
                            >
                                {selectedRole === card.id ? card.buttonText : `Select ${card.title}`}
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Continue button */}
                {selectedRole && (
                    <div className="text-center mt-6">
                        <button 
                            onClick={() => handleRoleAction(selectedRole, true)}
                            disabled={isLoading}
                            className="bg-[#E94560] hover:bg-[#BB1732] text-white cursor-pointer px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : `Continue as ${selectedRole === "recruiter_001" ? "Recruiter" : "Candidate"}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Role