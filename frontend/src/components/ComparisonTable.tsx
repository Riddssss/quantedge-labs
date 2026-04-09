interface RunResult {
  run_number: number;
  pop_size: number;
  generations: number;
  use_transformer: boolean;
  seq_len: number;
  start_date: string;
  end_date: string;
  ga_sharpe: number;
  pso_sharpe: number;
  ga_return: number;
  pso_return: number;
  ga_drawdown: number;
  pso_drawdown: number;
  timestamp: string;
}

interface Props {
  runs: RunResult[];
  onClear: () => void;
}

export function ComparisonTable({ runs, onClear }: Props) {
  if (runs.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-serif italic text-lg mb-2">
          Strategy Comparison
        </p>
        <div className="mt-1.5 h-0.5 w-12 bg-dusty-blue 
          rounded-full mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          Run optimization multiple times to compare results.
          Each run will appear here automatically.
        </p>
      </div>
    );
  }

  const bestSharpe = Math.max(...runs.map(r =>
    Math.max(r.ga_sharpe, r.pso_sharpe)));

  return (
    <div className="rounded-xl border p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-serif italic text-lg font-medium">
            Strategy Comparison
          </p>
          <div className="mt-1.5 h-0.5 w-12 bg-dusty-blue rounded-full" />
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-red-500 
            border rounded px-3 py-1"
        >
          Clear All Runs
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground text-xs">
              <th className="text-left py-2 px-3">Run</th>
              <th className="text-left py-2 px-3">Period</th>
              <th className="text-center py-2 px-3">Pop</th>
              <th className="text-center py-2 px-3">Gen</th>
              <th className="text-center py-2 px-3">Transformer</th>
              <th className="text-center py-2 px-3">Window</th>
              <th className="text-center py-2 px-3">GA Sharpe</th>
              <th className="text-center py-2 px-3">PSO Sharpe</th>
              <th className="text-center py-2 px-3">GA Return</th>
              <th className="text-center py-2 px-3">PSO Return</th>
              <th className="text-center py-2 px-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => {
              const isBest = run.ga_sharpe === bestSharpe ||
                             run.pso_sharpe === bestSharpe;
              return (
                <tr key={i} className={`border-b last:border-0 
                  ${isBest ? "bg-green-50" : "hover:bg-gray-50"}`}>
                  <td className="py-3 px-3 font-mono font-bold">
                    #{run.run_number}
                    {isBest && (
                      <span className="ml-1 text-xs text-green-600">
                        ★
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs">
                    {run.start_date.slice(0,4)} → {run.end_date.slice(0,4)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {run.pop_size}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {run.generations}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full
                      ${run.use_transformer
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"}`}>
                      {run.use_transformer ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {run.use_transformer ? run.seq_len : "—"}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold
                    text-blue-600">
                    {run.ga_sharpe.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold
                    text-green-600">
                    {run.pso_sharpe.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {run.ga_return.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {run.pso_return.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center text-xs
                    text-muted-foreground">
                    {run.timestamp}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t flex gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total Runs: </span>
          <span className="font-mono font-bold">{runs.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Best Sharpe: </span>
          <span className="font-mono font-bold text-green-600">
            {bestSharpe.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Best Run: </span>
          <span className="font-mono font-bold">
            #{runs.find(r =>
              r.ga_sharpe === bestSharpe ||
              r.pso_sharpe === bestSharpe)?.run_number}
          </span>
        </div>
      </div>
    </div>
  );
}