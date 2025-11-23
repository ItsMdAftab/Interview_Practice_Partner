import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  RadarController,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  RadarController,
  Tooltip,
  Legend
);

export default function FullReport({ report, onBack }) {
  const barRef = useRef(null);
  const radarRef = useRef(null);

  const barChartInstance = useRef(null);
  const radarChartInstance = useRef(null);

  useEffect(() => {
    if (!report) return;

    const scores = [
      report.confidence,
      report.accuracy,
      report.communication
    ];

    if (barChartInstance.current) barChartInstance.current.destroy();
    barChartInstance.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: ["Confidence", "Accuracy", "Communication"],
        datasets: [
          {
            label: "Performance Scores",
            data: scores,
            backgroundColor: ["#667eea", "#ffa500", "#2d3a69"],
            borderWidth: 1,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

    if (radarChartInstance.current) radarChartInstance.current.destroy();
    radarChartInstance.current = new Chart(radarRef.current, {
      type: "radar",
      data: {
        labels: ["Confidence", "Accuracy", "Communication"],
        datasets: [
          {
            label: "Skill Radar",
            data: scores,
            backgroundColor: "rgba(102, 126, 234, 0.2)",
            borderColor: "#667eea",
            borderWidth: 2,
            pointBackgroundColor: "#667eea"
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (radarChartInstance.current) radarChartInstance.current.destroy();
    };
  }, [report]);

  if (!report) {
    return (
      <div className="full-report-container">
        <button className="back-btn" onClick={onBack}>⬅ Back</button>
        <p>No report available.</p>
      </div>
    );
  }

  return (
    <div className="full-report-container">

      <button className="back-btn" onClick={onBack}>⬅ Back to Interview</button>

      <h1 className="full-report-title">Interview Performance Report</h1>

      {/* ===== SCORE SUMMARY ===== */}
      <div className="scores-card">
        <ul>
          <li>⭐ Overall Score: {report.overall_score}/5</li>
          <li>💬 Communication: {report.communication}/5</li>
          <li>🎯 Accuracy: {report.accuracy}/5</li>
          <li>🔥 Confidence: {report.confidence}/5</li>
        </ul>
      </div>

      {/* ===== GRAPHS ===== */}
      <div className="graph-section" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        
        <div className="graph-box">
          <h3 className="graph-title">Bar Chart</h3>
          <canvas ref={barRef}></canvas>
        </div>

        <div className="graph-box">
          <h3 className="graph-title">Radar Chart</h3>
          <canvas ref={radarRef}></canvas>
        </div>

      </div>

      {/* ===== PER QUESTION ===== */}
      <h2 className="full-report-title" style={{ fontSize: "1.6rem" }}>
        Per-Question Analysis
      </h2>

      {report.questions.map((q, i) => (
        <div key={i} className="question-card">
          <h3>Question {i + 1}</h3>
          <p><strong>Question:</strong> {q.question}</p>
          <p><strong>Your Answer:</strong> {q.answer}</p>
          <p><strong>Quick Feedback:</strong> {q.brief_feedback}</p>
          <p><strong>Score:</strong> {q.score}/5</p>
          <p><strong>Detailed Analysis:</strong> {q.analysis}</p>
        </div>
      ))}
    </div>
  );
}
