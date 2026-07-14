// WarisApp.jsx
import React, { useState } from 'react';
import { BookMarked, Network, GitBranch, Users, Calculator } from 'lucide-react';
import { NavButton } from './components/ui.jsx';
import { HalamanVisualisasi } from './pages/HalamanVisualisasi.jsx';
import { HalamanMateri } from './pages/HalamanMateri.jsx';
import { HalamanMateriGraf } from './pages/HalamanMateriGraf.jsx';
import { HalamanKalkulatorMuhammadiyah } from './pages/HalamanKalkulatorMuhammadiyah.jsx';

const WarisAppLengkap = () => {
  const [halamanAktif, setHalamanAktif] = useState('visualisasi');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-7">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-emerald-50 text-sm font-semibold mb-4">
                  <Users size={17} /> Aplikasi visualisasi graf pembagian waris
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Visualisasi Graf Pembagian Waris Islam
                </h1>
                <p className="text-emerald-50 text-base md:text-lg max-w-3xl leading-relaxed">
                  Aplikasi perhitungan waris Islam yang menampilkan relasi pewaris dan ahli waris melalui visualisasi graf silsilah keluarga.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <NavButton active={halamanAktif === 'materi'} onClick={() => setHalamanAktif('materi')} icon={BookMarked} label="Materi Waris" />
              <NavButton active={halamanAktif === 'materiGraf'} onClick={() => setHalamanAktif('materiGraf')} icon={Network} label="Materi Graf" />
              <NavButton active={halamanAktif === 'visualisasi'} onClick={() => setHalamanAktif('visualisasi')} icon={GitBranch} label="Visualisasi Graf" />
              <NavButton active={halamanAktif === 'muhammadiyah'} onClick={() => setHalamanAktif('muhammadiyah')} icon={Calculator} imgSrc="/logo-muhammadiyah.png" imgAlt="Logo Muhammadiyah" label=" " />
            </div>
          </div>

          {halamanAktif === 'visualisasi' && <HalamanVisualisasi />}
          {halamanAktif === 'muhammadiyah' && <HalamanKalkulatorMuhammadiyah />}
          {halamanAktif === 'materi'      && <HalamanMateri />}
          {halamanAktif === 'materiGraf'  && <HalamanMateriGraf />}
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Prototype Aplikasi Waris Islam v1.0 • Visualisasi Graf Waris, Materi Waris, dan Materi Graf</p>
        </div>
      </div>
    </div>
  );
};

export default WarisAppLengkap;
