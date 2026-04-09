import { MetricCards } from "@/components/MetricCards";
import { LiveSignalCard } from "@/components/LiveSignalCard";

interface Props {
  results   : any | null;
  isLoading : boolean;
  dateRange?: { start: string; end: string } | null;
  sector?   : string;
}

export function PerformanceTab({
  results,
  isLoading,
  dateRange,
  sector = "^NSEBANK"
}: Props) {
  return (
    <div className="space-y-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif italic text-lg font-medium text-foreground">
            Performance Evaluation
          </h2>
          <div className="mt-1.5 h-0.5 w-12 bg-dusty-blue rounded-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Optimization metrics overview
          </p>
        </div>
        {dateRange && (
          <span className="self-start mt-1 inline-flex items-center px-3 py-1
            rounded-full text-xs font-mono border border-dusty-blue/30
            bg-dusty-blue/8 text-dusty-blue">
            Results for {dateRange.start} &rarr; {dateRange.end}
          </span>
        )}
      </div>

      {/* Live Signal Card — updates based on selected sector */}
      <LiveSignalCard sector={sector} />

      {/* Metric Cards */}
      <MetricCards results={results} isLoading={isLoading} />

    </div>
  );
}