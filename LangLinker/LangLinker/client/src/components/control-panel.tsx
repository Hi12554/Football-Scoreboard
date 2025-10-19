import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GameState } from "@shared/schema";
import { 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy,
  Timer,
  ArrowRight,
  ArrowLeft,
  Palette,
  Flag,
  Clock,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const FLAG_TYPES = [
  "False Start",
  "Holding",
  "Pass Interference",
  "Offsides",
  "Illegal Formation",
  "Roughing the Passer",
  "Facemask",
  "Delay of Game",
  "Unsportsmanlike Conduct",
  "Unnecessary Roughness",
  "Personal Foul",
  "Illegal Block Above the Waist",
  "Clipping",
  "Illegal Use of Hands",
  "Encroachment",
  "Neutral Zone Infraction",
  "Illegal Shift",
  "Illegal Motion",
  "Roughing the Kicker",
  "Running Into the Kicker",
  "Illegal Substitution",
  "Too Many Men on Field",
  "Taunting",
  "Horse Collar Tackle",
  "Lowering the Head to Initiate Contact",
  "Tripping",
  "Chop Block",
  "Illegal Blindside Block",
];

interface ControlPanelProps {
  gameState: GameState;
  onUpdateScore: (team: "home" | "away", points: number) => void;
  onToggleClock: () => void;
  onResetClock: () => void;
  onSetQuarter: (quarter: 1 | 2 | 3 | 4 | "OT") => void;
  onTogglePossession: () => void;
  onSetPossession: (team: "home" | "away" | null) => void;
  onSetDown: (down: 1 | 2 | 3 | 4) => void;
  onUpdateYardsToGo: (change: number) => void;
  onUpdateFieldPosition: (change: number) => void;
  onResetGame: () => void;
  onUpdateTeam: (team: "home" | "away", updates: Partial<GameState["homeTeam"]>) => void;
  onSetFlag: (team: "home" | "away", type: string) => void;
  onClearFlag: () => void;
}

const PRESET_COLORS = [
  { name: "Chiefs Red", primary: "#E31837" },
  { name: "Raiders Black", primary: "#000000" },
  { name: "Packers Green", primary: "#203731" },
  { name: "Cowboys Blue", primary: "#003594" },
  { name: "49ers Red", primary: "#AA0000" },
  { name: "Seahawks Blue", primary: "#002244" },
  { name: "Broncos Orange", primary: "#FB4F14" },
  { name: "Patriots Blue", primary: "#002244" },
  { name: "Steelers Yellow", primary: "#FFB612" },
  { name: "Eagles Green", primary: "#004C54" },
];

export function ControlPanel({
  gameState,
  onUpdateScore,
  onToggleClock,
  onResetClock,
  onSetQuarter,
  onTogglePossession,
  onSetPossession,
  onSetDown,
  onUpdateYardsToGo,
  onUpdateFieldPosition,
  onResetGame,
  onUpdateTeam,
  onSetFlag,
  onClearFlag,
}: ControlPanelProps) {
  const [homeLogoDialogOpen, setHomeLogoDialogOpen] = useState(false);
  const [awayLogoDialogOpen, setAwayLogoDialogOpen] = useState(false);
  const [homeFlagDialogOpen, setHomeFlagDialogOpen] = useState(false);
  const [awayFlagDialogOpen, setAwayFlagDialogOpen] = useState(false);

  const handleFileUpload = (team: "home" | "away", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateTeam(team, { logo: reader.result as string });
        if (team === "home") setHomeLogoDialogOpen(false);
        else setAwayLogoDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const ScoreButton = ({ 
    points, 
    team 
  }: { 
    points: number; 
    team: "home" | "away" 
  }) => (
    <Button
      size="sm"
      variant={points > 0 ? "default" : "secondary"}
      onClick={() => onUpdateScore(team, points)}
      className="min-w-16 font-display font-semibold"
      data-testid={`button-${team}-${points > 0 ? 'add' : 'subtract'}-${Math.abs(points)}`}
    >
      {points > 0 ? `+${points}` : points}
    </Button>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-6 bg-card/95 backdrop-blur-sm border-primary/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-foreground">Home Team</h3>
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        
        <Separator className="bg-primary/20" />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="home-team-name" className="text-sm font-semibold">
                Team Name
              </Label>
              <Input
                id="home-team-name"
                value={gameState.homeTeam.name}
                onChange={(e) => onUpdateTeam("home", { name: e.target.value.toUpperCase() })}
                className="font-display font-semibold text-center uppercase"
                maxLength={15}
                data-testid="input-home-team-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="home-team-record" className="text-sm font-semibold">
                Record
              </Label>
              <Input
                id="home-team-record"
                value={gameState.homeTeam.record}
                onChange={(e) => onUpdateTeam("home", { record: e.target.value })}
                className="font-display font-semibold text-center"
                placeholder="3-3"
                maxLength={7}
                data-testid="input-home-record"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Team Logo</Label>
            <Dialog open={homeLogoDialogOpen} onOpenChange={setHomeLogoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Home Team Logo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("home", e)}
                    data-testid="input-home-logo-file"
                  />
                  {gameState.homeTeam.logo && gameState.homeTeam.logo.startsWith('data:') && (
                    <div className="flex justify-center">
                      <img src={gameState.homeTeam.logo} alt="Home team logo preview" className="max-w-32 max-h-32 object-contain" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Team Color
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onUpdateTeam("home", { primaryColor: color.primary })}
                  className={cn(
                    "h-10 rounded-md border-2 transition-all hover-elevate active-elevate-2",
                    gameState.homeTeam.primaryColor === color.primary 
                      ? "border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                      : "border-border"
                  )}
                  style={{
                    backgroundColor: color.primary
                  }}
                  title={color.name}
                  data-testid={`button-home-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                />
              ))}
            </div>
            <div>
              <Label htmlFor="home-primary" className="text-xs text-muted-foreground">Custom Color</Label>
              <Input
                id="home-primary"
                type="color"
                value={gameState.homeTeam.primaryColor}
                onChange={(e) => onUpdateTeam("home", { primaryColor: e.target.value })}
                className="h-10 cursor-pointer"
                data-testid="input-home-primary-color"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Score Controls</Label>
            <div className="flex gap-2 justify-center flex-wrap">
              <ScoreButton points={-1} team="home" />
              <ScoreButton points={1} team="home" />
              <ScoreButton points={3} team="home" />
              <ScoreButton points={6} team="home" />
              <ScoreButton points={7} team="home" />
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeouts
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onUpdateTeam("home", { timeouts: Math.max(0, gameState.homeTeam.timeouts - 1) })}
                  disabled={gameState.homeTeam.timeouts === 0}
                  data-testid="button-home-timeout-decrease"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center text-2xl font-display font-bold" data-testid="text-home-timeouts">
                  {gameState.homeTeam.timeouts}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onUpdateTeam("home", { timeouts: Math.min(3, gameState.homeTeam.timeouts + 1) })}
                  disabled={gameState.homeTeam.timeouts === 3}
                  data-testid="button-home-timeout-increase"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Flag
              </Label>
              {gameState.activeFlag?.team === "home" ? (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white"
                  onClick={onClearFlag}
                  data-testid="button-clear-home-flag"
                >
                  <Flag className="w-4 h-4" />
                  Clear Flag
                </Button>
              ) : (
                <Dialog open={homeFlagDialogOpen} onOpenChange={setHomeFlagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2 bg-yellow-400 hover:bg-yellow-500 text-black">
                      <Flag className="w-4 h-4" />
                      Throw Flag on Home
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Flag Type</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2">
                      {FLAG_TYPES.map((flagType) => (
                        <Button
                          key={flagType}
                          variant="outline"
                          onClick={() => {
                            onSetFlag("home", flagType);
                            setHomeFlagDialogOpen(false);
                          }}
                          className="font-semibold"
                        >
                          {flagType}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Possession</Label>
            <Button
              size="default"
              variant={gameState.possession === "home" ? "default" : "outline"}
              onClick={() => onSetPossession(gameState.possession === "home" ? null : "home")}
              className="w-full font-display font-semibold gap-2"
              data-testid="button-home-possession"
            >
              <Trophy className="w-4 h-4" />
              {gameState.possession === "home" ? "Has Possession" : "Give Possession"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6 bg-card/95 backdrop-blur-sm border-primary/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-foreground">Away Team</h3>
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        
        <Separator className="bg-primary/20" />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="away-team-name" className="text-sm font-semibold">
                Team Name
              </Label>
              <Input
                id="away-team-name"
                value={gameState.awayTeam.name}
                onChange={(e) => onUpdateTeam("away", { name: e.target.value.toUpperCase() })}
                className="font-display font-semibold text-center uppercase"
                maxLength={15}
                data-testid="input-away-team-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="away-team-record" className="text-sm font-semibold">
                Record
              </Label>
              <Input
                id="away-team-record"
                value={gameState.awayTeam.record}
                onChange={(e) => onUpdateTeam("away", { record: e.target.value })}
                className="font-display font-semibold text-center"
                placeholder="2-4"
                maxLength={7}
                data-testid="input-away-record"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Team Logo</Label>
            <Dialog open={awayLogoDialogOpen} onOpenChange={setAwayLogoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Away Team Logo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("away", e)}
                    data-testid="input-away-logo-file"
                  />
                  {gameState.awayTeam.logo && gameState.awayTeam.logo.startsWith('data:') && (
                    <div className="flex justify-center">
                      <img src={gameState.awayTeam.logo} alt="Away team logo preview" className="max-w-32 max-h-32 object-contain" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Team Color
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onUpdateTeam("away", { primaryColor: color.primary })}
                  className={cn(
                    "h-10 rounded-md border-2 transition-all hover-elevate active-elevate-2",
                    gameState.awayTeam.primaryColor === color.primary 
                      ? "border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                      : "border-border"
                  )}
                  style={{
                    backgroundColor: color.primary
                  }}
                  title={color.name}
                  data-testid={`button-away-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                />
              ))}
            </div>
            <div>
              <Label htmlFor="away-primary" className="text-xs text-muted-foreground">Custom Color</Label>
              <Input
                id="away-primary"
                type="color"
                value={gameState.awayTeam.primaryColor}
                onChange={(e) => onUpdateTeam("away", { primaryColor: e.target.value })}
                className="h-10 cursor-pointer"
                data-testid="input-away-primary-color"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Score Controls</Label>
            <div className="flex gap-2 justify-center flex-wrap">
              <ScoreButton points={-1} team="away" />
              <ScoreButton points={1} team="away" />
              <ScoreButton points={3} team="away" />
              <ScoreButton points={6} team="away" />
              <ScoreButton points={7} team="away" />
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeouts
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onUpdateTeam("away", { timeouts: Math.max(0, gameState.awayTeam.timeouts - 1) })}
                  disabled={gameState.awayTeam.timeouts === 0}
                  data-testid="button-away-timeout-decrease"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center text-2xl font-display font-bold" data-testid="text-away-timeouts">
                  {gameState.awayTeam.timeouts}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onUpdateTeam("away", { timeouts: Math.min(3, gameState.awayTeam.timeouts + 1) })}
                  disabled={gameState.awayTeam.timeouts === 3}
                  data-testid="button-away-timeout-increase"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Flag
              </Label>
              {gameState.activeFlag?.team === "away" ? (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white"
                  onClick={onClearFlag}
                  data-testid="button-clear-away-flag"
                >
                  <Flag className="w-4 h-4" />
                  Clear Flag
                </Button>
              ) : (
                <Dialog open={awayFlagDialogOpen} onOpenChange={setAwayFlagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2 bg-yellow-400 hover:bg-yellow-500 text-black">
                      <Flag className="w-4 h-4" />
                      Throw Flag on Away
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Flag Type</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2">
                      {FLAG_TYPES.map((flagType) => (
                        <Button
                          key={flagType}
                          variant="outline"
                          onClick={() => {
                            onSetFlag("away", flagType);
                            setAwayFlagDialogOpen(false);
                          }}
                          className="font-semibold"
                        >
                          {flagType}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Possession</Label>
            <Button
              size="default"
              variant={gameState.possession === "away" ? "default" : "outline"}
              onClick={() => onSetPossession(gameState.possession === "away" ? null : "away")}
              className="w-full font-display font-semibold gap-2"
              data-testid="button-away-possession"
            >
              <Trophy className="w-4 h-4" />
              {gameState.possession === "away" ? "Has Possession" : "Give Possession"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6 bg-card/95 backdrop-blur-sm border-primary/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-foreground">Game Clock & Quarter</h3>
          <Timer className="w-5 h-5 text-primary" />
        </div>
        
        <Separator className="bg-primary/20" />
        
        <div className="space-y-6">
          <div className="flex gap-2 justify-center">
            <Button
              size="default"
              variant={gameState.isClockRunning ? "secondary" : "default"}
              onClick={onToggleClock}
              className="min-w-32 font-display font-semibold gap-2"
              data-testid="button-clock-toggle"
            >
              {gameState.isClockRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              size="default"
              variant="outline"
              onClick={onResetClock}
              className="min-w-32 font-display font-semibold gap-2"
              data-testid="button-clock-reset"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-3 block">Quarter</Label>
            <div className="flex gap-2 justify-center flex-wrap">
              {([1, 2, 3, 4, "OT"] as const).map((q) => (
                <Button
                  key={q}
                  size="sm"
                  variant={gameState.quarter === q ? "default" : "outline"}
                  onClick={() => onSetQuarter(q)}
                  className={cn(
                    "min-w-16 font-display font-semibold",
                    gameState.quarter === q && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  data-testid={`button-quarter-${q}`}
                >
                  {q === "OT" ? "OT" : `Q${q}`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6 bg-card/95 backdrop-blur-sm border-primary/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-foreground">Down & Field Position</h3>
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
        
        <Separator className="bg-primary/20" />
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-3 block">Down</Label>
            <div className="flex gap-2 justify-center">
              {([1, 2, 3, 4] as const).map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={gameState.down === d ? "default" : "outline"}
                  onClick={() => onSetDown(d)}
                  className={cn(
                    "min-w-16 font-display font-semibold text-lg",
                    gameState.down === d && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  data-testid={`button-down-${d}`}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Yards to Go</Label>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateYardsToGo(-1)}
                data-testid="button-yards-decrease"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div 
                className="flex-1 text-center text-3xl font-display font-bold text-foreground"
                data-testid="text-yards-control"
              >
                {gameState.yardsToGo}
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateYardsToGo(1)}
                data-testid="button-yards-increase"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Field Position</Label>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateFieldPosition(-1)}
                data-testid="button-field-decrease"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div 
                className="flex-1 text-center"
                data-testid="text-field-control"
              >
                <div className="text-3xl font-display font-bold text-foreground">
                  {gameState.fieldPosition === 50 
                    ? "50" 
                    : gameState.fieldPosition < 50 
                      ? gameState.fieldPosition 
                      : 100 - gameState.fieldPosition}
                </div>
                <div className="text-xs font-semibold text-muted-foreground mt-1">
                  {gameState.fieldPosition === 50 
                    ? "MIDFIELD" 
                    : gameState.fieldPosition < 50 
                      ? `${gameState.homeTeam.name.substring(0, 3).toUpperCase()} SIDE` 
                      : `${gameState.awayTeam.name.substring(0, 3).toUpperCase()} SIDE`}
                </div>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateFieldPosition(1)}
                data-testid="button-field-increase"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-destructive">Reset Game</Label>
            <Button
              size="default"
              variant="destructive"
              onClick={onResetGame}
              className="w-full font-display font-semibold gap-2"
              data-testid="button-reset-game"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Entire Game
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
