import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Signal {
  name  : string;
  status: string;
  value : string;
}

interface LiveSignalData {
  sector         : string;
  sector_name    : string;
  current_date   : string;
  close_price    : number;
  change_pct     : number;
  rsi_14         : number;
  rsi_signal     : string;
  ma_cross       : string;
  macd_status    : string;
  bb_signal      : string;
  bullish_count  : number;
  recommendation : string;
  signals        : Signal[];
}

interface Props {
  sector?: string;
}

export function LiveSignalCard({ sector = "^NSEBANK" }: Props) {
  const [data, setData]       = useState<LiveSignalData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSignal = async () => {
    try {
      setLoading(true);
      const result = await api.getLiveSignal(sector);
      setData(result);
    } catch (e) {
      console.error("Failed to fetch live signal", e);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when sector changes
  useEffect(() => {
    fetchSignal();
    const interval = setInterval(fetchSignal, 300000);
    return () => clearInterval(interval);
  }, [sector]);

  if (loading) {
    return (
      <div className="rounded-xl border p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const recColor = data.recommendation === "BUY"
    ? "bg-green-500"
    : data.recommendation === "SELL"
    ? "bg-red-500"
    : "bg-yellow-500";

  const statusColor = (status: string) => {
    if (status === "Bullish" || status === "Oversold")
      return "text-green-600 bg-green-100";
    if (status === "Bearish" || status === "Overbought")
      return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="rounded-xl border p-6 mb-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="font-serif text-xl font-semibold">
            Live Market Signal
          </h2>
          {/* Show sector name dynamically */}
          <span className="text-sm text-gray-500 font-mono">
            {data.sector_name}
          </span>
          <span className="text-xs text-gray-400 font-mono bg-gray-100 
            px-2 py-0.5 rounded">
            {data.sector}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-mono font-bold text-lg">
              ₹{data.close_price.toLocaleString()}
            </div>
            <div className={`text-sm font-mono ${
              data.change_pct >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {data.change_pct >= 0 ? "+" : ""}{data.change_pct}%
            </div>
          </div>
          <button
            onClick={fetchSignal}
            className="text-gray-400 hover:text-gray-600 text-lg"
            title="Refresh signal"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Signal Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {data.signals.map((signal, i) => (
          <div key={i} className="rounded-lg border p-3">
            <div className="text-xs text-gray-500 mb-1">{signal.name}</div>
            <div className="font-mono text-sm font-bold mb-1">
              {signal.value}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              statusColor(signal.status)
            }`}>
              {signal.status}
            </span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {data.bullish_count} of 4 signals bullish
          · Last updated: {data.current_date}
        </span>
        <span className={`${recColor} text-white font-serif font-bold 
          text-lg px-6 py-2 rounded-full`}>
          {data.recommendation}
        </span>
      </div>

    </div>
  );
}