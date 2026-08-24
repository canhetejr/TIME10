/**
 * Jornada ENADE - Jogo Web Gamificado Interativo
 * 100% jogável, mecânicas de quiz, match-3 e slot machine.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen, LevelConfig, LevelProgress, MilestoneChest, PlayerState, ShopItem } from './types';
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
import { ToastContainer, ToastMessage } from './components/Toast';
import { sound } from './utils/sound';
import { fireJackpotShower } from './utils/confetti';

const STORAGE_KEY = 'jornada_enade_save_v2';

const DEFAULT_PLAYER: PlayerState = {
  name: 'Estudante Fera',
  moEdu: 150, // starting gift
  avatar: 'capelo',
  title: 'Calouro ENADE',
  soundEnabled: true,
  unlockedItems: [],
  claimedChests: [],
  equippedTitle: 'Calouro ENADE',
  equippedAvatar: 'capelo',
  levels: {
    1: { levelId: 1, unlocked: true, completed: false, stars: 0, highScore: 0 },
    2: { levelId: 2, unlocked: false, completed: false, stars: 0, highScore: 0 },
    3: { levelId: 3, unlocked: false, completed: false, stars: 0, highScore: 0 },
    4: { levelId: 4, unlocked: false, completed: false, stars: 0, highScore: 0 },
    5: { levelId: 5, unlocked: false, completed: false, stars: 0, highScore: 0 },
    6: { levelId: 6, unlocked: false, completed: false, stars: 0, highScore: 0 },
    7: { levelId: 7, unlocked: false, completed: false, stars: 0, highScore: 0 },
    8: { levelId: 8, unlocked: false, completed: false, stars: 0, highScore: 0 },
    9: { levelId: 9, unlocked: false, completed: false, stars: 0, highScore: 0 },
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('splash');
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'info' | 'warning', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Player state with localStorage support and automatic migration
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('jornada_enade_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PLAYER,
          ...parsed,
          claimedChests: parsed.claimedChests || [],
          levels: {
            ...DEFAULT_PLAYER.levels,
            ...(parsed.levels || {}),
          },
        };
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
    const newState = !player.soundEnabled;
    setPlayer((prev) => ({ ...prev, soundEnabled: newState }));
    showToast('info', newState ? '🔊 Áudio ativado' : '🔇 Áudio mudo');
  };

  const handleStartGameFromSplash = (playerName: string) => {
    setPlayer((prev) => ({ ...prev, name: playerName }));
    setCurrentScreen('map');
  };

  const handleSelectLevel = (level: LevelConfig) => {
    setActiveLevel(level);
    setIsLevelModalOpen(true);
  };

  const handleClaimMilestoneChest = (chest: MilestoneChest) => {
    if (player.claimedChests?.includes(chest.id)) return;
    
    sound.playJackpot();
    fireJackpotShower();

    setPlayer((prev) => ({
      ...prev,
      moEdu: prev.moEdu + chest.rewardMoEdu,
      claimedChests: [...(prev.claimedChests || []), chest.id],
    }));

    showToast('success', '🎁 Baú Resgatado!', `+${chest.rewardMoEdu} MoEdu creditados na sua conta.`);
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

    showToast('success', '🛍️ Item Desbloqueado!', `${item.name} foi equipado com sucesso.`);
  };

  const handleEquipShopItem = (item: ShopItem) => {
    setPlayer((prev) => ({
      ...prev,
      equippedAvatar: item.type === 'avatar' ? item.value : prev.equippedAvatar,
      equippedTitle: item.type === 'title' ? item.value : prev.equippedTitle,
    }));

    showToast('info', '✨ Item Equipado', `${item.name} está agora em exibição.`);
  };

  const handleResetProgress = () => {
    setPlayer(DEFAULT_PLAYER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    showToast('warning', '🔄 Progresso Reiniciado', 'O mapa foi restaurado para a Fase 1.');
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
      <main className="flex-1 flex flex-col items-center justify-start w-full relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col items-center justify-center"
            >
              <SplashScreen
                onStartGame={handleStartGameFromSplash}
                defaultName={player.name}
              />
            </motion.div>
          )}

          {currentScreen === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col items-center"
            >
              <MapScreen
                levels={INITIAL_LEVELS}
                player={player}
                onSelectLevel={handleSelectLevel}
                onResetProgress={handleResetProgress}
                onClaimChest={handleClaimMilestoneChest}
              />
            </motion.div>
          )}

          {currentScreen === 'quiz' && activeLevel && (
            <motion.div
              key={`quiz-${activeLevel.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col items-center"
            >
              <QuizGame
                level={activeLevel}
                onFinishGame={handleFinishMinigame}
                onExit={handleBackToMap}
              />
            </motion.div>
          )}

          {currentScreen === 'match3' && activeLevel && (
            <motion.div
              key={`match3-${activeLevel.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col items-center"
            >
              <Match3Game
                level={activeLevel}
                onFinishGame={handleFinishMinigame}
                onExit={handleBackToMap}
              />
            </motion.div>
          )}

          {currentScreen === 'slot' && activeLevel && (
            <motion.div
              key={`slot-${activeLevel.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col items-center"
            >
              <SlotMachineGame
                level={activeLevel}
                onFinishGame={handleFinishMinigame}
                onExit={handleBackToMap}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast Feedback Overlay */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Level Briefing Modal */}
      <AnimatePresence>
        {isLevelModalOpen && activeLevel && (
          <LevelModal
            level={activeLevel}
            progress={player.levels[activeLevel.id]}
            onStart={handleStartMinigame}
            onClose={() => setIsLevelModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Result Victory/Defeat Modal */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Shop Modal */}
      <AnimatePresence>
        {isShopOpen && (
          <ShopModal
            player={player}
            onBuyItem={handleBuyShopItem}
            onEquipItem={handleEquipShopItem}
            onClose={() => setIsShopOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Ranking Modal */}
      <AnimatePresence>
        {isRankingOpen && (
          <RankingModal
            player={player}
            onClose={() => setIsRankingOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
