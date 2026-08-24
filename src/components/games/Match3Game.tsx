import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Zap, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { LevelConfig } from '../../types';
import { MATCH3_ITEMS } from '../../data/gameData';
import { sound } from '../../utils/sound';
import { fireCorrectSparkles, fireWinConfetti } from '../../utils/confetti';
import { GameStar, Match3ItemBadge } from '../GameIcons';

interface Match3GameProps {
  level: LevelConfig;
  onFinishGame: (result: { stars: number; score: number; moEduEarned: number; victory: boolean }) => void;
  onExit: () => void;
}

const GRID_SIZE = 6;

interface Tile {
  id: string;
  itemId: string; // matches MATCH3_ITEMS id
  row: number;
  col: number;
  isMatched?: boolean;
}

export const Match3Game: React.FC<Match3GameProps> = ({ level, onFinishGame, onExit }) => {
  const targetScore = level.match3TargetScore || 1200;
  const initialMoves = level.match3MaxMoves || 15;

  const [board, setBoard] = useState<Tile[][]>([]);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(initialMoves);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; text: string; row: number; col: number }[]>([]);

  // Generate initial valid board without pre-existing 3-in-a-row
  const createInitialBoard = useCallback(() => {
    const newBoard: Tile[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let validItems = MATCH3_ITEMS.map((item) => item.id);

        // Prevent horizontal match-3
        if (c >= 2 && row[c - 1]?.itemId === row[c - 2]?.itemId) {
          validItems = validItems.filter((id) => id !== row[c - 1].itemId);
        }
        // Prevent vertical match-3
        if (r >= 2 && newBoard[r - 1][c]?.itemId === newBoard[r - 2][c]?.itemId) {
          validItems = validItems.filter((id) => id !== newBoard[r - 1][c].itemId);
        }

        const randomItem = validItems[Math.floor(Math.random() * validItems.length)] || MATCH3_ITEMS[0].id;
        row.push({
          id: `tile_${r}_${c}_${Math.random()}`,
          itemId: randomItem,
          row: r,
          col: c,
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  useEffect(() => {
    setBoard(createInitialBoard());
  }, [createInitialBoard]);

  // Find all matches on board
  const findMatches = (currentBoard: Tile[][]) => {
    const matchedCoords = new Set<string>();

    // Check horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const item1 = currentBoard[r][c]?.itemId;
        const item2 = currentBoard[r][c + 1]?.itemId;
        const item3 = currentBoard[r][c + 2]?.itemId;

        if (item1 && item1 === item2 && item2 === item3) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r},${c + 1}`);
          matchedCoords.add(`${r},${c + 2}`);
        }
      }
    }

    // Check vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const item1 = currentBoard[r][c]?.itemId;
        const item2 = currentBoard[r + 1][c]?.itemId;
        const item3 = currentBoard[r + 2][c]?.itemId;

        if (item1 && item1 === item2 && item2 === item3) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r + 1},${c}`);
          matchedCoords.add(`${r + 2},${c}`);
        }
      }
    }

    return matchedCoords;
  };

  // Resolve board matches, cascades and gravity
  const processBoardMatches = async (boardToProcess: Tile[][], currentCombo: number) => {
    const matches = findMatches(boardToProcess);
    if (matches.size === 0) {
      setIsProcessing(false);
      setComboCount(0);
      return;
    }

    setIsProcessing(true);
    const newCombo = currentCombo + 1;
    setComboCount(newCombo);

    if (newCombo > 1) {
      sound.playCombo(newCombo);
    } else {
      sound.playMatch();
    }

    // Calculate score
    const pointsGained = matches.size * 50 * newCombo;
    setScore((prev) => prev + pointsGained);

    // Show floating point animation
    const firstCoord = Array.from(matches)[0].split(',');
    const floatId = Date.now() + Math.random();
    setFloatingPoints((prev) => [
      ...prev,
      {
        id: floatId,
        text: `+${pointsGained}${newCombo > 1 ? ` (x${newCombo})` : ''}`,
        row: parseInt(firstCoord[0]),
        col: parseInt(firstCoord[1]),
      },
    ]);
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== floatId));
    }, 900);

    // Mark matched tiles
    const markedBoard = boardToProcess.map((row, r) =>
      row.map((tile, c) => ({
        ...tile,
        isMatched: matches.has(`${r},${c}`),
      }))
    );
    setBoard(markedBoard);

    // Wait for pop animation
    await new Promise((res) => setTimeout(res, 250));

    // Drop tiles down (gravity)
    const newBoard: Tile[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      // Drop existing surviving tiles
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (!matches.has(`${r},${c}`)) {
          newBoard[emptyRow][c] = {
            ...markedBoard[r][c],
            row: emptyRow,
            col: c,
            isMatched: false,
          };
          emptyRow--;
        }
      }
      // Fill remaining top with new random items
      for (let r = emptyRow; r >= 0; r--) {
        const randomItem = MATCH3_ITEMS[Math.floor(Math.random() * MATCH3_ITEMS.length)].id;
        newBoard[r][c] = {
          id: `tile_${r}_${c}_${Date.now()}_${Math.random()}`,
          itemId: randomItem,
          row: r,
          col: c,
          isMatched: false,
        };
      }
    }

    setBoard(newBoard);

    // Wait for falling animation, then recursively check for chain combos
    await new Promise((res) => setTimeout(res, 250));
    await processBoardMatches(newBoard, newCombo);
  };

  // Handle tile click & swap
  const handleTileClick = async (r: number, c: number) => {
    if (isProcessing || movesLeft <= 0) return;

    sound.playClick();

    if (!selectedTile) {
      setSelectedTile({ row: r, col: c });
      return;
    }

    const { row: r1, col: c1 } = selectedTile;

    // Check if clicked the same tile -> deselect
    if (r1 === r && c1 === c) {
      setSelectedTile(null);
      return;
    }

    // Check if adjacent (horizontal or vertical)
    const isAdjacent = (Math.abs(r1 - r) === 1 && c1 === c) || (Math.abs(c1 - c) === 1 && r1 === r);

    if (!isAdjacent) {
      setSelectedTile({ row: r, col: c });
      return;
    }

    // Swap tiles
    setSelectedTile(null);
    setIsProcessing(true);

    const swappedBoard = board.map((row) => [...row]);
    const tileA = { ...swappedBoard[r1][c1], row: r, col: c };
    const tileB = { ...swappedBoard[r][c], row: r1, col: c1 };
    swappedBoard[r1][c1] = tileB;
    swappedBoard[r][c] = tileA;

    setBoard(swappedBoard);

    // Check if swap created valid matches
    const matches = findMatches(swappedBoard);

    if (matches.size > 0) {
      setMovesLeft((prev) => prev - 1);
      await processBoardMatches(swappedBoard, 0);
    } else {
      // Revert swap
      sound.playWrong();
      await new Promise((res) => setTimeout(res, 200));
      const revertedBoard = board.map((row) => [...row]);
      revertedBoard[r1][c1] = { ...board[r1][c1] };
      revertedBoard[r][c] = { ...board[r][c] };
      setBoard(revertedBoard);
      setIsProcessing(false);
    }
  };

  // Check victory / game over condition
  useEffect(() => {
    if (isProcessing) return;

    if (movesLeft <= 0 || score >= targetScore * 1.5) {
      const starsEarned = score >= targetScore ? (score >= targetScore * 1.4 ? 3 : 2) : score >= targetScore * 0.7 ? 1 : 0;
      const baseReward = starsEarned > 0 ? level.rewardMoEdu : 30;
      const bonusCoins = Math.floor(score / 50);

      const timer = setTimeout(() => {
        onFinishGame({
          stars: starsEarned,
          score,
          moEduEarned: baseReward + bonusCoins,
          victory: starsEarned >= 1,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [movesLeft, score, targetScore, isProcessing, level.rewardMoEdu, onFinishGame]);

  // Star progress calculation
  const star1 = targetScore * 0.7;
  const star2 = targetScore;
  const star3 = targetScore * 1.4;

  const currentStars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
  const scorePercent = Math.min(100, (score / star3) * 100);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col items-center justify-start p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Match-3 HUD Banner */}
        <div className="w-full bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md mb-3 flex items-center justify-between gap-3">
          {/* Moves Left */}
          <div className="flex flex-col items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Jogadas</span>
            <span className={`text-lg sm:text-xl font-black font-mono leading-none ${movesLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
              {movesLeft}
            </span>
          </div>

          {/* Target Score & Current */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Placar: <strong className="text-white font-mono">{score}</strong></span>
              <span>Meta: <strong className="text-emerald-400 font-mono">{targetScore}</strong></span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>

          {/* Stars status */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            {[1, 2, 3].map((starNum) => (
              <GameStar
                key={starNum}
                filled={starNum <= currentStars}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Combo Toast */}
        {comboCount > 1 && (
          <div className="mb-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-lg">
            🔥 COMBO x{comboCount}! +{comboCount * 50} pts
          </div>
        )}

        {/* Match-3 Board Grid */}
        <div className="relative bg-slate-900/90 border-3 border-indigo-600/60 rounded-3xl p-2 sm:p-3.5 shadow-2xl backdrop-blur-md aspect-square w-full max-w-[380px] sm:max-w-[420px] flex items-center justify-center">
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full h-full">
            {board.map((row, r) =>
              row.map((tile, c) => {
                const itemDef = MATCH3_ITEMS.find((it) => it.id === tile.itemId) || MATCH3_ITEMS[0];
                const isSelected = selectedTile?.row === r && selectedTile?.col === c;

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(r, c)}
                    className={`relative w-full h-full rounded-2xl flex items-center justify-center p-1 transition-all cursor-pointer select-none border-b-3 border-black/30 shadow-md ${
                      isSelected
                        ? 'ring-4 ring-white scale-105 z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                        : 'hover:brightness-110 active:scale-95'
                    } ${tile.isMatched ? 'scale-0 opacity-0 transition-transform duration-200' : ''}`}
                  >
                    <Match3ItemBadge itemId={tile.itemId} isSelected={isSelected} />
                  </button>
                );
              })
            )}
          </div>

          {/* Floating point text popups */}
          {floatingPoints.map((fp) => (
            <div
              key={fp.id}
              className="absolute pointer-events-none text-sm sm:text-base font-black text-amber-300 font-['Fredoka',sans-serif] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-float-up z-30"
              style={{
                top: `${(fp.row / GRID_SIZE) * 100 + 8}%`,
                left: `${(fp.col / GRID_SIZE) * 100 + 8}%`,
              }}
            >
              {fp.text}
            </div>
          ))}
        </div>

        {/* Helpful Tip */}
        <p className="mt-3 text-xs text-slate-400 text-center font-medium">
          💡 Clique em um item e depois em outro vizinho para trocá-los e formar sequências de 3 iguais!
        </p>
      </div>
    </div>
  );
};
