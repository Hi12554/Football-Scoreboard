
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScoreboardDisplay } from "@/components/scoreboard-display";
import type { GameState } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ScoreboardOverlay() {
  const [scoreAnimating, setScoreAnimating] = useState<{
    home: boolean;
    away: boolean;
  }>({ home: false, away: false });
  const [touchdownAnimation, setTouchdownAnimation] = useState<{
    active: boolean;
    team: "home" | "away" | null;
  }>({ active: false, team: null });
  const [fieldGoalAnimation, setFieldGoalAnimation] = useState<{
    active: boolean;
    team: "home" | "away" | null;
  }>({ active: false, team: null });

  // Track previous scores to detect changes
  const prevScores = useRef<{ home: number; away: number } | null>(null);

  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ["/api/game-state"],
    refetchInterval: 1000, // Update more frequently for overlay
  });

  // Detect score changes and trigger animations
  useEffect(() => {
    if (!gameState) return;

    const currentScores = {
      home: gameState.homeTeam.score,
      away: gameState.awayTeam.score,
    };

    if (prevScores.current) {
      // Check for home team score change
      const homePointsAdded = currentScores.home - prevScores.current.home;
      if (homePointsAdded > 0) {
        triggerScoreAnimation("home", homePointsAdded);
      }

      // Check for away team score change
      const awayPointsAdded = currentScores.away - prevScores.current.away;
      if (awayPointsAdded > 0) {
        triggerScoreAnimation("away", awayPointsAdded);
      }
    }

    prevScores.current = currentScores;
  }, [gameState?.homeTeam.score, gameState?.awayTeam.score]);

  const triggerScoreAnimation = (team: "home" | "away", points: number) => {
    setScoreAnimating((prev) => ({
      ...prev,
      [team]: true,
    }));

    // Trigger field goal animation for 3 points
    if (points === 3) {
      setFieldGoalAnimation({ active: true, team });
      setTimeout(() => {
        setFieldGoalAnimation({ active: false, team: null });
      }, 3500);
    }

    // Trigger touchdown animation for 6 or 7 points
    if (points === 6 || points === 7) {
      setTouchdownAnimation({ active: true, team });
      setTimeout(() => {
        setTouchdownAnimation({ active: false, team: null });
      }, 4000);
    }

    setTimeout(() => {
      setScoreAnimating((prev) => ({
        ...prev,
        [team]: false,
      }));
    }, 400);
  };

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
          scoreAnimating={scoreAnimating}
          touchdownAnimation={touchdownAnimation}
          fieldGoalAnimation={fieldGoalAnimation}
        />
      </div>
    </div>
  );
}
