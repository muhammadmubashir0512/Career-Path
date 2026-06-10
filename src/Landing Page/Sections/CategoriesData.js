export const categoriesData = [
    {
        id: 1,
        name: 'Technology',
        jobCount: 12500,
        icon: '💻',
        color: 'bg-blue-500/10',
        textColor: 'text-blue-500'
    },
    {
        id: 2,
        name: 'Design',
        jobCount: 4200,
        icon: '🎨',
        color: 'bg-purple-500/10',
        textColor: 'text-purple-500'
    },
    {
        id: 3,
        name: 'Marketing',
        jobCount: 3800,
        icon: '📢',
        color: 'bg-green-500/10',
        textColor: 'text-green-500'
    },
    {
        id: 4,
        name: 'Finance',
        jobCount: 2100,
        icon: '💰',
        color: 'bg-yellow-500/10',
        textColor: 'text-yellow-500'
    },
    {
        id: 5,
        name: 'Healthcare',
        jobCount: 8400,
        icon: '🏥',
        color: 'bg-red-500/10',
        textColor: 'text-red-500'
    },
    {
        id: 6,
        name: 'Education',
        jobCount: 1500,
        icon: '📚',
        color: 'bg-indigo-500/10',
        textColor: 'text-indigo-500'
    },
    {
        id: 7,
        name: 'Sales',
        jobCount: 5200,
        icon: '🤝',
        color: 'bg-orange-500/10',
        textColor: 'text-orange-500'
    },
    {
        id: 8,
        name: 'Engineering',
        jobCount: 6700,
        icon: '⚙️',
        color: 'bg-cyan-500/10',
        textColor: 'text-cyan-500'
    }
]

// Format job count function
export const formatJobCount = (count) => {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k'
    }
    return count.toString()
}