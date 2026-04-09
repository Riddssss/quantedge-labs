import { useState } from "react";
import { PaperTradingSection } from "@/components/PaperTradingSection";
import { TradeDistributionChart } from "@/components/TradeDistributionChart";

interface Props {
  useTransformer: boolean;
  trades: any[] | null;
  isSimLoading: boolean;
}

export function SimulationTab({ useTransformer }: Props) {
  const [paperTradeResult, setPaperTradeResult] = useState<any>(null);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="font-serif italic text-lg font-medium text-foreground">Simulation & Signals</h2>
        <div className="mt-1.5 h-0.5 w-12 bg-copper rounded-full" />
        <p className="text-sm text-muted-foreground mt-2">Paper trading simulator</p>
      </div>

      <PaperTradingSection useTransformer={useTransformer} onResult={setPaperTradeResult} />
      <TradeDistributionChart trades={paperTradeResult?.trades || []} isLoading={false} />
    </div>
  );
}
