"use client";
import { useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [analysisLines, setAnalysisLines] = useState<string[]>([]);
  const [socialEngLoading, setSocialEngLoading] = useState(false);
  const [socialEngResult, setSocialEngResult] = useState<{
    success: boolean;
    transcript: string;
    batchId: string;
  } | null>(null);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isFormValid = url.trim() !== "" && isValidUrl(url) && confirmed;

  // Poll for social engineering call status
  const pollCallStatus = async (batchId: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:3001/social-engineering/status/${batchId}`);
        if (response.ok) {
          const data = await response.json();
          
          console.log("Poll attempt", attempts + 1, "- Batch status:", data.call_status, "- Recipient status:", data.recipient_status, "- Has transcript:", !!data.transcript);
          
          // Check if we have a transcript (indicating the call is truly complete)
          if (data.transcript && data.transcript.length > 0) {
            setSocialEngLoading(false);
            setSocialEngResult({
              success: data.social_engineering_success,
              transcript: data.transcript,
              batchId: batchId
            });
            return;
          }
          
          // Or if the recipient call explicitly failed or completed without transcript
          if (data.recipient_status === "failed" || data.recipient_status === "completed") {
            setSocialEngLoading(false);
            setSocialEngResult({
              success: data.social_engineering_success || false,
              transcript: data.transcript || "Call completed without transcript",
              batchId: batchId
            });
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setSocialEngLoading(false);
          setSocialEngResult({
            success: false,
            transcript: "Call timeout - status unknown",
            batchId: batchId
          });
        }
      } catch (error) {
        console.error("Error polling call status:", error);
        setSocialEngLoading(false);
      }
    };

    poll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setTerminalLines(["$ Starting security scan..."]); // Initial message
    setAnalysisLines(["Initializing vulnerability analysis..."]);

    try {
      // Wait for the backend to complete the entire pen test
      setTerminalLines((prev) => [...prev, "$ Connecting to target..."]);

      const response = await fetch("http://localhost:3001/test-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Test result:", data);

      setTerminalLines((prev) => [
        ...prev,
        "$ Scan completed! Loading results...",
      ]);
      setAnalysisLines((prev) => [...prev, "Processing findings..."]);

      // Small delay to ensure files are written
      await new Promise((res) => setTimeout(res, 500));

      // Now fetch the result files (they should exist now)
      try {
        // Fetch penTest.txt for Terminal Output
        const penResponse = await fetch(
          "http://localhost:3001/results/penTest.txt"
        );
        if (penResponse.ok) {
          const penText = await penResponse.text();
          const penLines = penText.split("\n").filter((line) => line.trim());

          setTerminalLines(["$ === PENETRATION TEST RESULTS ===", ""]);
          for (let line of penLines) {
            setTerminalLines((prev) => [...prev, line]);
            await new Promise((res) => setTimeout(res, 30)); // 30ms per line for animation
          }
        } else {
          setTerminalLines((prev) => [
            ...prev,
            "$ Warning: Could not load penTest.txt",
          ]);
        }
      } catch (err) {
        setTerminalLines((prev) => [
          ...prev,
          `$ Error loading terminal output: ${err}`,
        ]);
      }

      try {
        // Fetch analysis.txt for Vulnerability Summary
        const analysisResponse = await fetch(
          "http://localhost:3001/results/analysis.txt"
        );
        if (analysisResponse.ok) {
          const analysisText = await analysisResponse.text();
          const analysisLinesArray = analysisText
            .split("\n")
            .filter((line) => line.trim());

          setAnalysisLines(["=== SECURITY ANALYSIS ===", ""]);
          for (let line of analysisLinesArray) {
            setAnalysisLines((prev) => [...prev, line]);
            await new Promise((res) => setTimeout(res, 30));
          }
        } else {
          setAnalysisLines((prev) => [
            ...prev,
            "Warning: Could not load analysis.txt",
          ]);
        }
      } catch (err) {
        setAnalysisLines((prev) => [...prev, `Error loading analysis: ${err}`]);
      }
    } catch (error) {
      console.error("Error testing website:", error);
      setTerminalLines((prev) => [...prev, "", `$ ERROR: ${error}`]);
      setAnalysisLines((prev) => [...prev, "", `Error: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          background: "black",
          padding: "32px 32px 32px 16px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
          >
            {/* Left Column - Logo and Test Form */}
            <div
              style={{
                width: "20%",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              {/* Logo Section */}
              <div style={{ position: "relative" }}>
                <h1
                  style={{
                    fontSize: "40px",
                    fontWeight: "900",
                    color: "white",
                    margin: 0,
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  blacklist
                </h1>
                <p
                  style={{
                    color: "#93c5fd",
                    marginTop: "12px",
                    fontSize: "16px",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                  }}
                >
                  We break in so hackers can't
                </p>
              </div>

              {/* Test Form */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "8px",
                  padding: "32px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                    marginTop: 0,
                    marginBottom: "24px",
                  }}
                >
                  Test Your Website
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* URL Input */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#bfdbfe",
                        marginBottom: "8px",
                      }}
                    >
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                      required
                    />
                  </div>

                  {/* Checkbox */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "4px",
                      padding: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        style={{
                          marginTop: "4px",
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#3b82f6",
                        }}
                        required
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#bfdbfe",
                          lineHeight: "1.5",
                        }}
                      >
                        I confirm that I own this webapp and give full
                        permissions for blacklist to test this website
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      fontWeight: "500",
                      color: "white",
                      fontSize: "14px",
                      border: "none",
                      cursor:
                        isFormValid && !loading ? "pointer" : "not-allowed",
                      background:
                        isFormValid && !loading
                          ? "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                      opacity: isFormValid && !loading ? 1 : 0.5,
                      transition: "all 0.2s",
                      boxShadow:
                        isFormValid && !loading
                          ? "0 10px 25px -5px rgba(37, 99, 235, 0.3)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid && !loading) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 15px 30px -5px rgba(37, 99, 235, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        isFormValid && !loading
                          ? "0 10px 25px -5px rgba(37, 99, 235, 0.3)"
                          : "none";
                    }}
                  >
                    {loading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <svg
                          style={{
                            animation: "spin 1s linear infinite",
                            width: "20px",
                            height: "20px",
                          }}
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
                      "Start Testing"
                    )}
                  </button>

                  {/* Social Engineering Attack Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!url || !isValidUrl(url)) return;
                      setSocialEngLoading(true);
                      setSocialEngResult(null);
                      
                      try {
                        const response = await fetch("http://localhost:3001/social-engineering", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ url }),
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          console.log("Social engineering call initiated:", data);
                          
                          if (data.batch_id) {
                            // Start polling for call status
                            pollCallStatus(data.batch_id);
                          } else {
                            setSocialEngLoading(false);
                          }
                        } else {
                          setSocialEngLoading(false);
                          console.error("Failed to initiate call");
                        }
                      } catch (error) {
                        setSocialEngLoading(false);
                        console.error("Error:", error);
                      }
                    }}
                    disabled={!url || !isValidUrl(url) || socialEngLoading}
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      fontWeight: "500",
                      color: "white",
                      fontSize: "14px",
                      border: "none",
                      cursor: (url && isValidUrl(url) && !socialEngLoading) ? "pointer" : "not-allowed",
                      background: (url && isValidUrl(url) && !socialEngLoading)
                        ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                        : "rgba(255, 255, 255, 0.1)",
                      opacity: (url && isValidUrl(url) && !socialEngLoading) ? 1 : 0.5,
                      transition: "all 0.2s",
                      boxShadow: (url && isValidUrl(url) && !socialEngLoading)
                        ? "0 10px 25px -5px rgba(220, 38, 38, 0.3)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (url && isValidUrl(url)) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(220, 38, 38, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = url && isValidUrl(url)
                        ? "0 10px 25px -5px rgba(220, 38, 38, 0.3)"
                        : "none";
                    }}
                  >
                    {socialEngLoading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <svg
                          style={{
                            animation: "spin 1s linear infinite",
                            width: "20px",
                            height: "20px",
                          }}
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
                        Calling...
                      </span>
                    ) : (
                      "Attempt Social Engineering Attack"
                    )}
                  </button>

                  {/* Social Engineering Results */}
                  {socialEngResult && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "20px",
                        borderRadius: "8px",
                        border: socialEngResult.success 
                          ? "3px solid #dc2626" 
                          : "3px solid #16a34a",
                        background: socialEngResult.success 
                          ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)" 
                          : "linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(21, 128, 61, 0.1) 100%)",
                        animation: socialEngResult.success ? "disaster 2s ease-in-out" : "celebration 2s ease-in-out",
                        boxShadow: socialEngResult.success
                          ? "0 0 30px rgba(220, 38, 38, 0.5), 0 0 60px rgba(220, 38, 38, 0.3)"
                          : "0 0 30px rgba(22, 163, 74, 0.5), 0 0 60px rgba(22, 163, 74, 0.3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ 
                          fontSize: "48px", 
                          animation: socialEngResult.success ? "shake 0.5s infinite" : "bounce 1s infinite",
                          textShadow: "0 0 20px currentColor"
                        }}>
                          {socialEngResult.success ? "💀🚨⚡" : "🛡️✅🎉"}
                        </div>
                        <div
                          style={{
                            color: socialEngResult.success ? "#dc2626" : "#16a34a",
                            fontWeight: "900",
                            fontSize: "20px",
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            textShadow: socialEngResult.success 
                              ? "0 0 10px #dc2626, 0 0 20px #dc2626" 
                              : "0 0 10px #16a34a, 0 0 20px #16a34a",
                            animation: "pulse 1s infinite",
                          }}
                        >
                          {socialEngResult.success 
                            ? "🔥 CRITICAL BREACH DETECTED 🔥" 
                            : "🎯 FORTRESS SECURED 🎯"}
                        </div>
                        <div
                          style={{
                            color: socialEngResult.success ? "#fca5a5" : "#86efac",
                            fontWeight: "600",
                            fontSize: "16px",
                            textAlign: "center",
                            fontFamily: "'Courier New', monospace",
                          }}
                        >
                          {socialEngResult.success 
                            ? "⚠️ SOCIAL ENGINEERING ATTACK SUCCEEDED ⚠️" 
                            : "✨ TARGET SUCCESSFULLY DEFENDED ✨"}
                        </div>
                      </div>

                      {socialEngResult.transcript && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#bfdbfe",
                            fontFamily: "'Courier New', monospace",
                            background: "rgba(0, 0, 0, 0.5)",
                            padding: "12px",
                            borderRadius: "6px",
                            maxHeight: "120px",
                            overflowY: "auto",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <div style={{ 
                            marginBottom: "8px", 
                            color: "#93c5fd", 
                            fontWeight: "bold",
                            borderBottom: "1px solid rgba(147, 197, 253, 0.3)",
                            paddingBottom: "4px"
                          }}>
                            📞 CALL TRANSCRIPT:
                          </div>
                          {socialEngResult.transcript}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Two Column Layout */}
            <div
              style={{
                flex: 1,
                display: "flex",
                gap: "32px",
                height: "calc(100vh - 64px)",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              {/* Vulnerability Summary */}
              <div style={{ flex: 1.3, minWidth: 0 }}>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "8px",
                    padding: "32px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "white",
                      marginTop: 0,
                      marginBottom: "24px",
                    }}
                  >
                    Vulnerability Summary
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      fontSize: "14px",
                      overflowY: "auto",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {analysisLines.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "rgba(147, 197, 253, 0.5)",
                        }}
                      >
                        Results will appear here after testing
                      </div>
                    ) : (
                      <MarkdownRenderer content={analysisLines.join("\n")} />
                    )}
                  </div>
                </div>
              </div>

              {/* Terminal Output */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "8px",
                    padding: "32px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Courier New', monospace",
                    overflow: "hidden",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#4ade80",
                      marginTop: 0,
                      marginBottom: "24px",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    Terminal Output
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      color: "#4ade80",
                      fontSize: "13px",
                      overflowY: "auto",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      opacity: terminalLines.length === 0 ? 0.5 : 1,
                    }}
                  >
                    {terminalLines.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        $ Waiting for scan to start...
                      </div>
                    ) : (
                      terminalLines.map((line, i) => (
                        <div key={i}>{line || "\u00A0"}</div>
                      ))
                    )}
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
          
          @keyframes disaster {
            0% { transform: scale(0.8) rotate(-3deg); opacity: 0; }
            25% { transform: scale(1.1) rotate(3deg); }
            50% { transform: scale(1.05) rotate(-1deg); }
            75% { transform: scale(1.02) rotate(1deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          
          @keyframes celebration {
            0% { transform: scale(0.8) translateY(20px); opacity: 0; }
            25% { transform: scale(1.1) translateY(-10px); }
            50% { transform: scale(1.05) translateY(5px); }
            75% { transform: scale(1.02) translateY(-2px); }
            100% { transform: scale(1) translateY(0px); opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          
          input::placeholder {
            color: rgba(147, 197, 253, 0.3);
          }
        `}</style>
      </div>
    </>
  );
}
