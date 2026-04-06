import { Shield, AlertTriangle, CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";
import type { Screen, RiskResult } from "@/App";

interface Props {
  showScreen: (s: Screen) => void;
  result: RiskResult;
}

const riskConfig = {
  Low: {
    color: "text-green-400",
    bgColor: "bg-green-500/15",
    borderColor: "border-green-500/30",
    barColor: "bg-green-500",
    gradientFrom: "from-green-950/30",
    icon: CheckCircle,
    emoji: "✅",
    advice: "This transaction appears relatively safe. Still, stay cautious — always verify the recipient's identity before sending money.",
    explanation: "No major scam indicators were detected. The request seems to come from a known or trusted pattern.",
  },
  Medium: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15",
    borderColor: "border-yellow-500/30",
    barColor: "bg-yellow-500",
    gradientFrom: "from-yellow-950/30",
    icon: AlertTriangle,
    emoji: "⚠️",
    advice: "Proceed with caution. Call the person directly on a known number to verify. Do NOT share OTPs or click any links.",
    explanation: "Some suspicious patterns were found in the message or payment details. This could be a scam attempt.",
  },
  High: {
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    borderColor: "border-red-500/30",
    barColor: "bg-red-500",
    gradientFrom: "from-red-950/40",
    icon: XCircle,
    emoji: "🚨",
    advice: "DO NOT PROCEED. This has multiple high-risk scam signals. Block the sender and report to your bank and cybercrime.gov.in immediately.",
    explanation: "Multiple scam indicators detected — urgency, authority impersonation, emotional manipulation, or suspicious payment patterns.",
  },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min((score / 150) * 100, 100);
  const color = pct > 65 ? "bg-red-500" : pct > 35 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-400">Risk Score</span>
        <span className="text-sm font-bold text-white">{score} / 150</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-green-500/70">Safe</span>
        <span className="text-xs text-yellow-500/70">Suspicious</span>
        <span className="text-xs text-red-500/70">Dangerous</span>
      </div>
    </div>
  );
}

export default function ResultScreen({ showScreen, result }: Props) {
  const config = riskConfig[result.level];
  const RiskIcon = config.icon;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-950 px-4 py-6`}>
      <div className="w-full max-w-lg mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => showScreen("home")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
          <button
            onClick={() => showScreen("message")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Analyze Again
          </button>
        </div>

        <div className={`rounded-2xl ${config.bgColor} border ${config.borderColor} p-6 mb-5`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
              <RiskIcon className={`w-7 h-7 ${config.color}`} />
            </div>
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-widest font-medium">Risk Level</div>
              <div className={`text-3xl font-bold ${config.color}`}>{result.emoji} {result.level}</div>
            </div>
          </div>

          <ScoreBar score={result.total} />
        </div>

        {result.signals.length > 0 && (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-200">Signals Detected</span>
              <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{result.signals.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.signals.map((signal, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.signals.length === 0 && (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">No suspicious signals detected</span>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">What We Found</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{config.explanation}</p>
        </div>

        <div className={`rounded-2xl ${config.bgColor} border ${config.borderColor} p-5 mb-6`}>
          <h3 className={`text-sm font-semibold ${config.color} mb-2`}>Recommended Action</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{config.advice}</p>
        </div>

        {result.level === "High" && (
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-600/30 transition-all mb-4"
          >
            Report at cybercrime.gov.in →
          </a>
        )}

        <button
          onClick={() => showScreen("home")}
          className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-sm transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
