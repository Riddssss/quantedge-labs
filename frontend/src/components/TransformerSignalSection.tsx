import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export function TransformerSignalSection() {
  const [seqLen, setSeqLen] = useState(60);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);
    try {
      const res = await api.transformerWindow(seqLen);
      setData(res);
    } catch (e) {
      console.error("Transformer signal failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border/50 rounded-2xl">
      <CardHeader><CardTitle className="text-foreground text-base">Transformer Signal</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-3 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Window</label>
            <Select value={String(seqLen)} onValueChange={(v) => setSeqLen(Number(v))}>
              <SelectTrigger className="w-28 bg-secondary/60 border-border text-foreground rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 40, 60, 90].map((v) => (
                  <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={update}
            disabled={loading}
            className="gradient-primary text-primary-foreground hover:opacity-90 font-semibold rounded-xl btn-press transition-all duration-200"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RefreshCw className="h-4 w-4 mr-1" /> Update</>}
          </Button>
        </div>

        {loading && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-2xl bg-muted/30" />
              <Skeleton className="h-20 rounded-2xl bg-muted/30" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-xl bg-muted/30" />
          </div>
        )}

        {data && !loading && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="gradient-card-green rounded-2xl p-4 border border-border/30 card-hover">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Bullish Days</p>
                <p className="text-2xl font-bold font-mono text-accent">{data.bullish_days ?? "—"}</p>
              </div>
              <div className="gradient-card-red rounded-2xl p-4 border border-border/30 card-hover">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Bearish Days</p>
                <p className="text-2xl font-bold font-mono text-destructive">{data.bearish_days ?? "—"}</p>
              </div>
            </div>

            {data.signal_data && (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.signal_data}>
                  <defs>
                    <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(227, 100%, 74%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(227, 100%, 74%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 17%, 17%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 9%, 50%)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} stroke="hsl(220, 9%, 50%)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220, 26%, 11%)",
                      border: "1px solid hsl(220, 17%, 17%)",
                      borderRadius: 12,
                    }}
                  />
                  <ReferenceLine y={0.5} stroke="hsl(220, 9%, 50%)" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="signal" stroke="hsl(227, 100%, 74%)" fill="url(#signalGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </>
        )}

        {!data && !loading && (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Click Update to load transformer signal.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
