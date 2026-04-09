import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Play } from "lucide-react";
import { api } from "@/lib/api";

interface Props {
  useTransformer: boolean;
  onResult?: (result: any) => void;
}

export function PaperTradingSection({ useTransformer, onResult }: Props) {
  const [capital, setCapital] = useState(100000);
  const [model, setModel] = useState("pso");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      const res = await api.paperTrade({ model, capital, use_transformer: useTransformer });
      setResult(res);
      onResult?.(res);
    } catch (e) {
      console.error("Paper trade failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader><CardTitle className="text-foreground text-base font-medium">Paper Trading Simulator</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Capital ₹</label>
            <Input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-36 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pso">PSO</SelectItem>
                <SelectItem value="ga">GA</SelectItem>
                <SelectItem value="pso_transformer">PSO+Transformer</SelectItem>
                <SelectItem value="ga_transformer">GA+Transformer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={simulate} disabled={loading} className="btn-press">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Play className="h-4 w-4 mr-1" /> Simulate</>}
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        )}

        {result && !loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MiniCard label="Final Value" value={`₹${result.final_value?.toLocaleString()}`} />
              <MiniCard
                label="Profit"
                value={`₹${result.profit?.toLocaleString()}`}
                colorClass={(result.profit ?? 0) >= 0 ? "text-success" : "text-destructive"}
              />
              <MiniCard label="Return" value={`${result.total_return?.toFixed(1) ?? '0'}%`} colorClass="text-copper" />
              <MiniCard label="Trades" value={String(result.num_trades ?? 0)} colorClass="text-purple" />
            </div>

            {result.portfolio_curve && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={result.portfolio_curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 10%, 88%)" />
                  <XAxis dataKey="date" stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(210, 6%, 55%)" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(210, 10%, 88%)",
                      borderRadius: 8,
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(213, 40%, 55%)" dot={false} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {result.trades && (
              <div className="rounded-lg overflow-hidden border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-secondary/50">
                      <TableHead className="text-muted-foreground text-xs">Date</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Action</TableHead>
                      <TableHead className="text-muted-foreground text-xs text-right">Price ₹</TableHead>
                      <TableHead className="text-muted-foreground text-xs text-right">P&L %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.trades.map((t: any, i: number) => (
                      <TableRow
                        key={i}
                        className="animate-fade-up"
                        style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
                      >
                        <TableCell className="text-foreground text-sm">{t.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              t.type === "BUY"
                                ? "border-success/50 text-success"
                                : "border-destructive/50 text-destructive"
                            }`}
                          >
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-right">₹{t.price?.toLocaleString()}</TableCell>
                        <TableCell className={`font-mono text-sm text-right ${(t.pnl ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                          {t.pnl != null ? `${t.pnl.toFixed(2)}%` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {!result && !loading && (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Configure and simulate paper trading.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniCard({ label, value, colorClass = "text-foreground" }: { label: string; value: string; colorClass?: string }) {
  return (
    <div className="rounded-lg p-4 border border-border bg-card shadow-sm card-hover">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-semibold font-serif ${colorClass}`}>{value}</p>
    </div>
  );
}
