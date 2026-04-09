import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: any[] | null;
  isLoading: boolean;
}

export function ConvergenceChart({ data, isLoading }: Props) {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader><CardTitle className="text-foreground text-base font-medium">GA vs PSO Convergence</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : !data ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
            Run optimization to see convergence.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 10%, 88%)" />
              <XAxis dataKey="generation" stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} />
              <YAxis stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} />
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
              <Line type="monotone" dataKey="ga" name="GA" stroke="hsl(213, 40%, 55%)" dot={false} strokeWidth={1.5} activeDot={{ r: 3 }} />
              <Line type="monotone" dataKey="pso" name="PSO" stroke="hsl(27, 45%, 50%)" dot={false} strokeWidth={1.5} activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
