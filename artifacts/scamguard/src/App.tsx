import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomeScreen from "@/pages/HomeScreen";
import MessageScreen from "@/pages/MessageScreen";
import PaymentScreen from "@/pages/PaymentScreen";
import ResultScreen from "@/pages/ResultScreen";

const queryClient = new QueryClient();

export type Screen = "home" | "message" | "payment" | "result";

export interface MessageResult {
  score: number;
  signals: string[];
}

export interface RiskResult {
  total: number;
  signals: string[];
  level: "Low" | "Medium" | "High";
  trustAdjusted: boolean;
}

function ScamGuardApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [messageResult, setMessageResult] = useState<MessageResult>({ score: 0, signals: [] });
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);

  const showScreen = (s: Screen) => setScreen(s);

  return (
    <div className="min-h-screen bg-background">
      {screen === "home" && <HomeScreen showScreen={showScreen} />}
      {screen === "message" && (
        <MessageScreen
          showScreen={showScreen}
          setMessageResult={setMessageResult}
        />
      )}
      {screen === "payment" && (
        <PaymentScreen
          showScreen={showScreen}
          messageResult={messageResult}
          setRiskResult={setRiskResult}
        />
      )}
      {screen === "result" && riskResult && (
        <ResultScreen
          showScreen={showScreen}
          result={riskResult}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScamGuardApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
