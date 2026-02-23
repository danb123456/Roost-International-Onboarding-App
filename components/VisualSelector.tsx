
import React from 'react';

interface Option {
  label: string;
  icon?: string;
}

interface VisualSelectorProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
}

export const VisualSelector: React.FC<VisualSelectorProps> = ({ options, selected, onSelect, label }) => {
  return (
    <div className="space-y-4">
      {label && <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.label)}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 border ${
              selected === opt.label
                ? 'bg-black text-white border-black scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-10'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100'
            }`}
          >
            <span className="text-2xl mb-2 opacity-90">{opt.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tight">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
