import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function DashboardHeader({ isDark, onToggleTheme }: Props) {
  return (
    <header className="px-6 py-3 flex items-center justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleTheme}
        className="rounded-lg text-muted-foreground hover:text-foreground"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
