import { useState } from "react";
import { ArrowLeft, MessageSquare, AlertCircle, Zap } from "lucide-react";
import type { Screen, MessageResult } from "@/App";

interface Props {
  showScreen: (s: Screen) => void;
  setMessageResult: (r: MessageResult) => void;
}

const urgencyWords = ["urgent", "immediately", "now", "asap", "hurry", "quickly", "fast", "expire", "last chance", "deadline"];
const emotionWords = ["help", "please", "trust", "worried", "scared", "panic", "desperate", "love", "friend", "family", "son", "daughter"];
const authorityWords = ["bank", "account", "kyc", "otp", "verify", "rbi", "government", "police", "officer", "official", "irdai", "income tax"];
const rewardWords = ["won", "winner", "prize", "lottery", "free", "gift", "reward", "crore", "lakh", "jackpot", "selected", "congratulations"];

function analyzeMessage(text: string): MessageResult {
  let score = 0;
  const signals: string[] = [];
  const lower = text.toLowerCase();

  const urgencyHits = urgencyWords.filter(w => lower.includes(w));
  if (urgencyHits.length > 0) {
    score += Math.min(urgencyHits.length * 15, 35);
    signals.push("Urgency Language");
  }

  const emotionHits = emotionWords.filter(w => lower.includes(w));
  if (emotionHits.length > 0) {
    score += Math.min(emotionHits.length * 10, 25);
    signals.push("Emotional Pressure");
  }

  const authorityHits = authorityWords.filter(w => lower.includes(w));
  if (authorityHits.length > 0) {
    score += Math.min(authorityHits.length * 15, 30);
    signals.push("Authority Impersonation");
  }

  const rewardHits = rewardWords.filter(w => lower.includes(w));
  if (rewardHits.length > 0) {
    score += Math.min(rewardHits.length * 20, 35);
    signals.push("False Reward / Lottery");
  }

  if (/\b\d{10}\b/.test(text)) {
    score += 10;
    signals.push("Phone Number Included");
  }

  if (/link|click here|http|bit\.ly|tinyurl/i.test(text)) {
    score += 15;
    signals.push("Suspicious Link");
  }

  return { score: Math.min(score, 100), signals: [...new Set(signals)] };
}

const exampleMessages = [
  "Your bank account KYC is expired. Verify immediately or account will be blocked. Click here: bit.ly/verify-now",
  "Congratulations! You have won Rs 25 Lakh in RBI lottery. Please share your OTP to claim your prize.",
  "URGENT: Police case registered against your PAN card. Call officer immediately to avoid arrest.",
];

export default function MessageScreen({ showScreen, setMessageResult }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    if (!text.trim()) {
      setError("Please paste a message to analyze.");
      return;
    }
    const result = analyzeMessage(text);
    setMessageResult(result);
    showScreen("payment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 px-4 py-6">
      <div className="w-full max-w-lg mx-auto flex flex-col flex-1">
        <button
          onClick={() => showScreen("home")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Message Analysis</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Paste the suspicious message you received below
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Suspicious Message</label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            placeholder="Paste the message here..."
            rows={7}
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">Try an example</span>
          </div>
          <div className="space-y-2">
            {exampleMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => { setText(msg); setError(""); }}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800 transition-all text-xs text-slate-400 hover:text-slate-300 line-clamp-2"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99]"
        >
          Analyze Message →
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">
          After analyzing the message, you'll proceed to enter payment details
        </p>
      </div>
    </div>
  );
}
