'use client'

import { useState } from 'react'

export default function Home() {
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchGreeting = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/greeting')
      const data = await response.json()
      setGreeting(data.message)
    } catch (error) {
      setGreeting('Error fetching greeting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">blacklist</h1>
      
      <button 
        onClick={fetchGreeting}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Get Greeting'}
      </button>
      
      {greeting && (
        <p className="text-lg text-green-600">
          {greeting}
        </p>
      )}
    </div>
  );
}
