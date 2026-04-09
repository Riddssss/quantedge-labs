import { ModelComparisonTable } from "@/components/ModelComparisonTable";
import { EquityCurvesChart } from "@/components/EquityCurvesChart";
import { ConvergenceChart } from "@/components/ConvergenceChart";
import { RiskReturnScatter } from "@/components/RiskReturnScatter";
import { MonthlyReturnsHeatmap } from "@/components/MonthlyReturnsHeatmap";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ComparisonTable } from "@/components/ComparisonTable";

interface Props {
  results      : any | null;
  isLoading    : boolean;
  comparisonRuns: any[];
  onClearRuns  : () => void;
}

export function AnalyticsTab({
  results,
  isLoading,
  comparisonRuns,
  onClearRuns
}: Props) {
  return (
    <div className="space-y-8 animate-fade-up">

      {/* Header */}
      <div>
        <h2 className="font-serif italic text-lg font-medium text-foreground">
          Analytics & Comparison
        </h2>
        <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Model performance and convergence analysis
        </p>
      </div>

      {/* Model Comparison Table */}
      <ModelComparisonTable
        data={results?.model_comparison ?? null}
        isLoading={isLoading}
      />

      {/* Strategy Comparison Tool */}
      <ComparisonTable
        runs={comparisonRuns}
        onClear={onClearRuns}
      />

      {/* Equity Curves + Convergence */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EquityCurvesChart
          data={results?.equity_curves ?? null}
          isLoading={isLoading}
        />
        <ConvergenceChart
          data={results?.convergence ?? null}
          isLoading={isLoading}
        />
      </div>

      {/* Risk Return + Drawdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RiskReturnScatter
          data={results?.model_comparison ?? null}
          isLoading={isLoading}
        />
        <DrawdownChart
          data={results?.equity_curves ?? null}
          isLoading={isLoading}
        />
      </div>

      {/* Monthly Heatmap */}
      <MonthlyReturnsHeatmap
        data={results?.equity_curves ?? null}
        isLoading={isLoading}
      />

    </div>
  );
}