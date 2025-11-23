export default function SummaryPanel({ summary, interviewFinished, onViewFullReport }) {
  return (
    <div className="summary-container">

      <h2 className="summary-title">Final Summary</h2>

      {!interviewFinished ? (
        <p className="summary-placeholder">The summary will appear here after the interview.</p>
      ) : (
        <>
          

          <div className="summary-section">
            <h4>Strengths</h4>
            <ul>
              {summary?.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="summary-section">
            <h4>Areas to Improve</h4>
            <ul>
              {summary?.areas_to_improve?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="summary-section">
            <h4>Tips</h4>
            <ul>
              {summary?.tips?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <button className="full-report-btn" onClick={onViewFullReport}>
            View Full Report
          </button>
        </>
      )}
    </div>
  );
}
