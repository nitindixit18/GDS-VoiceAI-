import React, { useState } from 'react';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState({
    language: 'hi-IN',
    stt: 'sarvam',
    tts: 'sarvam',
    llm: 'sarvam'
  });

  const BACKEND_URL = process.env.REACT_APP_PIPECAT_API_URL || 'http://localhost:8000';

  const handleConnect = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      console.log('Session started:', data);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          GDS Voice AI Platform
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
          Voice AI Agent builder for Growth Design Studio Team members
        </p>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
            🎤 Voice Interface Status
          </h2>
          
          <div style={{
            backgroundColor: isConnected ? '#dcfce7' : '#fef3c7',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <p style={{ 
              color: isConnected ? '#16a34a' : '#ca8a04',
              fontWeight: 'bold',
              margin: 0 
            }}>
              {isConnected ? '✅ Connected to Voice AI' : '⏳ Ready to Connect'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
              <strong>Language:</strong><br/>
              <span style={{ color: '#3b82f6' }}>{config.language}</span>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
              <strong>STT:</strong><br/>
              <span style={{ color: '#10b981' }}>{config.stt}</span>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
              <strong>TTS:</strong><br/>
              <span style={{ color: '#f59e0b' }}>{config.tts}</span>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
              <strong>LLM:</strong><br/>
              <span style={{ color: '#8b5cf6' }}>{config.llm}</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ecfdf5',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #d1fae5'
          }}>
            <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>
              💰 Cost Estimate (100 conversations/day):
            </h4>
            <p style={{ color: '#059669', margin: 0, fontSize: '0.9rem' }}>
              STT: ₹100/day • TTS: ₹27/day • LLM: FREE • Total: ₹127/day (₹3,810/month)
            </p>
          </div>

          <button
            onClick={isConnected ? () => setIsConnected(false) : handleConnect}
            style={{
              backgroundColor: isConnected ? '#ef4444' : '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isConnected ? '🛑 Disconnect' : '🚀 Start Voice Agent'}
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>
            🇮🇳 India-First Voice AI Platform
          </h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              🇮🇳 Hindi Support
            </span>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              💰 Affordable Pricing
            </span>
            <span style={{
              backgroundColor: '#fae8ff',
              color: '#9333ea',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              🚀 Powered by Pipecat
            </span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#6b7280' }}>
          <p>Backend: {BACKEND_URL}</p>
          <p>Ready for Sarvam AI integration 🇮🇳</p>
        </div>
      </div>
    </div>
  );
}

export default App;
