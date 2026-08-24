import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-bounce-gentle cursor-pointer ${
            t.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
              : t.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-100'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
            {t.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400" />}
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-black leading-tight font-['Fredoka',sans-serif]">
              {t.title}
            </h5>
            {t.message && (
              <p className="text-[11px] opacity-85 leading-snug mt-0.5">
                {t.message}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
