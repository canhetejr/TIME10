import React from 'react';
import {
  GraduationCap,
  BookOpen,
  ScrollText,
  Trophy,
  Lightbulb,
  Medal,
  Award,
  Crown,
  Gem,
  Brain,
  Zap,
  Flame,
  Coins,
  Coffee,
  Sparkles,
  Star,
  Dices,
  Compass,
  MapPin,
  CheckCircle2,
  FileCheck,
  Binary,
  Target,
  Shield,
  Layers,
} from 'lucide-react';

/* =========================================================================
   1. MoEdu Authentic Game Coin Token
   ========================================================================= */
interface MoEduCoinProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const MoEduCoin: React.FC<MoEduCoinProps> = ({ size = 'md', className = '', animate = false }) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 text-[8px]',
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-6 h-6 text-xs',
    xl: 'w-8 h-8 text-sm',
  };

  const iconSizeMap = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4.5 h-4.5',
  };

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full bg-amber-500 border border-amber-300 text-amber-950 font-black shadow-sm shrink-0 select-none ${
        sizeMap[size]
      } ${animate ? 'animate-bounce-gentle' : ''} ${className}`}
    >
      <Coins className={`${iconSizeMap[size]} text-amber-950 stroke-[2.5]`} />
    </span>
  );
};

/* =========================================================================
   2. Authentic Golden Game Stars
   ========================================================================= */
interface GameStarProps {
  filled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const GameStar: React.FC<GameStarProps> = ({ filled = true, size = 'md', className = '' }) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-11 h-11',
  };

  if (!filled) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Star className={`${sizeMap[size]} text-slate-700 fill-slate-800/80 stroke-[1.5]`} />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Star
        className={`${sizeMap[size]} text-amber-400 fill-amber-400 stroke-amber-200 stroke-[1.2] drop-shadow-sm`}
      />
    </div>
  );
};

/* =========================================================================
   3. Match-3 Authentic Game Item Badges
   ========================================================================= */
interface Match3ItemBadgeProps {
  itemId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Match3ItemBadge: React.FC<Match3ItemBadgeProps> = ({ itemId, size = 'md', className = '' }) => {
  const iconSizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6 sm:w-7 sm:h-7';

  switch (itemId) {
    case 'book':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 shadow-sm">
            <BookOpen className={`${iconSizeClass} text-amber-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'grad':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 shadow-sm">
            <GraduationCap className={`${iconSizeClass} text-blue-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'exam':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
            <FileCheck className={`${iconSizeClass} text-emerald-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'trophy':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 shadow-sm">
            <Trophy className={`${iconSizeClass} text-yellow-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'bulb':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 shadow-sm">
            <Lightbulb className={`${iconSizeClass} text-rose-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'medal':
    default:
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 shadow-sm">
            <Medal className={`${iconSizeClass} text-purple-400 stroke-[2]`} />
          </div>
        </div>
      );
  }
};

/* =========================================================================
   4. Authentic Slot Machine Reel Symbols
   ========================================================================= */
