// components/ui.jsx
import React from 'react';
import { BookText } from 'lucide-react';

export const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all border text-sm md:text-base ${
      active
        ? 'bg-white text-emerald-700 border-white shadow-lg scale-[1.02]'
        : 'bg-emerald-500/80 text-white border-emerald-400 hover:bg-emerald-400 hover:shadow-md'
    }`}
  >
    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-emerald-50' : 'bg-white/15'}`}>
      <Icon size={22} />
    </span>
    <span>{label}</span>
  </button>
);

export const TopicIndex = ({ title, items, tone = 'emerald' }) => {
  const toneClass = tone === 'teal'
    ? 'bg-teal-50 border-teal-200 text-teal-800'
    : 'bg-emerald-50 border-emerald-200 text-emerald-800';

  return (
    <div className={`${toneClass} rounded-2xl border p-5 mb-8`}>
      <h3 className="font-bold mb-3 flex items-center gap-2"><BookText size={18} />{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div key={index} className="bg-white/80 rounded-xl px-4 py-3 text-sm leading-snug border border-white">
            <span className="font-bold mr-2">{index + 1}.</span>{item}
          </div>
        ))}
      </div>
    </div>
  );
};

export const InputSection = ({ title, children }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
    <h3 className="font-bold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

export const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
    <span className="text-sm font-medium">{label}</span>
  </label>
);

export const NumberInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none" />
  </div>
);
