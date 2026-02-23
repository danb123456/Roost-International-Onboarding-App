
import React from 'react';

export const MEAT_OPTIONS = [
  { label: 'Whole Chicken', icon: '🍗' },
  { label: 'Chicken Wings', icon: '🍗' },
  { label: 'Chicken Thighs', icon: '🍗' },
  { label: 'Chicken Breast', icon: '🍗' },
  { label: 'Drumsticks', icon: '🍗' },
  { label: 'Turkey', icon: '🦃' },
  { label: 'Duck', icon: '🦆' },
  { label: 'Quail', icon: '🐦' },
  { label: 'Cornish Hen', icon: '🐦' },
  { label: 'Other', icon: '🔥' },
];

export const FUEL_OPTIONS = [
  { label: 'Gas', icon: '🔥' },
  { label: 'Charcoal', icon: '⬛' },
  { label: 'Wood', icon: '🪵' },
  { label: 'Electricity', icon: '⚡' },
  { label: 'Pellets', icon: '🍬' },
];

export const EQUIPMENT_TEMPLATES = [
  { label: 'Deep Fryer', icon: '🥘' },
  { label: 'Pressure Fryer', icon: '🍗' },
  { label: 'Rotisserie Oven', icon: '🌀' },
  { label: '4-Burner Gas Range', icon: '🔥' },
  { label: 'Industrial Char-Grill', icon: '♨️' },
  { label: 'Combi Oven', icon: '⏲️' },
  { label: 'Holding Cabinet', icon: '🌡️' },
  { label: 'Prep Table', icon: '🍽️' },
  { label: 'Vacuum Sealer', icon: '🎒' },
  { label: 'Refrigerated Trailer', icon: '❄️' },
  { label: 'Scales', icon: '⚖️' },
  { label: 'Utensils Set', icon: '🍴' },
  { label: 'Other', icon: '➕' },
];

export const STAFF_ROLES = [
  { label: 'Chef', icon: '👨‍🍳' },
  { label: 'Pitmaster', icon: '🔥' },
  { label: 'Front of House', icon: '🤝' },
  { label: 'Back of House', icon: '🧼' },
  { label: 'Family', icon: '🏠' },
];

export const REQUIREMENT_TAGS = [
  'Kitchen Access',
  'Outdoor Space',
  'Water Supply',
  'Electricity',
  'Refrigeration',
  'Extraction/Ventilation',
];

export const ROOSTLogo = () => (
  <div className="flex flex-col items-center select-none pointer-events-none">
    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-black uppercase italic">
      ROOST
    </h1>
    <div className="bg-black text-white px-4 py-0.5 mt-[-10px] font-bold text-sm tracking-widest uppercase text-center">
      The Chicken Festival
    </div>
  </div>
);
