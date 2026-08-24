export type GameScreen = 'splash' | 'map' | 'quiz' | 'match3' | 'slot';

export type GameType = 'quiz' | 'match3' | 'slot';

export type TrackId = 'geral' | 'raciocinio' | 'lideranca';

export type LevelDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Mestre ENADE';

export interface QuizQuestion {
  id: string;
  question: string;
  theme: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LevelConfig {
  id: number;
  trackId: TrackId;
  trackTitle: string;
  title: string;
  subtitle: string;
  type: GameType;
  icon: string;
  difficulty: LevelDifficulty;
  rewardMoEdu: number;
  requiredStarsToUnlock: number;
  description: string;
  isBossLevel?: boolean;
  // Specific settings
  quizQuestions?: QuizQuestion[];
  match3TargetScore?: number;
  match3MaxMoves?: number;
  slotSpinsAllowed?: number;
  slotTargetMoEdu?: number;
}

export interface MilestoneChest {
  id: string;
  requiredStars: number;
  rewardMoEdu: number;
  title: string;
  description: string;
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
}

export interface PlayerState {
  name: string;
  moEdu: number;
  avatar: string;
  title: string;
  soundEnabled: boolean;
  unlockedItems: string[];
  claimedChests: string[];
  equippedTitle: string;
  equippedAvatar: string;
  levels: Record<number, LevelProgress>;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'avatar' | 'title' | 'powerup';
  icon: string;
  value: string;
}