interface SlotReelBadgeProps {
  symbolId: string;
  name?: string;
  isSpinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SlotReelBadge: React.FC<SlotReelBadgeProps> = ({ symbolId, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-9 h-9' : 'w-7 h-7 sm:w-8 sm:h-8';

  switch (symbolId) {
    case 'tiger':
      return (
        <div className="relative flex flex-col items-center justify-center">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-sm">
            <Flame className={`${iconSize} text-amber-400 stroke-[2]`} />
          </div>
        </div>
      );

    case 'diploma':
      return (
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-sm">
          <ScrollText className={`${iconSize} text-amber-300 stroke-[2]`} />
        </div>
      );

    case 'capelo':
      return (
        <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shadow-sm">
          <GraduationCap className={`${iconSize} text-blue-400 stroke-[2]`} />
        </div>
      );

    case 'moedu':
      return (
        <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center shadow-sm">
          <Coins className={`${iconSize} text-yellow-400 stroke-[2]`} />
        </div>
      );

    case 'trophy':
      return (
        <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shadow-sm">
          <Trophy className={`${iconSize} text-orange-400 stroke-[2]`} />
        </div>
      );

    case 'coffee':
    default:
      return (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-sm">
          <Coffee className={`${iconSize} text-emerald-400 stroke-[2]`} />
        </div>
      );
  }
};

/* =========================================================================
   5. Authentic Avatar Insignia Crests
   ========================================================================= */
interface AvatarInsigniaProps {
  avatarKey?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarInsignia: React.FC<AvatarInsigniaProps> = ({
  avatarKey = 'capelo',
  size = 'md',
  className = '',
}) => {
  const containerSizeMap = {
    xs: 'w-6 h-6 rounded-lg p-0.5',
    sm: 'w-7 h-7 rounded-xl p-1',
    md: 'w-8 h-8 rounded-xl p-1.5',
    lg: 'w-11 h-11 rounded-2xl p-2',
    xl: 'w-14 h-14 rounded-2xl p-2.5',
  };

  const iconSizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const cleanKey = avatarKey.toLowerCase();

  // Determine icon & gradient based on avatar name/emoji legacy
  if (cleanKey.includes('fera') || cleanKey.includes('tigre') || cleanKey.includes('🐯')) {
    return (
      <div
        className={`relative bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-400 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Flame className={`${iconSizeMap[size]} text-amber-400 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('cientista') || cleanKey.includes('brilhante') || cleanKey.includes('crânio') || cleanKey.includes('🧑‍🔬')) {
    return (
      <div
        className={`relative bg-cyan-500/20 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-300 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Brain className={`${iconSizeMap[size]} text-cyan-300 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('mestre') || cleanKey.includes('gabarito') || cleanKey.includes('📜')) {
    return (
      <div
        className={`relative bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-300 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <ScrollText className={`${iconSizeMap[size]} text-amber-300 stroke-[2.2]`} />
      </div>
    );
  }

  if (cleanKey.includes('calculista') || cleanKey.includes('livro') || cleanKey.includes('📚')) {
    return (
      <div
        className={`relative bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-300 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <BookOpen className={`${iconSizeMap[size]} text-emerald-300 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('relâmpago') || cleanKey.includes('veterana') || cleanKey.includes('⚡')) {
    return (
      <div
        className={`relative bg-yellow-500/20 border border-yellow-500/40 rounded-xl flex items-center justify-center text-yellow-300 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Zap className={`${iconSizeMap[size]} text-yellow-300 stroke-[2]`} />
      </div>
    );
  }

  // Default: Capelo Graduação
  return (
    <div
      className={`relative bg-blue-500/20 border border-blue-500/40 rounded-xl flex items-center justify-center text-blue-300 shrink-0 ${containerSizeMap[size]} ${className}`}
    >
      <GraduationCap className={`${iconSizeMap[size]} text-blue-300 stroke-[2]`} />
    </div>
  );
};

/* =========================================================================
   6. Authentic Level Crest Badges
   ========================================================================= */
interface LevelIconBadgeProps {
  levelId: number;
  type: 'quiz' | 'match3' | 'slot';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LevelIconBadge: React.FC<LevelIconBadgeProps> = ({
  levelId,
  type,
  size = 'md',
  className = '',
}) => {
  const iconClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  if (levelId === 1) {
    return <Brain className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }
  if (levelId === 2) {
    return <BookOpen className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }
  if (levelId === 3) {
    return <Dices className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }
  if (levelId === 4) {
    return <Zap className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }
  if (levelId === 5) {
    return <Trophy className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }
  if (levelId === 6) {
    return <Crown className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  }

  // Fallback by type
  if (type === 'quiz') return <Brain className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  if (type === 'match3') return <Layers className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
  return <Dices className={`${iconClass} text-slate-900 stroke-[2.2]`} />;
};

/* =========================================================================
   7. Authentic Rank Emblem Badges (1st, 2nd, 3rd)
   ========================================================================= */
interface LeaderboardRankBadgeProps {
  rank: number;
}

export const LeaderboardRankBadge: React.FC<LeaderboardRankBadgeProps> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center">
        <Crown className="w-4 h-4 text-amber-400" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-400/20 border border-slate-400 flex items-center justify-center">
        <Medal className="w-4 h-4 text-slate-300" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-xl bg-amber-700/20 border border-amber-600 flex items-center justify-center">
        <Award className="w-4 h-4 text-amber-500" />
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-slate-400">
      #{rank}
    </div>
  );
};
