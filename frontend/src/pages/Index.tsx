import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HeroSection } from "@/components/HeroSection";
import { PerformanceTab } from "@/components/tabs/PerformanceTab";
import { StrategyConfigTab } from "@/components/tabs/StrategyConfigTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { SimulationTab } from "@/components/tabs/SimulationTab";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { toast } from "sonner";

const LOADING_STEPS = [
  "Initializing...",
  "Running GA optimization...",
  "Running PSO optimization...",
  "Applying Transformer...",
  "Finalizing results...",
];

const Index = () => {
  const { isDark, toggle } = useTheme();
  const [config, setConfig] = useState({
    sector           : "^NSEBANK",   // ← FIXED: was "bank_nifty"
    transformerWindow: 60,
    useTransformer   : true,
    populationSize   : 50,
    generations      : 40,
    startDate        : "2007-01-01",
    endDate          : "2025-06-01",
  });
  const [results, setResults]               = useState<any>(null);
  const [resultDateRange, setResultDateRange] = useState<{
    start: string; end: string
  } | null>(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [loadingStep, setLoadingStep]       = useState("");

  // ── Comparison runs state ──────────────────────────────────
  const [comparisonRuns, setComparisonRuns] = useState<any[]>([]);
  const [runCounter, setRunCounter]         = useState(1);

  const stepInterval = useRef<ReturnType<typeof setInterval>>();

  const runOptimization = async () => {
    const start    = new Date(config.startDate);
    const end      = new Date(config.endDate);
    const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (config.startDate >= config.endDate) {
      toast.error("End date must be after start date");
      return;
    }
    if (daysDiff < 1825) {
      toast.warning("Minimum 5 years recommended for best results");
    }

    setIsLoading(true);
    setLoadingStep(LOADING_STEPS[0]);

    let stepIdx = 0;
    stepInterval.current = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, LOADING_STEPS.length - 1);
      setLoadingStep(LOADING_STEPS[stepIdx]);
    }, 3000);

    try {
      const res = await api.optimize({
        sector         : config.sector,
        seq_len        : Number(config.transformerWindow),
        use_transformer: config.useTransformer,
        pop_size       : config.populationSize,
        generations    : config.generations,
        start_date     : config.startDate,
        end_date       : config.endDate,
      });
      console.log("API response:", res);

      const ga    = res.ga           || {};
      const pso   = res.pso          || {};
      const bh    = res.buy_and_hold || {};
      const dates = res.dates        || [];

      const transformed: any = {
        ga_sharpe   : ga.sharpe        ?? null,
        pso_sharpe  : pso.sharpe       ?? null,
        best_return : pso.total_return ?? null,
        max_drawdown: pso.max_drawdown ?? null,

        model_comparison: [
          {
            model       : "GA",
            sharpe      : ga.sharpe       ?? 0,
            return_pct  : ga.total_return ?? 0,
            max_drawdown: ga.max_drawdown ?? 0,
            trades      : ga.num_trades   ?? 0
          },
          {
            model       : "PSO",
            sharpe      : pso.sharpe       ?? 0,
            return_pct  : pso.total_return ?? 0,
            max_drawdown: pso.max_drawdown ?? 0,
            trades      : pso.num_trades   ?? 0
          },
          {
            model       : "Buy & Hold",
            sharpe      : 0,
            return_pct  : bh.total_return ?? 0,
            max_drawdown: 0,
            trades      : 1
          },
        ],

        equity_curves: dates.map((date: string, i: number) => ({
          date,
          ga      : ga.portfolio?.[i]  ?? null,
          pso     : pso.portfolio?.[i] ?? null,
          buy_hold: bh.portfolio?.[i]  ?? null,
        })),

        convergence: (ga.history || []).map((val: number, i: number) => ({
          generation: i,
          ga        : val,
          pso       : pso.history?.[i] ?? null,
        })),
      };

      setResults(transformed);
      setResultDateRange({
        start: config.startDate,
        end  : config.endDate
      });

      // ── Save to comparison runs ──────────────────────────
      const newRun = {
        run_number     : runCounter,
        pop_size       : config.populationSize,
        generations    : config.generations,
        use_transformer: config.useTransformer,
        seq_len        : Number(config.transformerWindow),
        start_date     : config.startDate,
        end_date       : config.endDate,
        sector         : config.sector,      // ← ADDED sector
        ga_sharpe      : ga.sharpe        ?? 0,
        pso_sharpe     : pso.sharpe       ?? 0,
        ga_return      : ga.total_return  ?? 0,
        pso_return     : pso.total_return ?? 0,
        ga_drawdown    : ga.max_drawdown  ?? 0,
        pso_drawdown   : pso.max_drawdown ?? 0,
        timestamp      : new Date().toLocaleTimeString(),
      };
      setComparisonRuns(prev => [...prev, newRun]);
      setRunCounter(prev => prev + 1);

    } catch (e) {
      console.error("Optimization failed", e);
      toast.error("Optimization failed. Is the backend running?");
    } finally {
      clearInterval(stepInterval.current);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  useEffect(() => {
    return () => {
      if (stepInterval.current) clearInterval(stepInterval.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader isDark={isDark} onToggleTheme={toggle} />
      <HeroSection />

      <div id="dashboard" className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="performance" className="space-y-10">
          <TabsList className="bg-secondary/40 border border-border
            p-2 rounded-full h-auto">
            <TabsTrigger value="performance"
              className="rounded-full px-7 py-3 text-[15px] font-serif
              data-[state=active]:bg-dusty-blue data-[state=active]:text-white
              data-[state=active]:shadow-md transition-all duration-300">
              Performance
            </TabsTrigger>
            <TabsTrigger value="config"
              className="rounded-full px-7 py-3 text-[15px] font-serif
              data-[state=active]:bg-dusty-blue data-[state=active]:text-white
              data-[state=active]:shadow-md transition-all duration-300">
              Configuration
            </TabsTrigger>
            <TabsTrigger value="analytics"
              className="rounded-full px-7 py-3 text-[15px] font-serif
              data-[state=active]:bg-dusty-blue data-[state=active]:text-white
              data-[state=active]:shadow-md transition-all duration-300">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="simulation"
              className="rounded-full px-7 py-3 text-[15px] font-serif
              data-[state=active]:bg-dusty-blue data-[state=active]:text-white
              data-[state=active]:shadow-md transition-all duration-300">
              Simulation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <PerformanceTab
              results={results}
              isLoading={isLoading}
              dateRange={resultDateRange}
              sector={config.sector}        // ← ADDED sector prop
            />
          </TabsContent>

          <TabsContent value="config">
            <StrategyConfigTab
              config={config}
              setConfig={setConfig}
              onRunOptimization={runOptimization}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab
              results={results}
              isLoading={isLoading}
              comparisonRuns={comparisonRuns}
              onClearRuns={() => setComparisonRuns([])}
            />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationTab
              useTransformer={config.useTransformer}
              trades={null}
              isSimLoading={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;