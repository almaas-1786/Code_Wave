import { useState } from "react";
import { ArrowLeft, CreditCard, User, IndianRupee, FileText, AlertCircle } from "lucide-react";
import type { Screen, MessageResult, RiskResult } from "@/App";

interface Props {
  showScreen: (s: Screen) => void;
  messageResult: MessageResult;
  setRiskResult: (r: RiskResult) => void;
}

const knownRecipients = ["mom@okaxis", "dad@paytm", "friend@upi", "wife@okicici", "husband@ybl"];

function analyzePayment(data: {
  name: string;
  upi: string;
  amount: number;
  note: string;
}): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (data.amount > 10000) {
    score += 35;
    signals.push("Very High Amount (>₹10,000)");
  } else if (data.amount > 5000) {
    score += 25;
    signals.push("High Amount (>₹5,000)");
  }

  if (!knownRecipients.includes(data.upi.toLowerCase())) {
    score += 25;
    signals.push("Unknown Recipient");
  }

  if (/urgent|emergency|immediately|quick|fast|now/i.test(data.note)) {
    score += 20;
    signals.push("Urgent Note");
  }

  if (/lottery|prize|won|winner|reward|free/i.test(data.note)) {
    score += 25;
    signals.push("Suspicious Note Content");
  }

  const upiPattern = /^[\w.\-]+@[\w]+$/;
  if (data.upi && !upiPattern.test(data.upi)) {
    score += 15;
    signals.push("Invalid UPI Format");
  }

  return { score: Math.min(score, 100), signals: [...new Set(signals)] };
}

function getFinalRisk(msg: MessageResult, pay: { score: number; signals: string[] }, trusted: boolean): RiskResult {
  let total = msg.score + pay.score;
  const signals = [...new Set([...msg.signals, ...pay.signals])];

  if (trusted) {
    total = Math.max(0, total - 20);
  } else {
    total = total + 10;
  }

  let level: "Low" | "Medium" | "High" = "Low";
  if (total > 80) level = "High";
  else if (total > 45) level = "Medium";

  return { total: Math.min(total, 150), signals, level, trustAdjusted: true };
}

export default function PaymentScreen({ showScreen, messageResult, setRiskResult }: Props) {
  const [name, setName] = useState("");
  const [upi, setUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.recipient = "Recipient name is required";
    if (!upi.trim()) newErrors.upi = "UPI ID is required";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Enter a valid amount";
    return newErrors;
  };

  const handleProceed = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const paymentResult = analyzePayment({
      name,
      upi,
      amount: Number(amount),
      note,
    });

    const trusted = window.confirm(
      "Do you personally know and trust this recipient?\n\nClick OK if you trust them, Cancel if unsure."
    );

    const final = getFinalRisk(messageResult, paymentResult, trusted);
    setRiskResult(final);
    showScreen("result");
  };

  const Field = ({
    label,
    icon: Icon,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
  }: {
    label: string;
    icon: React.ElementType;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    error?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => { onChange(e.target.value); setErrors(prev => ({ ...prev, [label.toLowerCase().split(" ")[0]]: "" })); }}
          placeholder={placeholder}
          maxLength={50}
          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${error ? "border-red-500/60" : "border-slate-700"}`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );

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
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Enter the UPI payment details to assess transaction risk
        </p>

        {messageResult.signals.length > 0 && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-300 text-xs font-medium">Message signals detected</p>
                <p className="text-amber-400/70 text-xs mt-0.5">
                  {messageResult.signals.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <Field
            label="Recipient Name"
            icon={User}
            value={name}
            onChange={setName}
            placeholder="e.g. Rahul Sharma"
            error={errors.recipient}
          />
          <Field
            label="UPI ID"
            icon={CreditCard}
            value={upi}
            onChange={setUpi}
            placeholder="e.g. rahul@okaxis"
            error={errors.upi}
          />
          <Field
            label="Amount (₹)"
            icon={IndianRupee}
            value={amount}
            onChange={setAmount}
            placeholder="e.g. 5000"
            type="number"
            error={errors.amount}
          />
          <Field
            label="Payment Note"
            icon={FileText}
            value={note}
            onChange={setNote}
            placeholder="e.g. For urgent help"
          />
        </div>

        <button
          onClick={handleProceed}
          className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-violet-600/30 hover:scale-[1.01] active:scale-[0.99]"
        >
          Check Risk →
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">
          You'll be asked whether you trust this recipient before the final analysis
        </p>
      </div>
    </div>
  );
}
