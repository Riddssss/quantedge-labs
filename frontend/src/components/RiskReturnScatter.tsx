import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from "recharts";

interface Props {
  data: any[] | null;
  isLoading: boolean;
}

const MODEL_COLORS: Record<string, string> = {
  GA: "hsl(var(--chart-ga))",
  PSO: "hsl(var(--chart-pso))",
  "GA+T": "hsl(var(--chart-ga-t))",
  "PSO+T": "hsl(var(--chart-pso-t))",
  "Buy & Hold": "hsl(var(--chart-buyhold))",
};

export function RiskReturnScatter({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-[280px]" /></CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif italic text-base text-foreground">
            Risk vs Return Scatter Plot
            <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            Run optimization to view risk-return analysis.
          </div>
        </CardContent>
      </Card>
    );
  }

  const scatterData = data.map((d) => ({
    x: Math.abs(d.max_drawdown),
    y: d.return_pct,
    model: d.model,
  }));

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif italic text-base text-foreground">
          Risk vs Return Scatter Plot
          <div className="mt-1.5 h-0.5 w-12 bg-success rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" name="Max Drawdown" unit="%" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}>
              <Label value="Max Drawdown %" position="bottom" offset={0} style={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            </XAxis>
            <YAxis type="number" dataKey="y" name="Return" unit="%" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}>
              <Label value="Total Return %" angle={-90} position="insideLeft" offset={10} style={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
              labelFormatter={() => ""}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter data={scatterData} name="Models">
              {scatterData.map((entry, idx) => (
                <Cell key={idx} fill={MODEL_COLORS[entry.model] ?? "hsl(var(--muted-foreground))"} r={7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {scatterData.map((d) => (
            <div key={d.model} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[d.model] }} />
              {d.model}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
