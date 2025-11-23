import json
from app.gemini_client import ask_gemini

# -----------------------------
# Question Limit Helper
# -----------------------------
def get_question_limit(level):
    level = level.lower()
    if level == "fresher":
        return 5
    if level == "junior":
        return 6
    if level == "mid-level":
        return 7
    if level in ["senior", "experienced"]:
        return 7
    return 5


# -----------------------------
# Generate First Interview Question
# -----------------------------
def generate_first_question(role: str, level: str, persona: str):
    prompt = f"""
You are an AI interview instructor.
Ask ONLY ONE opening interview question.
Avoid bullet points. Respond as plain text.

Role: {role}
Level: {level}
Persona: {persona}
"""

    question = ask_gemini(prompt)
    return question.strip()


# -----------------------------
# Evaluate Answer + Create Next Question
# (UPDATED PRODUCTION VERSION)
# -----------------------------
def process_answer(session, user_answer: str):
    role = session["role"]
    level = session["level"]
    persona = session["persona"]
    last_question = session["questions"][-1] if session["questions"] else None

    # Save answer
    session["answers"].append(user_answer)

    # Ensure feedback list exists
    if "feedback" not in session:
        session["feedback"] = []

    asked = len(session["questions"])
    limit = get_question_limit(level)

    # If we already reached the limit → stop
    if asked >= limit:
        return {
            "interview_status": "finished",
            "feedback": {"brief_feedback": "Preparing final summary..."},
            "next_question": None
        }

    # Gemini prompt for LIGHT feedback
    prompt = f"""
You are a mock interviewer. Provide LIGHT FEEDBACK (1 short sentence).
Then decide if a follow-up question is needed.

Return ONLY JSON.

User Persona: {persona}
Role: {role}
Level: {level}

Previous question:
\"{last_question}\"

User answer:
\"{user_answer}\"

Return EXACT JSON:
{{
  "brief_feedback": "short 1-sentence feedback",
  "should_ask_followup": true/false,
  "followup_question": "string or empty",
  "next_question": "string if no follow-up"
}}
"""

    raw = ask_gemini(prompt)
    cleaned = raw.replace("```json", "").replace("```", "").strip()

    import json
    try:
        result = json.loads(cleaned)
    except:
        result = {
            "brief_feedback": "Try answering more clearly.",
            "should_ask_followup": False,
            "followup_question": "",
            "next_question": "Let’s continue — can you elaborate more?"
        }

    # Save brief feedback
    session["feedback"].append(result["brief_feedback"])

    # Determine next question
    if result["should_ask_followup"]:
        next_q = result["followup_question"]
    else:
        next_q = result["next_question"]

    session["questions"].append(next_q)

    # Check question limit again
    if len(session["questions"]) >= limit:
        return {
            "interview_status": "finished",
            "feedback": {"brief_feedback": result["brief_feedback"]},
            "next_question": None
        }

    return {
        "interview_status": "ongoing",
        "feedback": {"brief_feedback": result["brief_feedback"]},
        "next_question": {"question": next_q}
    }


# -----------------------------
# Generate Final Summary
# -----------------------------
def generate_final_summary(session):
    role = session["role"]
    level = session["level"]

    prompt = f"""
You are an interview evaluator.

Summarize the candidate’s performance.

Role: {role}
Level: {level}

Questions:
{session['questions']}

Answers:
{session['answers']}

Feedback snippets (1-sentence feedback after each answer):
{session['feedback']}

Return EXACT JSON:
{{
  "overall_score": 1,
  "strengths": ["item 1","item 2"],
  "areas_to_improve": ["item 1","item 2"],
  "tips": ["item 1","item 2"]
}}
"""

    raw = ask_gemini(prompt)
    cleaned = raw.replace("```json", "").replace("```", "").strip()

    import json
    try:
        summary = json.loads(cleaned)
    except:
        summary = {
            "overall_score": 3,
            "strengths": ["Good communication"],
            "areas_to_improve": ["Give more structured answers"],
            "tips": ["Use STAR method for answering"]
        }

    return summary
def generate_detailed_report(session):
    questions = session.get("questions", [])
    answers = session.get("answers", [])
    feedback = session.get("feedback", [])

    detailed_list = []

    for i in range(len(questions)):
        q = questions[i] if i < len(questions) else ""
        a = answers[i] if i < len(answers) else ""
        fb = feedback[i] if i < len(feedback) else ""

        analysis_prompt = f"""
You are an expert interview evaluator.

Analyze this specific interview question deeply:

Question: "{q}"
Answer: "{a}"
Preliminary feedback: "{fb}"

Provide a detailed analysis including:
- What was good in the answer
- What was missing
- How the candidate could improve
- A short evaluation of reasoning, communication, and accuracy

Write the assessment in 3–6 sentences, clear and professional.
"""

        analysis_text = ask_gemini(analysis_prompt)

        detailed_list.append({
            "question": q,
            "answer": a,
            "brief_feedback": fb,
            "score": 3,  # you can later compute this from performance if you want
            "analysis": analysis_text.strip()
        })

    # ---- Overall performance metrics ----
    performance_prompt = f"""
You are an expert interview evaluator.

Evaluate the candidate's overall performance based on the ENTIRE interview.

Questions:
{questions}

Answers:
{answers}

Brief Feedback per answer:
{feedback}

Now rate the following on a scale of 1 to 5 (integers):

Return EXACT JSON like this:
{{
  "overall_score": 3,
  "confidence": 4,
  "accuracy": 3,
  "communication": 5
}}
"""

    performance_raw = ask_gemini(performance_prompt)
    performance_cleaned = (
        performance_raw.replace("```json", "").replace("```", "").strip()
    )

    try:
        performance = json.loads(performance_cleaned)
    except Exception:
        performance = {
            "overall_score": 3,
            "confidence": 3,
            "accuracy": 3,
            "communication": 3,
        }

    report = {
        "overall_score": performance.get("overall_score", 3),
        "confidence": performance.get("confidence", 3),
        "accuracy": performance.get("accuracy", 3),
        "communication": performance.get("communication", 3),
        "questions": detailed_list,
    }

    return report
