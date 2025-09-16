import os
import asyncio
import logging
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Pipecat imports
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.services.openai import OpenAILLMService
from pipecat.services.deepgram import DeepgramSTTService
from pipecat.services.elevenlabs import ElevenLabsTTSService
from pipecat.transports.services.daily import DailyParams, DailyTransport
from pipecat.vad.silero import SileroVADAnalyzer
from pipecat.vad.vad_analyzer import VADParams

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GDS Voice AI - Real Pipecat Integration")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RealVoiceAgent:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.deepgram_api_key = os.getenv('DEEPGRAM_API_KEY') 
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
        self.daily_api_key = os.getenv('DAILY_API_KEY')

    async def create_voice_pipeline(self, room_url: str, token: str):
        """Create actual Pipecat voice processing pipeline"""
        
        # Transport layer for real-time audio
        transport = DailyTransport(
            room_url,
            token,
            "GDS Voice AI Agent",
            DailyParams(
                audio_out_enabled=True,
                transcription_enabled=True,
                vad_enabled=True,
                vad_analyzer=SileroVADAnalyzer(
                    params=VADParams(stop_secs=0.8)
                ),
            )
        )

        # Speech-to-Text with Deepgram
        stt = DeepgramSTTService(api_key=self.deepgram_api_key)
        
        # Language Model with OpenAI
        llm = OpenAILLMService(
            api_key=self.openai_api_key,
            model="gpt-4o-mini"
        )
        
        # Text-to-Speech with ElevenLabs
        tts = ElevenLabsTTSService(
            api_key=self.elevenlabs_api_key,
            voice_id="pNInz6obpgDQGcFmaJgB",  # Adam voice
        )

        # LLM context for conversation memory
        context = OpenAILLMContext(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful AI assistant for Growth Design Studio. You help build voice AI applications for the Indian market. Keep responses concise and conversational."
                }
            ]
        )

        # Create the pipeline
        pipeline = Pipeline([
            transport.input(),   # Audio input
            stt,                 # Speech to text
            context,             # Conversation context
            llm,                 # Generate response
            tts,                 # Text to speech
            transport.output(),  # Audio output
        ])

        # Run the pipeline
        task = PipelineTask(pipeline, PipelineParams(allow_interruptions=True))
        
        runner = PipelineRunner()
        await runner.run(task)

voice_agent = RealVoiceAgent()

@app.get("/")
async def root():
    return {
        "message": "GDS Real Voice AI Agent",
        "status": "running",
        "pipecat": "enabled",
        "services": ["Deepgram STT", "OpenAI LLM", "ElevenLabs TTS"]
    }

@app.post("/api/create-room")
async def create_voice_room():
    """Create Daily room for voice conversation"""
    import requests
    
    if not voice_agent.daily_api_key:
        return {"error": "Daily API key not configured"}
    
    # Create Daily room
    response = requests.post(
        "https://api.daily.co/v1/rooms",
        headers={
            "Authorization": f"Bearer {voice_agent.daily_api_key}",
            "Content-Type": "application/json"
        },
        json={
            "properties": {
                "enable_chat": True,
                "start_audio_off": False,
                "start_video_off": True,
            }
        }
    )
    
    if response.status_code == 200:
        room_data = response.json()
        return {
            "room_url": room_data["url"],
            "room_name": room_data["name"],
            "status": "ready"
        }
    else:
        return {"error": "Failed to create room"}

@app.post("/api/start-agent/{room_name}")
async def start_voice_agent(room_name: str):
    """Start the actual voice agent in Daily room"""
    
    room_url = f"https://{room_name}.daily.co/{room_name}"
    token = None  # You can generate tokens for security
    
    # Start the voice pipeline
    asyncio.create_task(voice_agent.create_voice_pipeline(room_url, token))
    
    return {
        "status": "agent_started",
        "room_url": room_url,
        "message": "Voice agent is now listening in the room"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
