// components/ui.jsx
import React, { useState } from 'react';
import { BookText } from 'lucide-react';

// NavButton mendukung ikon lucide (prop `icon`) ATAU gambar logo (prop `imgSrc`).
// Jika `imgSrc` diisi tetapi gagal dimuat, otomatis kembali ke ikon lucide.
export const NavButton = ({ active, onClick, icon: Icon, label, imgSrc, imgAlt }) => {
  const [imgError, setImgError] = useState(false);
  const pakaiLogo = imgSrc && !imgError;
  // Saat memakai logo (mis. logo putih), kotak ikon selalu berlatar hijau di
  // kedua kondisi agar logo tetap terlihat — termasuk ketika tombol aktif dan
  // latar tombolnya berubah menjadi putih.
  const bgKotak = pakaiLogo
    ? 'bg-emerald-600'
    : active
    ? 'bg-emerald-50'
    : 'bg-white/15';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all border text-sm md:text-base ${
        active
          ? 'bg-white text-emerald-700 border-white shadow-lg scale-[1.02]'
          : 'bg-emerald-500/80 text-white border-emerald-400 hover:bg-emerald-400 hover:shadow-md'
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden ${bgKotak}`}>
        {pakaiLogo ? (
          <img
            src={imgSrc}
            alt={imgAlt || label}
            onError={() => setImgError(true)}
            className="h-7 w-7 object-contain"
          />
        ) : (
          Icon ? <Icon size={22} /> : null
        )}
      </span>
      <span>{label}</span>
    </button>
  );
};

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
