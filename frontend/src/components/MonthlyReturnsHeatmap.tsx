import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  data: { date: string; pso: number | null }[] | null;
  isLoading: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function computeMonthlyReturns(data: { date: string; pso: number | null }[]) {
  const byMonth: Record<string, Record<string, number>> = {};
  let prevValue: number | null = null;

  for (const point of data) {
    if (point.pso == null) { prevValue = null; continue; }
    const d = new Date(point.date);
    const year = String(d.getFullYear());
    const month = d.getMonth();

    if (prevValue != null && prevValue !== 0) {
      const ret = ((point.pso - prevValue) / prevValue) * 100;
      if (!byMonth[year]) byMonth[year] = {};
      byMonth[year][month] = (byMonth[year][month] ?? 0) + ret;
    }
    prevValue = point.pso;
  }

  return byMonth;
}

function getCellColor(value: number): string {
  if (value > 5) return "bg-green-600 text-white";
  if (value > 2) return "bg-green-500 text-white";
  if (value > 0) return "bg-green-400/70 text-green-950";
  if (value > -2) return "bg-red-400/60 text-red-950";
  if (value > -5) return "bg-red-500 text-white";
  return "bg-red-600 text-white";
}

export function MonthlyReturnsHeatmap({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-[200px]" /></CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif italic text-base text-foreground">
            Monthly Returns Heatmap
            <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Run optimization to view monthly returns.
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthly = computeMonthlyReturns(data);
  const years = Object.keys(monthly).sort();

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif italic text-base text-foreground">
          Monthly Returns Heatmap
          <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(12, 1fr)` }}>
              <div />
              {MONTHS.map((m) => (
                <div key={m} className="text-[10px] text-muted-foreground text-center font-medium">{m}</div>
              ))}
              {years.map((year) => (
                <>
                  <div key={`y-${year}`} className="text-xs text-muted-foreground font-mono pr-2 flex items-center">{year}</div>
                  {Array.from({ length: 12 }).map((_, mi) => {
                    const val = monthly[year]?.[mi];
                    return (
                      <Tooltip key={`${year}-${mi}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-8 rounded text-[10px] font-mono flex items-center justify-center transition-colors ${
                              val != null ? getCellColor(val) : "bg-muted/40"
                            }`}
                          >
                            {val != null ? val.toFixed(1) : ""}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                          {val != null ? `${MONTHS[mi]} ${year}: ${val.toFixed(2)}%` : `${MONTHS[mi]} ${year}: No data`}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
