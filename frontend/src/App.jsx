import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import ChatPanel from "./components/ChatPanel";
import SummaryPanel from "./components/SummaryPanel";
import FullReport from "./components/FullReport";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [summary, setSummary] = useState(null);
const [loadingReport, setLoadingReport] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [detailedReport, setDetailedReport] = useState(null);

  // Load Full Report
  async function handleViewFullReport() {
  setLoadingReport(true);

  try {
    const res = await fetch(`${API}/detailed_summary?session_id=${sessionId}`);
    const report = await res.json();

    setDetailedReport(report);
    setShowReport(true);
  } catch (err) {
    alert("Error fetching full report. Please try again.");
  }

  setLoadingReport(false);
}


  // Full Report Page
  if (showReport === true) {
    return (
      <FullReport
        report={detailedReport}
        onBack={() => setShowReport(false)}
      />
    );
  }
if (loadingReport) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.5rem",
      fontWeight: "600"
    }}>
      ⏳ Generating Full Report... This may take 10–30 seconds...
    </div>
  );
}

  // Default Interview Page
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
      <div style={{ width: "65%", padding: "20px", overflowY: "scroll" }}>
        <ControlPanel
          setSessionId={setSessionId}
          setMessages={setMessages}
          setInterviewFinished={setInterviewFinished}
        />

        <ChatPanel
          sessionId={sessionId}
          messages={messages}
          setMessages={setMessages}
          interviewFinished={interviewFinished}
          setInterviewFinished={setInterviewFinished}
          setSummary={setSummary}
        />
      </div>

      <div
        style={{
          width: "35%",
          padding: "20px",
          background: "white",
          borderLeft: "2px solid #ddd",
          overflowY: "scroll"
        }}
      >
        <SummaryPanel
          summary={summary}
          interviewFinished={interviewFinished}
          onViewFullReport={handleViewFullReport}
        />
      </div>
    </div>
  );
}

export default App;
