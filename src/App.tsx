/**
 * Jornada ENADE - Jogo Web Gamificado Interativo
 * 100% jogável, mecânicas de quiz, match-3 e slot machine.
 */

import React, { useState, useEffect } from 'react';
import { GameScreen, LevelConfig, LevelProgress, PlayerState, ShopItem } from './types';
import { INITIAL_LEVELS } from './data/gameData';
import { HeaderHUD } from './components/HeaderHUD';
import { SplashScreen } from './components/SplashScreen';
import { MapScreen } from './components/MapScreen';
import { LevelModal } from './components/LevelModal';
import { ResultModal } from './components/ResultModal';
import { ShopModal } from './components/ShopModal';
import { RankingModal } from './components/RankingModal';
import { QuizGame } from './components/games/QuizGame';
import { Match3Game } from './components/games/Match3Game';
import { SlotMachineGame } from './components/games/SlotMachineGame';
import { sound } from './utils/sound';

const STORAGE_KEY = 'jornada_enade_save_v1';

const DEFAULT_PLAYER: PlayerState = {
  name: 'Estudante Fera',
  moEdu: 100, // starting gift
  avatar: '🎓',
  title: 'Calouro ENADE',
  soundEnabled: true,
  unlockedItems: [],
  equippedTitle: 'Calouro ENADE',
  equippedAvatar: '🎓',
  levels: {
    1: { levelId: 1, unlocked: true, completed: false, stars: 0, highScore: 0 },
    2: { levelId: 2, unlocked: false, completed: false, stars: 0, highScore: 0 },
    3: { levelId: 3, unlocked: false, completed: false, stars: 0, highScore: 0 },
    4: { levelId: 4, unlocked: false, completed: false, stars: 0, highScore: 0 },
    5: { levelId: 5, unlocked: false, completed: false, stars: 0, highScore: 0 },
    6: { levelId: 6, unlocked: false, completed: false, stars: 0, highScore: 0 },
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('splash');
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);

  // Player state with localStorage support
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PLAYER;
  });

  // Modals state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  // Last game results for ResultModal
  const [lastResult, setLastResult] = useState<{
    stars: number;
    score: number;
    moEduEarned: number;
    victory: boolean;
  } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {
      // Ignore
    }
  }, [player]);

  // Sync sound engine enabled state
  useEffect(() => {
    sound.enabled = player.soundEnabled;
  }, [player.soundEnabled]);

  const handleToggleSound = () => {
    setPlayer((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleStartGameFromSplash = (playerName: string) => {
    setPlayer((prev) => ({ ...prev, name: playerName }));
    setCurrentScreen('map');
  };

  const handleSelectLevel = (level: LevelConfig) => {
    setActiveLevel(level);
    setIsLevelModalOpen(true);
  };

  const handleStartMinigame = () => {
    if (!activeLevel) return;
    setIsLevelModalOpen(false);

    if (activeLevel.type === 'quiz') {
      setCurrentScreen('quiz');
    } else if (activeLevel.type === 'match3') {
      setCurrentScreen('match3');
    } else if (activeLevel.type === 'slot') {
      setCurrentScreen('slot');
    }
  };

  const handleFinishMinigame = (result: {
    stars: number;
    score: number;
    moEduEarned: number;
    victory: boolean;
  }) => {
    if (!activeLevel) return;

    setLastResult(result);
    setIsResultModalOpen(true);

    // If victory, update player progress & unlock next level
    if (result.victory) {
      setPlayer((prev) => {
        const currentLvlProgress = prev.levels[activeLevel.id] || {
          levelId: activeLevel.id,
          unlocked: true,
          completed: false,
          stars: 0,
          highScore: 0,
        };

        const updatedStars = Math.max(currentLvlProgress.stars, result.stars);
        const updatedScore = Math.max(currentLvlProgress.highScore, result.score);

        const newLevels = {
          ...prev.levels,
          [activeLevel.id]: {
            ...currentLvlProgress,
            completed: true,
            stars: updatedStars,
            highScore: updatedScore,
          },
        };

        // Unlock next level if present
        const nextLevelId = activeLevel.id + 1;
        if (INITIAL_LEVELS.some((l) => l.id === nextLevelId)) {
          newLevels[nextLevelId] = {
            ...(newLevels[nextLevelId] || {
              levelId: nextLevelId,
              completed: false,
              stars: 0,
              highScore: 0,
            }),
            unlocked: true,
          };
        }

        return {
          ...prev,
          moEdu: prev.moEdu + result.moEduEarned,
          levels: newLevels,
        };
      });
    } else {
      // Partial consolation coins
      setPlayer((prev) => ({
        ...prev,
        moEdu: prev.moEdu + result.moEduEarned,
      }));
    }
  };

  const handleNextLevel = () => {
    setIsResultModalOpen(false);
    if (!activeLevel) return;

    const nextLvl = INITIAL_LEVELS.find((l) => l.id === activeLevel.id + 1);
    if (nextLvl) {
      setActiveLevel(nextLvl);
      if (nextLvl.type === 'quiz') setCurrentScreen('quiz');
      else if (nextLvl.type === 'match3') setCurrentScreen('match3');
      else if (nextLvl.type === 'slot') setCurrentScreen('slot');
    } else {
      setCurrentScreen('map');
    }
  };

  const handleReplayCurrentLevel = () => {
    setIsResultModalOpen(false);
    if (!activeLevel) return;
    if (activeLevel.type === 'quiz') setCurrentScreen('quiz');
    else if (activeLevel.type === 'match3') setCurrentScreen('match3');
    else if (activeLevel.type === 'slot') setCurrentScreen('slot');
  };

  const handleBackToMap = () => {
    setIsResultModalOpen(false);
    setIsLevelModalOpen(false);
    setCurrentScreen('map');
  };

  const handleBuyShopItem = (item: ShopItem) => {
    if (player.moEdu < item.price) return;

    setPlayer((prev) => ({
      ...prev,
      moEdu: prev.moEdu - item.price,
      unlockedItems: [...prev.unlockedItems, item.id],
      equippedAvatar: item.type === 'avatar' ? item.value : prev.equippedAvatar,
      equippedTitle: item.type === 'title' ? item.value : prev.equippedTitle,
    }));
  };

  const handleEquipShopItem = (item: ShopItem) => {
    setPlayer((prev) => ({
      ...prev,
      equippedAvatar: item.type === 'avatar' ? item.value : prev.equippedAvatar,
      equippedTitle: item.type === 'title' ? item.value : prev.equippedTitle,
    }));
  };

  const handleResetProgress = () => {
    setPlayer(DEFAULT_PLAYER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const totalStars = (Object.values(player.levels) as LevelProgress[]).reduce((acc, l) => acc + l.stars, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* Top HUD (visible on all screens except splash) */}
      {currentScreen !== 'splash' && (
        <HeaderHUD
          player={player}
          onToggleSound={handleToggleSound}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenRanking={() => setIsRankingOpen(true)}
          onBackToMap={handleBackToMap}
          showBackButton={currentScreen !== 'map'}
          totalStars={totalStars}
        />
      )}

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {currentScreen === 'splash' && (
          <SplashScreen
            onStartGame={handleStartGameFromSplash}
            defaultName={player.name}
          />
        )}

        {currentScreen === 'map' && (
          <MapScreen
            levels={INITIAL_LEVELS}
            player={player}
            onSelectLevel={handleSelectLevel}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentScreen === 'quiz' && activeLevel && (
          <QuizGame
            level={activeLevel}
            onFinishGame={handleFinishMinigame}
            onExit={handleBackToMap}
          />
        )}

        {currentScreen === 'match3' && activeLevel && (
          <Match3Game
            level={activeLevel}
            onFinishGame={handleFinishMinigame}
            onExit={handleBackToMap}
          />
        )}

        {currentScreen === 'slot' && activeLevel && (
          <SlotMachineGame
            level={activeLevel}
            onFinishGame={handleFinishMinigame}
            onExit={handleBackToMap}
          />
        )}
      </main>

      {/* Level Briefing Modal */}
      {isLevelModalOpen && activeLevel && (
        <LevelModal
          level={activeLevel}
          progress={player.levels[activeLevel.id]}
          onStart={handleStartMinigame}
          onClose={() => setIsLevelModalOpen(false)}
        />
      )}

      {/* Result Victory/Defeat Modal */}
      {isResultModalOpen && activeLevel && lastResult && (
        <ResultModal
          level={activeLevel}
          result={lastResult}
          hasNextLevel={INITIAL_LEVELS.some((l) => l.id === activeLevel.id + 1)}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayCurrentLevel}
          onBackToMap={handleBackToMap}
        />
      )}

      {/* Shop Modal */}
      {isShopOpen && (
        <ShopModal
          player={player}
          onBuyItem={handleBuyShopItem}
          onEquipItem={handleEquipShopItem}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Ranking Modal */}
      {isRankingOpen && (
        <RankingModal
          player={player}
          onClose={() => setIsRankingOpen(false)}
        />
      )}
    </div>
  );
}
