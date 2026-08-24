import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelConfig } from '../../types';
import { MATCH3_ITEMS } from '../../data/gameData';
import { sound } from '../../utils/sound';
import { GameStar, Match3ItemBadge } from '../GameIcons';
import { ArrowLeft, Lightbulb, Flame, Sparkles } from 'lucide-react';

interface Match3GameProps {
  level: LevelConfig;
  onFinishGame: (result: { stars: number; score: number; moEduEarned: number; victory: boolean }) => void;
  onExit: () => void;
}

const GRID_SIZE = 6;

interface Tile {
  id: string;
  itemId: string;
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
  const [hintTiles, setHintTiles] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);

  const touchStartRef = useRef<{ row: number; col: number; x: number; y: number } | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate initial valid board without pre-existing 3-in-a-row
  const createInitialBoard = useCallback(() => {
    const newBoard: Tile[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let validItems = MATCH3_ITEMS.map((item) => item.id);

        if (c >= 2 && row[c - 1]?.itemId === row[c - 2]?.itemId) {
          validItems = validItems.filter((id) => id !== row[c - 1].itemId);
        }
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

  // Find any valid move for hinting
  const findPossibleMove = useCallback((currentBoard: Tile[][]) => {
    if (currentBoard.length === 0) return null;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        // Try swap right
        if (c < GRID_SIZE - 1) {
          const testBoard = currentBoard.map((row) => row.map((t) => ({ ...t })));
          const temp = testBoard[r][c].itemId;
          testBoard[r][c].itemId = testBoard[r][c + 1].itemId;
          testBoard[r][c + 1].itemId = temp;
          if (findMatches(testBoard).size > 0) {
            return { r1: r, c1: c, r2: r, c2: c + 1 };
          }
        }
        // Try swap down
        if (r < GRID_SIZE - 1) {
          const testBoard = currentBoard.map((row) => row.map((t) => ({ ...t })));
          const temp = testBoard[r][c].itemId;
          testBoard[r][c].itemId = testBoard[r + 1][c].itemId;
          testBoard[r + 1][c].itemId = temp;
          if (findMatches(testBoard).size > 0) {
            return { r1: r, c1: c, r2: r + 1, c2: c };
          }
        }
      }
    }
    return null;
  }, []);

  // Reset idle hint timer
  const resetIdleHint = useCallback(() => {
    setHintTiles(null);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      if (!isProcessing && board.length > 0) {
        const hint = findPossibleMove(board);
        if (hint) setHintTiles(hint);
      }
    }, 4500);
  }, [board, isProcessing, findPossibleMove]);

  useEffect(() => {
    resetIdleHint();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleHint]);

  const triggerManualHint = () => {
    sound.playClick();
    const hint = findPossibleMove(board);
    if (hint) {
      setHintTiles(hint);
    }
  };

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

    const pointsGained = matches.size * 50 * newCombo;
    setScore((prev) => prev + pointsGained);

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
    }, 700);

    const markedBoard = boardToProcess.map((row, r) =>
      row.map((tile, c) => ({
        ...tile,
        isMatched: matches.has(`${r},${c}`),
      }))
    );
    setBoard(markedBoard);

    await new Promise((res) => setTimeout(res, 220));

    const newBoard: Tile[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    for (let c = 0; c < GRID_SIZE; c++) {
      const remainingTiles: Tile[] = [];
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (!matches.has(`${r},${c}`)) {
          remainingTiles.push(boardToProcess[r][c]);
        }
      }

      let fillRow = GRID_SIZE - 1;
      for (const tile of remainingTiles) {
        newBoard[fillRow][c] = {
          ...tile,
          row: fillRow,
          col: c,
          isMatched: false,
        };
        fillRow--;
      }

      while (fillRow >= 0) {
        const randomItem =
          MATCH3_ITEMS[Math.floor(Math.random() * MATCH3_ITEMS.length)].id;
        newBoard[fillRow][c] = {
          id: `tile_${fillRow}_${c}_${Math.random()}`,
          itemId: randomItem,
          row: fillRow,
          col: c,
          isMatched: false,
        };
        fillRow--;
      }
    }

    setBoard(newBoard);
    await new Promise((res) => setTimeout(res, 220));

    processBoardMatches(newBoard, newCombo);
  };

  const executeSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing || movesLeft <= 0) return;

    setIsProcessing(true);
    setSelectedTile(null);
    setHintTiles(null);

    const testBoard = board.map((row) => row.map((t) => ({ ...t })));
    const tempItem = testBoard[r1][c1].itemId;
    testBoard[r1][c1].itemId = testBoard[r2][c2].itemId;
    testBoard[r2][c2].itemId = tempItem;

    const matches = findMatches(testBoard);

    if (matches.size > 0) {
      setMovesLeft((prev) => prev - 1);
      setBoard(testBoard);
      await processBoardMatches(testBoard, 0);
    } else {
      sound.playWrong();
      setBoard(testBoard);
      await new Promise((res) => setTimeout(res, 220));

      const revertedBoard = testBoard.map((row) => row.map((t) => ({ ...t })));
      revertedBoard[r1][c1].itemId = tempItem;
      revertedBoard[r2][c2].itemId = testBoard[r1][c1].itemId;
      setBoard(revertedBoard);
      setIsProcessing(false);
    }
  };

  const handleTileClick = (r: number, c: number) => {
    if (isProcessing || movesLeft <= 0) return;

    sound.playClick();
    resetIdleHint();

    if (!selectedTile) {
      setSelectedTile({ row: r, col: c });
      return;
    }

    const { row: r1, col: c1 } = selectedTile;
    const isAdjacent = Math.abs(r1 - r) + Math.abs(c1 - c) === 1;

    if (!isAdjacent) {
      setSelectedTile({ row: r, col: c });
      return;
    }

    executeSwap(r1, c1, r, c);
  };

  // Touch Swipe Gesture Support
  const handleTouchStart = (r: number, c: number, e: React.TouchEvent) => {
    if (isProcessing) return;
    const touch = e.touches[0];
    touchStartRef.current = { row: r, col: c, x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isProcessing) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minDistance = 20;

    const { row: r1, col: c1 } = touchStartRef.current;
    touchStartRef.current = null;

    if (Math.abs(dx) > minDistance || Math.abs(dy) > minDistance) {
      let r2 = r1;
      let c2 = c1;

      if (Math.abs(dx) > Math.abs(dy)) {
        c2 = dx > 0 ? Math.min(GRID_SIZE - 1, c1 + 1) : Math.max(0, c1 - 1);
      } else {
        r2 = dy > 0 ? Math.min(GRID_SIZE - 1, r1 + 1) : Math.max(0, r1 - 1);
      }

      if (r1 !== r2 || c1 !== c2) {
        sound.playClick();
        executeSwap(r1, c1, r2, c2);
      }
    }
  };

  const handleConfirmExit = () => {
    if (window.confirm('Deseja sair da fase de Match-3? O progresso da partida será cancelado.')) {
      sound.playClick();
      onExit();
    }
  };

  // Check end of game
  useEffect(() => {
    if (isProcessing) return;

    const star1 = targetScore * 0.6;
    const star2 = targetScore;
    const star3 = targetScore * 1.4;

    if (movesLeft === 0 || score >= star3) {
      const stars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
      const baseReward = stars > 0 ? level.rewardMoEdu : 25;

      const finishTimer = setTimeout(() => {
        onFinishGame({
          stars,
          score,
          moEduEarned: Math.round(score * 0.1) + baseReward,
          victory: stars >= 1,
        });
      }, 700);

      return () => clearTimeout(finishTimer);
    }
  }, [movesLeft, score, isProcessing, targetScore, level.rewardMoEdu, onFinishGame]);

  const star1 = targetScore * 0.6;
  const star2 = targetScore;
  const star3 = targetScore * 1.4;
  const currentStars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
  const scorePercent = Math.min(100, (score / star3) * 100);

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-start p-3 bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
        {/* Compact HUD with Exit & Hint */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-sm mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConfirmExit}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Sair para o Mapa"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Jogadas:</span>
              <strong className={`text-xs font-bold ${movesLeft <= 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                {movesLeft}
              </strong>
            </div>
          </div>

          <div className="flex-1 px-2 text-center">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-0.5">
              <span>{score} pts</span>
              <span className="text-emerald-400 font-mono">Meta: {targetScore}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerManualHint}
              disabled={isProcessing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all cursor-pointer"
              title="Pedir Dica de Combinação"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-0.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {[1, 2, 3].map((starNum) => (
                <GameStar key={starNum} filled={starNum <= currentStars} size="xs" />
              ))}
            </div>
          </div>
        </div>

        {/* Combo Pill */}
        <AnimatePresence>
          {comboCount > 1 && (
            <motion.div
              initial={{ scale: 0, y: -5 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className="mb-2 px-3 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Combo x{comboCount}!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board Grid */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm aspect-square w-full max-w-[320px] sm:max-w-[360px] flex items-center justify-center touch-none select-none">
          <div className="grid grid-cols-6 gap-1.5 w-full h-full">
            {board.map((row, r) =>
              row.map((tile, c) => {
                const isSelected = selectedTile?.row === r && selectedTile?.col === c;
                const isHinted =
                  (hintTiles?.r1 === r && hintTiles?.c1 === c) ||
                  (hintTiles?.r2 === r && hintTiles?.c2 === c);

                return (
                  <motion.button
                    key={tile.id}
                    layout
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTileClick(r, c)}
                    onTouchStart={(e) => handleTouchStart(r, c, e)}
                    onTouchEnd={handleTouchEnd}
                    className={`relative w-full h-full rounded-xl flex items-center justify-center p-0.5 cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'ring-2 ring-amber-400 scale-105 z-20 bg-slate-800'
                        : isHinted
                        ? 'ring-2 ring-amber-400/60 z-10'
                        : ''
                    } ${tile.isMatched ? 'scale-0 opacity-0 transition-transform duration-200' : ''}`}
                  >
                    <Match3ItemBadge itemId={tile.itemId} />
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Floating Points */}
          {floatingPoints.map((fp) => (
            <div
              key={fp.id}
              className="absolute pointer-events-none text-xs font-bold text-amber-400 font-mono animate-float-up z-30"
              style={{
                top: `${(fp.row / GRID_SIZE) * 100 + 4}%`,
                left: `${(fp.col / GRID_SIZE) * 100 + 4}%`,
              }}
            >
              {fp.text}
            </div>
          ))}
        </div>

        <p className="mt-2.5 text-xs text-slate-500 text-center font-normal">
          Toque em 2 itens vizinhos ou deslize para alinhar 3 símbolos iguais.
        </p>
      </div>
    </div>
  );
};
