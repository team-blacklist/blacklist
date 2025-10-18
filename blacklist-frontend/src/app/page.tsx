'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

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
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: '100vh',
        background: 'black',
        padding: '32px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {/* Left Column - Logo and Test Form */}
            <div style={{ width: '25%', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Logo Section */}
              <div>
                <h1 style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: 'white',
                  margin: 0,
                  fontFamily: "Broadway, sans-serif",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  blacklist
                </h1>
                <p style={{
                  color: '#93c5fd',
                  marginTop: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  We break in so hackers can't
                </p>
              </div>

              {/* Test Form */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  marginTop: 0,
                  marginBottom: '24px'
                }}>
                  Test Your Website
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* URL Input */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#bfdbfe',
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
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6'
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>

                  {/* Checkbox */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
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
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                        required
                      />
                      <span style={{
                        fontSize: '14px',
                        color: '#bfdbfe',
                        lineHeight: '1.5'
                      }}>
                        I confirm that I own this webapp and give full permissions for blacklist to test this website
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '500',
                      color: 'white',
                      fontSize: '14px',
                      border: 'none',
                      cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
                      background: isFormValid && !loading
                        ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      opacity: isFormValid && !loading ? 1 : 0.5,
                      transition: 'all 0.2s',
                      boxShadow: isFormValid && !loading ? '0 10px 25px -5px rgba(37, 99, 235, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid && !loading) {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(37, 99, 235, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = isFormValid && !loading ? '0 10px 25px -5px rgba(37, 99, 235, 0.3)' : 'none'
                    }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg
                          style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            style={{ opacity: 0.25 }}
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            style={{ opacity: 0.75 }}
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Testing...
                      </span>
                    ) : (
                      'Start Testing'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Two Column Layout */}
            <div style={{ flex: 1, display: 'flex', gap: '32px', height: 'calc(100vh - 64px)' }}>
              {/* Vulnerability Summary */}
              <div style={{ flex: 1 }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginTop: 0,
                    marginBottom: '24px'
                  }}>
                    Vulnerability Summary
                  </h2>
                  <div style={{
                    flex: 1,
                    color: 'rgba(147, 197, 253, 0.5)',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    Results will appear here after testing
                  </div>
                </div>
              </div>

              {/* Terminal Output */}
              <div style={{ flex: 1 }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: "'Courier New', monospace"
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#4ade80',
                    marginTop: 0,
                    marginBottom: '24px',
                    fontFamily: "'Orbitron', sans-serif"
                  }}>
                    Terminal Output
                  </h2>
                  <div style={{
                    flex: 1,
                    color: '#4ade80',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.5
                  }}>
                    $ Waiting for scan to start...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          input::placeholder {
            color: rgba(147, 197, 253, 0.3);
          }
        `}</style>
      </div>
    </>
  )
}