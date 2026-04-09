import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface Trade {
  type: string;
  pnl?: number | null;
}

interface Props {
  trades: Trade[] | null;
  isLoading: boolean;
}

export function TradeDistributionChart({ trades, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
        <CardContent><Skeleton className="h-[260px]" /></CardContent>
      </Card>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif italic text-base text-foreground">
            Trade Distribution
            <div className="mt-1.5 h-0.5 w-12 bg-copper rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
            Run a simulation to view trade distribution.
          </div>
        </CardContent>
      </Card>
    );
  }

  const buys = trades.filter((t) => t.type === "BUY").length;
  const sells = trades.filter((t) => t.type === "SELL").length;
  const profitable = trades.filter((t) => (t.pnl ?? 0) > 0).length;
  const losing = trades.filter((t) => (t.pnl ?? 0) < 0).length;

  const chartData = [
    { category: "BUY", count: buys },
    { category: "SELL", count: sells },
    { category: "Profit", count: profitable },
    { category: "Loss", count: losing },
  ];

  const COLORS = [
    "hsl(var(--chart-pso))",
    "hsl(var(--destructive))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif italic text-base text-foreground">
          Trade Distribution
          <div className="mt-1.5 h-0.5 w-12 bg-copper rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
