import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: { date: string; ga: number | null; pso: number | null }[] | null;
  isLoading: boolean;
}

function computeDrawdowns(data: { date: string; ga: number | null; pso: number | null }[]) {
  let gaMax = -Infinity;
  let psoMax = -Infinity;

  return data.map((d) => {
    let gaDD = null;
    let psoDD = null;

    if (d.ga != null) {
      gaMax = Math.max(gaMax, d.ga);
      gaDD = ((d.ga - gaMax) / gaMax) * 100;
    }
    if (d.pso != null) {
      psoMax = Math.max(psoMax, d.pso);
      psoDD = ((d.pso - psoMax) / psoMax) * 100;
    }

    return { date: d.date, ga: gaDD, pso: psoDD };
  });
}

export function DrawdownChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
        <CardContent><Skeleton className="h-[280px]" /></CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif italic text-base text-foreground">
            Drawdown Chart
            <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            Run optimization to view drawdowns.
          </div>
        </CardContent>
      </Card>
    );
  }

  const ddData = computeDrawdowns(data);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif italic text-base text-foreground">
          Drawdown Chart
          <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ddData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="ddGA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="ddPSO" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 70%, 45%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toFixed(0)}%`} domain={["auto", 0]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v.toFixed(2)}%`]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="ga" name="GA" stroke="hsl(var(--chart-ga))" fill="url(#ddGA)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="pso" name="PSO" stroke="hsl(var(--chart-pso))" fill="url(#ddPSO)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
