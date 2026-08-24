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
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-2 border-yellow-200 shadow-[0_2px_6px_rgba(217,119,6,0.5)] shrink-0 select-none ${
        sizeMap[size]
      } ${animate ? 'animate-pulse' : ''} ${className}`}
    >
      {/* Outer Rim Highlight */}
      <span className="absolute inset-0.5 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 border border-yellow-200/60 shadow-inner flex items-center justify-center">
        <Coins className={`${iconSizeMap[size]} text-amber-950 stroke-[2.5] drop-shadow-sm`} />
      </span>
      {/* Top Specular Glint */}
      <span className="absolute top-0.5 left-1 w-1.5 h-1 bg-white/60 rounded-full blur-[0.5px] pointer-events-none" />
    </span>
  );
};

/* =========================================================================
   2. Authentic Golden Game Stars
   ========================================================================= */
interface GameStarProps {
  filled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const GameStar: React.FC<GameStarProps> = ({ filled = true, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-11 h-11',
  };

  if (!filled) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Star className={`${sizeMap[size]} text-slate-700 stroke-[1.5] opacity-40`} />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Soft Gold Glow */}
      <span className="absolute inset-0 rounded-full bg-amber-400/30 blur-sm scale-125 pointer-events-none" />
      <Star
        className={`${sizeMap[size]} text-yellow-300 fill-gradient-gold fill-amber-400 drop-shadow-[0_2px_5px_rgba(245,158,11,0.8)] stroke-yellow-200 stroke-1`}
      />
      {/* Inner spark */}
      <span className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-80 pointer-events-none" />
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
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(217,119,6,0.5)] border border-amber-200">
            <BookOpen className={`${iconSizeClass} text-amber-950 stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/70 rounded-full blur-[0.5px]" />
          </div>
        </div>
      );

    case 'grad':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(59,130,246,0.5)] border border-blue-200">
            <GraduationCap className={`${iconSizeClass} text-white stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/70 rounded-full blur-[0.5px]" />
          </div>
        </div>
      );

    case 'exam':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(16,185,129,0.5)] border border-emerald-200">
            <FileCheck className={`${iconSizeClass} text-emerald-950 stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/70 rounded-full blur-[0.5px]" />
          </div>
        </div>
      );

    case 'trophy':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_4px_10px_rgba(234,179,8,0.6)] border border-yellow-100">
            <Trophy className={`${iconSizeClass} text-amber-950 stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/80 rounded-full blur-[0.5px]" />
          </div>
        </div>
      );

    case 'bulb':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-rose-400 via-orange-400 to-rose-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(244,63,94,0.5)] border border-orange-200">
            <Lightbulb className={`${iconSizeClass} text-white stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/70 rounded-full blur-[0.5px]" />
          </div>
        </div>
      );

    case 'medal':
    default:
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-purple-300 via-fuchsia-400 to-purple-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(168,85,247,0.5)] border border-purple-200">
            <Medal className={`${iconSizeClass} text-purple-950 stroke-[2.2] drop-shadow`} />
            <span className="absolute top-1 left-1.5 w-2 h-1 bg-white/70 rounded-full blur-[0.5px]" />
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
  size?: 'sm' | 'md' | 'lg';
}

export const SlotReelBadge: React.FC<SlotReelBadgeProps> = ({ symbolId, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8 sm:w-9 sm:h-9';

  switch (symbolId) {
    case 'tiger':
      return (
        <div className="relative flex flex-col items-center justify-center">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-600 via-red-500 to-yellow-400 border-2 border-yellow-200 shadow-[0_0_15px_rgba(239,68,68,0.7)] flex items-center justify-center">
            <Flame className={`${iconSize} text-white fill-amber-200 stroke-[2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`} />
          </div>
          <span className="absolute -top-1 -right-1">
            <Crown className="w-4 h-4 text-yellow-300 fill-yellow-400 drop-shadow" />
          </span>
        </div>
      );

    case 'diploma':
      return (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-200 border-2 border-white shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center">
          <ScrollText className={`${iconSize} text-amber-950 stroke-[2] drop-shadow`} />
        </div>
      );

    case 'capelo':
      return (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 border-2 border-cyan-200 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center">
          <GraduationCap className={`${iconSize} text-white stroke-[2] drop-shadow`} />
        </div>
      );

    case 'moedu':
      return (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-300 border-2 border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.7)] flex items-center justify-center">
          <Coins className={`${iconSize} text-amber-950 stroke-[2.2] drop-shadow`} />
        </div>
      );

    case 'trophy':
      return (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-400 border-2 border-yellow-200 shadow-[0_0_15px_rgba(249,115,22,0.6)] flex items-center justify-center">
          <Trophy className={`${iconSize} text-amber-950 stroke-[2] drop-shadow`} />
        </div>
      );

    case 'coffee':
    default:
      return (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 border-2 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.6)] flex items-center justify-center">
          <Coffee className={`${iconSize} text-white stroke-[2] drop-shadow`} />
        </div>
      );
  }
};

