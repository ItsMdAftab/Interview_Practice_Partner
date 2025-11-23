import uuid
from typing import Dict, Any

class SessionStore:
    """
    Simple in-memory session storage.
    Stores interview sessions:
      - role
      - level
      - persona
      - questions asked
      - answers given
      - feedback per answer
      - interview status
    """

    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}

    def create_session(self, role: str, level: str, persona: str) -> str:
        session_id = str(uuid.uuid4())

        self.sessions[session_id] = {
            "session_id": session_id,
            "role": role,
            "level": level,
            "persona": persona,
            "questions": [],
            "answers": [],
            "feedback": [],
            "status": "in_progress",
        }

        return session_id

    def get_session(self, session_id: str) -> Dict[str, Any]:
        return self.sessions.get(session_id)

    def update_session(self, session_id: str, key: str, value):
        if session_id in self.sessions:
            self.sessions[session_id][key] = value

    def append_to_list(self, session_id: str, list_name: str, item):
        if session_id in self.sessions:
            self.sessions[session_id][list_name].append(item)

    def finish_session(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id]["status"] = "finished"
