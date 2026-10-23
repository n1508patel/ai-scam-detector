const LABELS = {
  scam: "Likely a scam",
  suspicious: "Suspicious",
  safe: "Looks safe",
};

export default function ResultCard({ result }) {
  return (
    <div className={`result ${result.verdict}`}>
      <div className="result-header">
        <h2>{LABELS[result.verdict]}</h2>
        <span className="score">{result.score}/100</span>
      </div>

      <span className={`ai-badge ${result.aiUsed ? "ai-on" : "ai-off"}`}>
        {result.aiUsed ? "✨ Analyzed by Gemini AI" : "⚙️ Rule-based analysis only"}
      </span>

      <div className="meter">
        <div className="meter-fill" style={{ width: `${result.score}%` }} />
      </div>

      {result.redFlags.length > 0 && (
        <>
          <h3>Red flags</h3>
          <ul>
            {result.redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </>
      )}

      <h3>Advice</h3>
      <p>{result.advice}</p>

      <p className="muted small">
        This is an automated suggestion, not a final decision. When in doubt, contact your
        bank or call 1930 (India cyber crime helpline).
      </p>
    </div>
  );
}