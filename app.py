import os
import asyncio
import logging
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import Dict, Any
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GDS Voice AI Platform")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections: Dict[str, WebSocket] = {}

@app.get("/")
async def root():
    return {"message": "GDS Voice AI Platform", "status": "running", "team": "Growth Design Studio"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "active_sessions": len(active_connections)}

@app.get("/api/config")
async def get_config():
    """Get available providers for Indian market"""
    return {
        "stt_providers": {
            "sarvam": {"name": "Sarvam AI", "cost": "₹30/hour", "languages": ["hi-IN", "en-IN"]},
            "deepgram": {"name": "Deepgram", "cost": "$1.20/hour", "languages": ["en", "hi"]}
        },
        "tts_providers": {
            "sarvam": {"name": "Sarvam Bulbul", "cost": "₹15/10k chars", "voices": ["meera", "arjun"]},
            "elevenlabs": {"name": "ElevenLabs", "cost": "$3/10k chars", "voices": ["alloy"]}
        },
        "llm_providers": {
            "sarvam": {"name": "Sarvam-1", "cost": "FREE", "models": ["sarvam-1"]},
            "openai": {"name": "OpenAI", "cost": "$0.15/1M tokens", "models": ["gpt-4o-mini"]}
        }
    }

@app.post("/api/start-session")
async def start_voice_session(config: Dict[str, Any]):
    """Start a new voice agent session"""
    try:
        session_id = f"gds_session_{len(active_connections)}"
        
        return {
            "session_id": session_id,
            "status": "ready",
            "websocket_url": f"/ws/{session_id}",
            "config": config,
            "message": "GDS Voice AI session started"
        }
    except Exception as e:
        logger.error(f"Error starting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """Handle WebSocket connections for voice communication"""
    await websocket.accept()
    active_connections[session_id] = websocket
    
    try:
        logger.info(f"GDS Voice session connected: {session_id}")
        
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "test":
                response = {
                    "type": "bot_response",
                    "text": "Hello from GDS Voice AI! Ready to build amazing voice agents.",
                    "session_id": session_id
                }
                await websocket.send_text(json.dumps(response))
                
    except Exception as e:
        logger.error(f"WebSocket error for {session_id}: {e}")
    finally:
        if session_id in active_connections:
            del active_connections[session_id]

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