/* =========================================================================
   5. Authentic Avatar Insignia Crests
   ========================================================================= */
interface AvatarInsigniaProps {
  avatarKey?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarInsignia: React.FC<AvatarInsigniaProps> = ({
  avatarKey = 'capelo',
  size = 'md',
  className = '',
}) => {
  const containerSizeMap = {
    sm: 'w-7 h-7 rounded-xl p-1',
    md: 'w-8 h-8 rounded-xl p-1.5',
    lg: 'w-11 h-11 rounded-2xl p-2',
    xl: 'w-14 h-14 rounded-2xl p-2.5',
  };

  const iconSizeMap = {
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
        className={`relative bg-gradient-to-br from-amber-500 via-red-500 to-rose-600 border-2 border-amber-200 shadow-md flex items-center justify-center text-white shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Flame className={`${iconSizeMap[size]} text-yellow-200 fill-amber-300 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('cientista') || cleanKey.includes('brilhante') || cleanKey.includes('crânio') || cleanKey.includes('🧑‍🔬')) {
    return (
      <div
        className={`relative bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-600 border-2 border-cyan-200 shadow-md flex items-center justify-center text-white shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Brain className={`${iconSizeMap[size]} text-cyan-100 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('mestre') || cleanKey.includes('gabarito') || cleanKey.includes('📜')) {
    return (
      <div
        className={`relative bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-2 border-yellow-200 shadow-md flex items-center justify-center text-slate-950 shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <ScrollText className={`${iconSizeMap[size]} text-amber-950 stroke-[2.2]`} />
      </div>
    );
  }

  if (cleanKey.includes('calculista') || cleanKey.includes('livro') || cleanKey.includes('📚')) {
    return (
      <div
        className={`relative bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 border-2 border-emerald-200 shadow-md flex items-center justify-center text-white shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <BookOpen className={`${iconSizeMap[size]} text-emerald-100 stroke-[2]`} />
      </div>
    );
  }

  if (cleanKey.includes('relâmpago') || cleanKey.includes('veterana') || cleanKey.includes('⚡')) {
    return (
      <div
        className={`relative bg-gradient-to-br from-yellow-400 via-amber-500 to-rose-600 border-2 border-yellow-200 shadow-md flex items-center justify-center text-white shrink-0 ${containerSizeMap[size]} ${className}`}
      >
        <Zap className={`${iconSizeMap[size]} text-yellow-100 fill-amber-300 stroke-[2]`} />
      </div>
    );
  }

  // Default: Capelo Graduação
  return (
    <div
      className={`relative bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 border-2 border-indigo-200 shadow-md flex items-center justify-center text-white shrink-0 ${containerSizeMap[size]} ${className}`}
    >
      <GraduationCap className={`${iconSizeMap[size]} text-indigo-100 stroke-[2]`} />
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
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-400 border border-yellow-100 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.8)]">
        <Crown className="w-5 h-5 text-amber-950 fill-yellow-200 stroke-[2]" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 border border-white flex items-center justify-center shadow-[0_0_8px_rgba(203,213,225,0.6)]">
        <Medal className="w-5 h-5 text-slate-900 fill-slate-100 stroke-[2]" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-800 border border-amber-300 flex items-center justify-center shadow-[0_0_8px_rgba(180,83,9,0.6)]">
        <Award className="w-5 h-5 text-amber-950 fill-amber-300 stroke-[2]" />
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black font-mono text-slate-400">
      #{rank}
    </div>
  );
};
