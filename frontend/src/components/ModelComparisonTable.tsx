import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelRow {
  model: string;
  sharpe: number;
  return_pct: number;
  max_drawdown: number;
  trades: number;
}

interface Props {
  data: ModelRow[] | null;
  isLoading: boolean;
}

export function ModelComparisonTable({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><CardTitle className="text-foreground text-base font-medium">Model Comparison</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader><CardTitle className="text-foreground text-base font-medium">Model Comparison</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Run optimization to see results.</p></CardContent>
      </Card>
    );
  }

  const bestSharpe = Math.max(...data.map((d) => d.sharpe));

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader><CardTitle className="text-foreground text-base font-medium">Model Comparison</CardTitle></CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-secondary/50">
                <TableHead className="text-muted-foreground text-xs">Model</TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">Sharpe</TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">Return %</TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">Max DD %</TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">Trades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow
                  key={row.model}
                  className={`transition-colors duration-150 ${
                    row.sharpe === bestSharpe
                      ? "bg-success/5 hover:bg-success/10"
                      : i % 2 === 0
                      ? "hover:bg-secondary/30"
                      : "bg-secondary/10 hover:bg-secondary/30"
                  }`}
                >
                  <TableCell className={`font-medium text-sm ${row.sharpe === bestSharpe ? "text-success" : "text-foreground"}`}>
                    {row.model}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-right">{row.sharpe.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-sm text-right">{row.return_pct.toFixed(1)}%</TableCell>
                  <TableCell className="font-mono text-sm text-right text-destructive">{row.max_drawdown.toFixed(1)}%</TableCell>
                  <TableCell className="font-mono text-sm text-right">{row.trades}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
