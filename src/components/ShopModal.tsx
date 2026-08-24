import React from 'react';
import { X, ShoppingBag, Check, Sparkles, Award } from 'lucide-react';
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-indigo-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-xl shadow-md">
              <ShoppingBag className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif]">
                Loja de Recompensas
              </h2>
              <p className="text-xs text-indigo-300">
                Personalize seu perfil com seus MoEdu ganhos!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="my-3 py-2 px-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-bold">Seu Saldo Atual:</span>
          <div className="flex items-center gap-2 font-mono text-base font-black text-yellow-300">
            <span>{player.moEdu.toLocaleString('pt-BR')}</span>
            <MoEduCoin size="sm" />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 custom-scrollbar">
          {SHOP_ITEMS.map((item) => {
            const isOwned = player.unlockedItems.includes(item.id);
            const isEquipped =
              (item.type === 'avatar' && player.equippedAvatar === item.value) ||
              (item.type === 'title' && player.equippedTitle === item.value);
            const canAfford = player.moEdu >= item.price;

            return (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    {item.type === 'avatar' ? (
                      <AvatarInsignia avatarKey={item.value} size="md" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isOwned ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEquipItem(item);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-1 ${
                        isEquipped
                          ? 'bg-emerald-600 border-emerald-800 text-white cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-950'
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-3 cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border-amber-700 shadow-md active:translate-y-0.5'
                          : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed opacity-50'
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
        </div>
      </div>
    </div>
  );
};
