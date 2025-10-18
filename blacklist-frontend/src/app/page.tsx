'use client'

import LiveView from '@/components/LiveView'
import { useEffect, useState } from 'react'


export default function Home() {
  const [url, setUrl] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [liveViewLink, setLiveViewLink] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [testingStarted, setTestingStarted] = useState(false)

  useEffect(() => {
    const initBrowser = async () => {
      try {
        console.log('🚀 Initializing browser session...')
        const response = await fetch('http://localhost:3001/browser/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Send empty object
        })
        
        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Response data:', data)
        
        if (data.success && data.liveViewLink) {
          setLiveViewLink(data.liveViewLink)
          console.log('✅ Browser session initialized:', data.liveViewLink)
        } else {
          console.error('❌ Failed to initialize browser')
          console.error('Data received:', data)
        }
      } catch (error) {
        console.error('❌ Error initializing browser:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initBrowser()
  }, [])

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
    setTestingStarted(true)

    try {
      const response = await fetch('http://localhost:3001/test-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      console.log('✅ Test result:', data)

      // Update live view link if returned (in case it changed)
      if (data.liveViewLink) {
        setLiveViewLink(data.liveViewLink)
      }
    } catch (error) {
      console.error('❌ Error testing website:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #ddd',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ fontSize: '18px', color: '#333', fontWeight: '600' }}>
            Initializing browser session...
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Setting up Browserbase...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {testingStarted && liveViewLink ? (
        <LiveView liveViewLink={liveViewLink} />
      ) : (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '450px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '40px 30px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
              color: '#111'
            }}>
              blacklist
            </h1>
            
            {liveViewLink && (
              <div style={{
                marginBottom: '24px',
                padding: '12px 16px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#047857',
                    fontWeight: '500'
                  }}>
                    Browser session ready
                  </span>
                </div>
              </div>
            )}

            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    style={{
                      marginTop: '4px',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                    I confirm that I own this webapp and give full permissions for blacklist to test this website
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: isFormValid && !loading ? '#000' : '#d1d5db',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !loading) {
                    e.currentTarget.style.backgroundColor = '#1f2937'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid && !loading) {
                    e.currentTarget.style.backgroundColor = '#000'
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Testing...
                  </span>
                ) : (
                  'Start Testing'
                )}
              </button>
            </div>

            {liveViewLink && !testingStarted && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px'
              }}>
                <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.5' }}>
                  <strong>Ready to test!</strong> Once you start testing, you'll see the live browser view where you can watch the automation in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {testingStarted && (
        <button
          onClick={() => {
            setTestingStarted(false)
            setUrl('')
            setConfirmed(false)
          }}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            padding: '12px 24px',
            backgroundColor: 'white',
            border: '2px solid #d1d5db',
            color: '#374151',
            fontWeight: '600',
            borderRadius: '24px',
            cursor: 'pointer',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          ← Back to Form
        </button>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}