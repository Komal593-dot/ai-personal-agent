from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "AI Personal Agent is alive 🤖"
    }


@app.post("/agent")
def run_agent(request: AgentRequest):
    return {
        "reply": f"I received your request: {request.message}"
    }