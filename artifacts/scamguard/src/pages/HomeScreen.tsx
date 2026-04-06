import { Shield, MessageSquare, CreditCard } from "lucide-react";
import type { Screen } from "@/App";

interface Props {
  showScreen: (s: Screen) => void;
}

export default function HomeScreen({ showScreen }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          ScamGuard
        </h1>
        <p className="text-blue-300/80 text-lg mb-2">Message + UPI Risk Analyzer</p>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed">
          Detect psychological pressure and suspicious transaction patterns before money is sent
        </p>

        <div className="space-y-4">
          <button
            onClick={() => showScreen("message")}
            className="w-full group flex items-center gap-4 p-5 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-white text-base">Analyze Message</div>
              <div className="text-blue-200/70 text-sm">Paste a suspicious message to check for scam patterns</div>
            </div>
            <div className="text-white/50 group-hover:text-white/90 transition-colors">→</div>
          </button>

          <button
            onClick={() => showScreen("payment")}
            className="w-full group flex items-center gap-4 p-5 rounded-2xl bg-slate-700/60 hover:bg-slate-600/70 border border-slate-600/50 hover:border-slate-500/60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-slate-300" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-white text-base">Simulate Payment</div>
              <div className="text-slate-400 text-sm">Enter UPI payment details to assess transaction risk</div>
            </div>
            <div className="text-slate-500 group-hover:text-slate-300 transition-colors">→</div>
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
