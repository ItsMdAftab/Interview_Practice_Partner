import { useState, useRef, useEffect } from "react";
import VoiceControls from "./VoiceControls";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function ChatPanel({
  sessionId,
  messages,
  setMessages,
  interviewFinished,
  setInterviewFinished,
  setSummary
}) {
  const [answer, setAnswer] = useState("");

  // ===== AUTO SCROLL REF =====
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---------------------------
  // SEND TEXT ANSWER
  // ---------------------------
  async function sendAnswer() {
    if (!answer.trim()) return;

    setMessages(prev => [...prev, { sender: "you", text: answer }]);

    const res = await fetch(`${API}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        answer: answer,
        time_taken_sec: 10
      })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      {
        sender: "feedback",
        text: data.feedback?.brief_feedback || "Answer not understood, please try again."
      }
    ]);

    if (data.interview_status === "finished") {
      setInterviewFinished(true);

      const summaryRes = await fetch(`${API}/summary?session_id=${sessionId}`);
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      setMessages(prev => [
        ...prev,
        { sender: "interviewer", text: "Interview completed. Check your summary on the right." }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          sender: "interviewer",
          text:
            data.next_question?.question ||
            data.followup_question ||
            "Let’s continue. Can you explain that more?"
        }
      ]);
    }

    setAnswer("");
  }

  // ---------------------------
  // SEND VOICE ANSWER
  // ---------------------------
  function handleVoiceInput(text) {
    sendAnswerFromVoice(text);
  }

  async function sendAnswerFromVoice(text) {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "you", text }]);

    const res = await fetch(`${API}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        answer: text,
        time_taken_sec: 5
      })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      {
        sender: "feedback",
        text: data.feedback?.brief_feedback || "Could not process your answer. Try again."
      }
    ]);

    if (data.interview_status === "finished") {
      setInterviewFinished(true);

      const summaryRes = await fetch(`${API}/summary?session_id=${sessionId}`);
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      setMessages(prev => [
        ...prev,
        { sender: "interviewer", text: "Interview completed. Check your summary on the right." }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          sender: "interviewer",
          text:
            data.next_question?.question ||
            data.followup_question ||
            "Let’s continue. Can you explain that more?"
        }
      ]);
    }
  }

  // ---------------------------
  // RENDER UI
  // ---------------------------
  return (
    <div className="chat-container">

      <h2 className="chat-header">Interview Chat</h2>

      <div className="messages-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.sender}`}>
            <strong>{msg.sender.toUpperCase()}:</strong> {msg.text}
          </div>
        ))}

        {/* AUTO-SCROLL TARGET */}
        <div ref={messagesEndRef}></div>
      </div>

      {!interviewFinished && (
        <>
          <div className="voice-controls-wrapper">
            <VoiceControls
              onVoiceFinalInput={handleVoiceInput}
              lastInterviewerMessage={
                messages.length > 0 &&
                messages[messages.length - 1].sender === "interviewer"
                  ? messages[messages.length - 1].text
                  : ""
              }
            />
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button className="send-btn" onClick={sendAnswer}>Send</button>
          </div>
        </>
      )}

    </div>
  );
}
