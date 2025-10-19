
import { useQuery } from "@tanstack/react-query";
import { ScoreboardDisplay } from "@/components/scoreboard-display";
import type { GameState } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ScoreboardOverlay() {
  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ["/api/game-state"],
    refetchInterval: 1000, // Update more frequently for overlay
  });

  if (isLoading || !gameState) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="container max-w-7xl mx-auto">
        <ScoreboardDisplay 
          gameState={gameState} 
          scoreAnimating={{ home: false, away: false }}
          touchdownAnimation={{ active: false, team: null }}
        />
      </div>
    </div>
  );
}
