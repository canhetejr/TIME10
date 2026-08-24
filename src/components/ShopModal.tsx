import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Check, Award, Sparkles, User, Tag } from 'lucide-react';
import { PlayerState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/gameData';
import { sound } from '../utils/sound';
import { fireCorrectSparkles } from '../utils/confetti';
import { AvatarInsignia, MoEduCoin } from './GameIcons';

interface ShopModalProps {
  player: PlayerState;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  player,
  onBuyItem,
  onEquipItem,
  onClose,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'avatar' | 'title'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Loja de Recompensas
              </h2>
              <span className="text-xs text-slate-400">
                Personalize com seus MoEdu
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700 transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance & Category Tabs */}
        <div className="my-3 space-y-2">
          <div className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Seu Saldo:</span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-400">
              <span>{player.moEdu.toLocaleString('pt-BR')}</span>
              <MoEduCoin size="xs" />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setFilterType('all');
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Todos</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterType('avatar');
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterType === 'avatar'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Avatares</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterType('title');
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterType === 'title'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Títulos</span>
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isOwned = player.unlockedItems.includes(item.id);
              const isEquipped =
                (item.type === 'avatar' && player.equippedAvatar === item.value) ||
                (item.type === 'title' && player.equippedTitle === item.value);
              const canAfford = player.moEdu >= item.price;

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {item.type === 'avatar' ? (
                        <AvatarInsignia avatarKey={item.value} size="sm" />
                      ) : (
                        <Award className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-none mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onEquipItem(item);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isEquipped
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isEquipped && <Check className="w-3.5 h-3.5" />}
                        <span>{isEquipped ? 'Equipado' : 'Equipar'}</span>
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          if (canAfford) {
                            sound.playCoin();
                            fireCorrectSparkles(0.5, 0.5);
                            onBuyItem(item);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <span className="font-mono">{item.price}</span>
                        <MoEduCoin size="xs" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
