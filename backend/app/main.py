from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.session_store import SessionStore
from app.gemini_client import ask_gemini
from app.interview_logic import (
    generate_first_question,
    process_answer,
    generate_final_summary,
    generate_detailed_report,       # ← add this

)
from app.models import (
    StartInterviewRequest,
    StartInterviewResponse,
    AnswerRequest,
    AnswerResponse,
    SummaryResponse,
    DetailedSummaryResponse,        # ← add this

)


session_store = SessionStore()

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Interview Practice Partner Backend Running"}

@app.get("/test-gemini")
def test_gemini():
    # This calls the function we defined in gemini_client.py
    reply = ask_gemini("Say hi in one sentence.")
    return {"gemini_reply": reply}
@app.post("/start_interview", response_model=StartInterviewResponse)
def start_interview(req: StartInterviewRequest):
    # Create a new session
    session_id = session_store.create_session(
        role=req.role,
        level=req.level,
        persona=req.persona,
    )

    # Generate first question
    first_question = generate_first_question(req.role, req.level, req.persona)

    # Store first question in session
    session_store.append_to_list(session_id, "questions", first_question)

    meta = {
        "role": req.role,
        "level": req.level,
        "persona": req.persona,
        "question_index": 1,
    }

    return StartInterviewResponse(
        session_id=session_id,
        first_question=first_question,
        meta=meta,
    )
@app.post("/answer", response_model=AnswerResponse)
def answer_question(req: AnswerRequest):
    session = session_store.get_session(req.session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Let process_answer handle answers & feedback
    result = process_answer(session, req.answer)

    # Store brief feedback in session history (already done in process_answer, but safe)
    feedback_entry = {
        "brief_feedback": result.get("feedback", {}).get("brief_feedback", "")
    }
    session_store.append_to_list(req.session_id, "feedback", feedback_entry["brief_feedback"])

    # Next question text (if any)
    next_question_text = ""
    if isinstance(result.get("next_question"), dict):
        next_question_text = result["next_question"].get("question", "") or ""
    elif isinstance(result.get("next_question"), str):
        next_question_text = result["next_question"]

    # Build response
    feedback_model = {"brief_feedback": result.get("feedback", {}).get("brief_feedback", "")}

    followup_model = {
        "should_ask": False,      # we merged follow-up into next_question already
        "question": ""
    }

    next_q_model = {
        "question": next_question_text,
        "question_type": "general",
        "difficulty": "medium",
    }

    status = result.get("interview_status", "in_progress")
    if status == "finished":
        session_store.finish_session(req.session_id)

    return AnswerResponse(
        feedback=feedback_model,
        follow_up=followup_model,
        next_question=next_q_model,
        interview_status="finished" if status == "finished" else "in_progress",
    )
@app.get("/summary", response_model=SummaryResponse)
def get_summary(session_id: str):
    session = session_store.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    summary = generate_final_summary(session)

    return SummaryResponse(
        overall_score=summary.get("overall_score", 3),
        strengths=summary.get("strengths", []),
        areas_to_improve=summary.get("areas_to_improve", []),
        tips=summary.get("tips", []),
    )
@app.get("/detailed_summary", response_model=DetailedSummaryResponse)
def get_detailed_summary(session_id: str):
    session = session_store.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    report = generate_detailed_report(session)

    return DetailedSummaryResponse(
        overall_score=report.get("overall_score", 3),
        confidence=report.get("confidence", 3),
        accuracy=report.get("accuracy", 3),
        communication=report.get("communication", 3),
        questions=report.get("questions", []),
    )

