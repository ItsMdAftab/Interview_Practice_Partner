export default function SummaryPanel({ summary, interviewFinished, onViewFullReport }) {
  return (
    <div>
      <h2>Final Summary</h2>

      {!interviewFinished ? (
        <p>The summary will appear here after the interview.</p>
      ) : (
        <>
          <h3>Overall Score: {summary?.overall_score}</h3>

          <h4>Strengths:</h4>
          <ul>
            {summary?.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4>Areas to Improve:</h4>
          <ul>
            {summary?.areas_to_improve?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4>Tips:</h4>
          <ul>
            {summary?.tips?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <button
            onClick={onViewFullReport}
            style={{ marginTop: "10px", padding: "8px 15px" }}
          >
            View Full Report
          </button>
        </>
      )}
    </div>
  );
}
