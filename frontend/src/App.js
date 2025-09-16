import React, { useState } from 'react';
import { 
  ThemeProvider, 
  PipecatAppBase, 
  ConsoleTemplate,
  VoiceVisualizer,
  ConnectButton,
  UserAudioControl,
  Card,
  CardContent
} from '@pipecat-ai/voice-ui-kit';

const BACKEND_URL = process.env.REACT_APP_PIPECAT_API_URL || 'http://localhost:8000';

function GDSVoiceApp() {
  const [config, setConfig] = useState({
    language: 'hi-IN',
    stt: 'sarvam',
    tts: 'sarvam',
    llm: 'sarvam',
    speaker: 'meera'
  });

  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom Voice Interface for GDS Team
  const GDSCustomInterface = () => (
    <PipecatAppBase
      transportType="daily"
      connectParams={{
        webrtcUrl: `${BACKEND_URL}/api/start-session`,
      }}
      noThemeProvider={true}
    >
      {({ client, handleConnect, handleDisconnect, error }) => (
        <div className="max-w-4xl mx-auto p-6">
          <Card className="mb-6 border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GDS Voice AI Platform
                </h2>
                <p className="text-gray-600">Growth Design Studio • Voice Agent Builder</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">🇮🇳 India-First</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Hindi Support</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Affordable</span>
                </div>
              </div>
              
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">🚨 Error: {error}</p>
                </div>
              ) : null}

              {/* Voice Visualizer */}
              <div className="mb-8">
                <VoiceVisualizer
                  participantType="bot"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-200"
                />
              </div>

              {/* Configuration Display */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 border">
                <h3 className="font-bold mb-4 text-lg">🛠️ Current Configuration:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Language</span>
                    <div className="font-bold text-blue-600">{config.language}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Speaker</span>
                    <div className="font-bold text-purple-600">{config.speaker}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">STT</span>
                    <div className="font-bold text-green-600">{config.stt}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">TTS</span>
                    <div className="font-bold text-orange-600">{config.tts}</div>
                  </div>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-6 border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">💰 Cost Estimate (100 conversations/day):</h4>
                <div className="text-sm text-green-700">
                  STT: ₹100/day • TTS: ₹27/day • LLM: FREE • Total: ₹127/day (₹3,810/month)
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserAudioControl size="lg" />
                <ConnectButton
                  size="lg"
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PipecatAppBase>
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GDS Voice AI Platform
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Build affordable voice agents for the Indian market
            </p>
            <p className="text-gray-500">
              Growth Design Studio • Powered by Pipecat + Sarvam AI
            </p>
            
            {/* Mode Toggle */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  !isCustomMode 
                    ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1' 
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                }`}
              >
                🎛️ Console Template
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isCustomMode 
                    ? 'bg-purple-600 text-white shadow-lg transform -translate-y-1' 
                    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                }`}
              >
