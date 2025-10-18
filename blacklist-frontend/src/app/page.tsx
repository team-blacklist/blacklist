'use client'

import LiveView from '@/components/LiveView'
import { useEffect, useState } from 'react'


export default function Home() {
  const [url, setUrl] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [liveViewLink, setLiveViewLink] = useState("http://localhost:3000")

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const isFormValid = url.trim() !== '' && isValidUrl(url) && confirmed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/test-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      console.log('Test result:', data)
    } catch (error) {
      console.error('Error testing website:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>blacklist</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{ marginTop: '2px' }}
                required
              />
              <span>
                I confirm that I own this webapp and give full permissions for blacklist to test this website
              </span>
            </label>
          </div>

          <LiveView liveViewLink={liveViewLink} />
          
          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              width: '100%',
              padding: '10px',
              border: 'none',
              backgroundColor: isFormValid && !loading ? '#000' : '#ccc',
              color: 'white',
              fontSize: '14px',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Testing...' : 'Start Testing'}
          </button>
        </form>
      </div>
    </div>
  );
}
