import { useState } from "react";     // ← YOU FORGOT THIS!
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
export default function ControlPanel({ setSessionId, setMessages, setInterviewFinished }) {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [persona, setPersona] = useState("");

  async function startInterview() {
    if (!role || !level || !persona) {
      alert("Please select all fields");
      return;
    }

    const res = await fetch(`${API}/start_interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, level, persona })
    });

    const data = await res.json();

    setSessionId(data.session_id);
    setMessages([{ sender: "interviewer", text: data.first_question }]);
    setInterviewFinished(false);
  }

  return (
    <div className="control-panel-container">

      <h2>Start Interview</h2>

      <select className="select-box" value={role} onChange={e => setRole(e.target.value)}>
        <option value="">Choose Role</option>
        <option value="Software Engineer">Software Engineer</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Retail Associate">Retail Associate</option>
        <option value="Sales Executive">Sales Executive</option>
      </select>

      <select className="select-box" value={level} onChange={e => setLevel(e.target.value)}>
        <option value="">Choose Level</option>
        <option value="Fresher">Fresher</option>
        <option value="Junior">Junior</option>
        <option value="Mid-Level">Mid-Level</option>
        <option value="Senior">Senior</option>
      </select>

      <select className="select-box" value={persona} onChange={e => setPersona(e.target.value)}>
        <option value="">Choose Persona</option>
        <option value="Efficient User">Efficient User</option>
        <option value="Confused User">Confused User</option>
        <option value="Chatty User">Chatty User</option>
        <option value="Edge Case User">Edge Case User</option>
      </select>

      <button className="start-btn" onClick={startInterview}>Start</button>
    </div>
  );
}
