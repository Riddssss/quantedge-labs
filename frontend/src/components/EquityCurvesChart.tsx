import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: any[] | null;
  isLoading: boolean;
}

const LINES = [
  { key: "ga", name: "GA", color: "hsl(213, 40%, 55%)" },
  { key: "pso", name: "PSO", color: "hsl(160, 40%, 55%)" },
  { key: "ga_t", name: "GA+T", color: "hsl(258, 40%, 65%)" },
  { key: "pso_t", name: "PSO+T", color: "hsl(27, 45%, 50%)" },
  { key: "buy_hold", name: "Buy & Hold", color: "hsl(210, 6%, 60%)" },
];

export function EquityCurvesChart({ data, isLoading }: Props) {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader><CardTitle className="text-foreground text-base font-medium">Portfolio Growth</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-lg" />
        ) : !data ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
            Run optimization to see equity curves.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 10%, 88%)" />
              <XAxis dataKey="date" stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} />
              <YAxis stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(210, 10%, 88%)",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "hsl(210, 6%, 45%)" }}
              />
              <Legend />
              {LINES.map((l) => (
                <Line
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  name={l.name}
                  stroke={l.color}
                  dot={false}
                  strokeWidth={1.5}
                  activeDot={{ r: 3, strokeWidth: 1 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
