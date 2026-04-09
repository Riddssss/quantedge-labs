import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/useCountUp";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | null;
  suffix?: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  isLoading: boolean;
  decimals?: number;
}

function MetricCard({ title, value, suffix = "", subtitle, icon, accentColor, isLoading, decimals = 2 }: MetricCardProps) {
  const displayValue = useCountUp(value ?? 0, 800, decimals);

  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm card-hover">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <div className={accentColor}>{icon}</div>
        </div>
        <p className="text-2xl font-semibold font-serif text-foreground animate-count-up">
          {value != null ? `${displayValue}${suffix}` : "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

interface Props {
  results: any | null;
  isLoading: boolean;
}

export function MetricCards({ results, isLoading }: Props) {
  const r = results;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="GA Sharpe"
        value={r?.ga_sharpe ?? null}
        subtitle="Genetic Algorithm"
        accentColor="text-dusty-blue"
        icon={<BarChart3 className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="PSO Sharpe"
        value={r?.pso_sharpe ?? null}
        subtitle="Particle Swarm"
        accentColor="text-purple"
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Best Return"
        value={r?.best_return ?? null}
        suffix="%"
        subtitle="PSO+Transformer"
        accentColor="text-success"
        icon={<TrendingUp className="h-4 w-4" />}
        isLoading={isLoading}
        decimals={1}
      />
      <MetricCard
        title="Max Drawdown"
        value={r?.max_drawdown ?? null}
        suffix="%"
        subtitle="Risk metric"
        accentColor="text-destructive"
        icon={<TrendingDown className="h-4 w-4" />}
        isLoading={isLoading}
        decimals={1}
      />
    </div>
  );
}
