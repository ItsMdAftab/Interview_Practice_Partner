from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# ---------- Request Models ----------

class StartInterviewRequest(BaseModel):
    role: str
    level: str
    persona: str


class AnswerRequest(BaseModel):
    session_id: str
    answer: str
    time_taken_sec: Optional[int] = None


# ---------- Response Models ----------

class StartInterviewResponse(BaseModel):
    session_id: str
    first_question: str
    meta: Dict[str, Any]


class FeedbackModel(BaseModel):
    brief_feedback: str



class FollowUpModel(BaseModel):
    should_ask: bool
    question: Optional[str] = ""


class NextQuestionModel(BaseModel):
    question: Optional[str] = ""
    question_type: Optional[str] = "general"
    difficulty: Optional[str] = "medium"


class AnswerResponse(BaseModel):
    feedback: FeedbackModel
    follow_up: FollowUpModel
    next_question: NextQuestionModel
    interview_status: str  # "in_progress" or "finished"


class SummaryResponse(BaseModel):
    overall_score: float
    strengths: List[str]
    areas_to_improve: List[str]
    tips: List[str]
class QuestionReview(BaseModel):
    question: str
    answer: str
    brief_feedback: str
    score: int
    analysis: str


class DetailedSummaryResponse(BaseModel):
    overall_score: float
    confidence: int
    accuracy: int
    communication: int
    questions: List[QuestionReview]
