import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";

const DATE_PRESETS = [
  { label: "Full History", start: "2007-01-01", end: "2025-06-01", description: undefined },
  { label: "COVID Period", start: "2015-01-01", end: "2021-01-01", description: "Includes COVID crash" },
  { label: "Bull Run",     start: "2016-01-01", end: "2022-12-31", description: "Major bull market" },
  { label: "Recent 5Y",   start: "2020-01-01", end: "2025-06-01", description: "Post COVID recovery" },
];

// Sector options with Yahoo Finance symbols
const SECTORS = [
  { value: "^NSEBANK",   label: "Bank Nifty" },
  { value: "^CNXIT",     label: "Nifty IT" },
  { value: "^NSEI",      label: "Nifty 50" },
  { value: "^CNXPHARMA", label: "Nifty Pharma" },
  { value: "^CNXAUTO",   label: "Nifty Auto" },
];

interface StrategyConfig {
  sector           : string;
  transformerWindow: number;
  useTransformer   : boolean;
  populationSize   : number;
  generations      : number;
  startDate        : string;
  endDate          : string;
}

interface Props {
  config            : StrategyConfig;
  setConfig         : (c: StrategyConfig) => void;
  onRunOptimization : () => void;
  isLoading         : boolean;
  loadingStep       : string;
}

export function StrategyConfigTab({
  config, setConfig, onRunOptimization, isLoading, loadingStep
}: Props) {
  const update = (partial: Partial<StrategyConfig>) =>
    setConfig({ ...config, ...partial });

  return (
    <div className="space-y-8 animate-fade-up max-w-4xl mx-auto">
      <div>
        <h2 className="font-serif italic text-lg font-medium text-foreground">
          Strategy Configuration
        </h2>
        <div className="mt-1.5 h-0.5 w-12 bg-dusty-blue rounded-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Adjust parameters and run optimization
        </p>
      </div>

      <Card className="border border-border shadow-sm">
        <CardContent className="p-8 md:p-10 space-y-8">

          {/* Sector + Transformer Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <Label className="text-sm text-muted-foreground">Sector</Label>
              <Select
                value={config.sector}
                onValueChange={(v) => update({ sector: v })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Show selected sector symbol */}
              <p className="text-xs text-muted-foreground font-mono">
                Symbol: {config.sector}
              </p>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm text-muted-foreground">
                Transformer Window
              </Label>
              <Select
                value={String(config.transformerWindow)}
                onValueChange={(v) => update({ transformerWindow: Number(v) })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[20, 40, 60, 90].map((v) => (
                    <SelectItem key={v} value={String(v)}>{v} days</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 
            border-t border-border pt-8">
            <div className="space-y-2.5">
              <Label className="text-sm text-muted-foreground font-serif italic">
                Start Date
              </Label>
              <input
                type="date"
                value={config.startDate}
                min="2007-01-01"
                max={config.endDate}
                onChange={(e) => update({ startDate: e.target.value })}
                className="flex h-11 w-full rounded-md border border-input 
                  bg-background px-3 py-2 text-sm font-mono text-foreground 
                  shadow-sm focus-visible:outline-none focus-visible:ring-1 
                  focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm text-muted-foreground font-serif italic">
                End Date
              </Label>
              <input
                type="date"
                value={config.endDate}
                min={config.startDate}
                max="2025-12-31"
                onChange={(e) => update({ endDate: e.target.value })}
                className="flex h-11 w-full rounded-md border border-input 
                  bg-background px-3 py-2 text-sm font-mono text-foreground 
                  shadow-sm focus-visible:outline-none focus-visible:ring-1 
                  focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Date Presets */}
          <div className="space-y-2.5">
            <Label className="text-sm text-muted-foreground font-serif italic">
              Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => update({ startDate: p.start, endDate: p.end })}
                  className={`px-3 py-1.5 text-xs font-serif rounded-md 
                    border transition-colors ${
                    config.startDate === p.start && config.endDate === p.end
                      ? "border-dusty-blue bg-dusty-blue/10 text-dusty-blue"
                      : "border-border bg-secondary/40 text-muted-foreground \
                         hover:border-dusty-blue/50 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Use Transformer Toggle */}
          <div className="flex items-center justify-between py-4 
            border-t border-border">
            <Label className="text-sm text-muted-foreground">
              Use Transformer
            </Label>
            <Switch
              checked={config.useTransformer}
              onCheckedChange={(v) => update({ useTransformer: v })}
              className="scale-110 data-[state=checked]:bg-dusty-blue"
            />
          </div>

          {/* Sliders */}
          <div className="space-y-8 border-t border-border pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Population Size
                </Label>
                <span className="text-sm font-mono text-foreground 
                  bg-secondary/60 px-2.5 py-1 rounded-md">
                  {config.populationSize}
                </span>
              </div>
              <Slider
                min={20} max={100} step={10}
                value={[config.populationSize]}
                onValueChange={([v]) => update({ populationSize: v })}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 
                  [&_[role=slider]]:border-2 
                  [&_[role=slider]]:border-dusty-blue 
                  [&_.relative]:h-2.5 
                  [&_[data-orientation=horizontal]>.absolute]:bg-dusty-blue"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Generations
                </Label>
                <span className="text-sm font-mono text-foreground 
                  bg-secondary/60 px-2.5 py-1 rounded-md">
                  {config.generations}
                </span>
              </div>
              <Slider
                min={20} max={60} step={5}
                value={[config.generations]}
                onValueChange={([v]) => update({ generations: v })}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 
                  [&_[role=slider]]:border-2 
                  [&_[role=slider]]:border-dusty-blue 
                  [&_.relative]:h-2.5 
                  [&_[data-orientation=horizontal]>.absolute]:bg-dusty-blue"
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Run Button */}
      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground animate-fade-in">
            {loadingStep}
          </p>
        )}
        <Button
          onClick={onRunOptimization}
          disabled={isLoading}
          className="btn-press h-11 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Optimization
            </>
          )}
        </Button>
      </div>
    </div>
  );
}