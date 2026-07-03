import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { BookMarked, Network, GitBranch, Users, BookText, PanelRightClose, PanelRightOpen } from 'lucide-react';


const NavButton = ({ active, onClick, icon: Icon, label }) => (
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

const TopicIndex = ({ title, items, tone = 'emerald' }) => {
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
            </div>
          </div>

          {halamanAktif === 'visualisasi' && <HalamanVisualisasi />}
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

const InputSection = ({ title, children }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
    <h3 className="font-bold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
    <span className="text-sm font-medium">{label}</span>
  </label>
);

const NumberInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none" />
  </div>
);

const HalamanVisualisasi = () => {
  const [harta, setHarta] = useState(100000000);
  const [ahliWaris, setAhliWaris] = useState({
    istri: false, suami: false, ayah: false, ibu: false,
    kakekDariAyah: false, nenekDariAyah: false, nenekDariIbu: false,
    anakLaki: 0, anakPerempuan: 0,
    cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
    cucuLakiDariAnakPerempuan: 0, cucuPerempuanDariAnakPerempuan: 0,
    saudaraLakiKandung: 0, saudaraPerempuanKandung: 0,
    saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
    saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0,
  });
  const [sidebarTerbuka, setSidebarTerbuka] = useState(true);

  const formatRupiah = useCallback((angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }, []);

  const hitungWaris = useMemo(() => {
    const hasil = [];
    let sisaHarta = harta;

    hasil.push({ nama: 'Pewaris', bagian: 0, persentase: 0, warna: '#3b82f6', fraksi: '', id: 'pewaris' });

    // ── kondisi dasar (sama persis dengan tentukanStatus di Pembelajaran) ──────
    const adaAnakLaki       = ahliWaris.anakLaki > 0;
    const adaAnakPerempuan  = ahliWaris.anakPerempuan > 0;
    const adaAnak           = adaAnakLaki || adaAnakPerempuan;
    const ada2AnakPerempuan = ahliWaris.anakPerempuan >= 2;
    const adaCucuLakiDariAL = ahliWaris.cucuLakiDariAnakLaki > 0;
    const pengganti_anakLaki = adaAnakLaki || adaCucuLakiDariAL;

    const adaSdrLakiKandung = ahliWaris.saudaraLakiKandung > 0;

    // ── PASANGAN ───────────────────────────────────────────────────────────────
    if (ahliWaris.istri) {
      const b = adaAnak ? harta / 8 : harta / 4;
      hasil.push({ id: 'istri', nama: 'Istri', bagian: b, persentase: (b/harta)*100, warna: '#ec4899', fraksi: adaAnak ? '1/8' : '1/4' });
      sisaHarta -= b;
    }
    if (ahliWaris.suami) {
      const b = adaAnak ? harta / 4 : harta / 2;
      hasil.push({ id: 'suami', nama: 'Suami', bagian: b, persentase: (b/harta)*100, warna: '#3b82f6', fraksi: adaAnak ? '1/4' : '1/2' });
      sisaHarta -= b;
    }

    // ── ORANG TUA ──────────────────────────────────────────────────────────────
    if (ahliWaris.ayah) {
      // Jika ada anak: 1/6 fardh. Jika tidak ada anak: ashabah (sisa)
      // Jika ada anak perempuan saja: 1/6 fardh + ashabah sisa (disederhanakan: ambil 1/6 dulu)
      const b = adaAnak ? harta / 6 : sisaHarta;
      hasil.push({ id: 'ayah', nama: 'Ayah', bagian: b, persentase: (b/harta)*100, warna: '#8b5cf6', fraksi: adaAnak ? '1/6' : 'Ashabah' });
      sisaHarta -= b;
    }
    if (ahliWaris.ibu) {
      // Jika ada anak / 2+ saudara: 1/6. Jika tidak: 1/3
      const ada2Sdr = (ahliWaris.saudaraLakiKandung + ahliWaris.saudaraPerempuanKandung +
                       ahliWaris.saudaraLakiSeayah  + ahliWaris.saudaraPerempuanSeayah  +
                       ahliWaris.saudaraLakiSeibu   + ahliWaris.saudaraPerempuanSeibu) >= 2;
      const b = (adaAnak || ada2Sdr) ? harta / 6 : harta / 3;
      hasil.push({ id: 'ibu', nama: 'Ibu', bagian: b, persentase: (b/harta)*100, warna: '#f59e0b', fraksi: (adaAnak || ada2Sdr) ? '1/6' : '1/3' });
      sisaHarta -= b;
    }

    // ── KAKEK dari Ayah (terhijab Ayah) ───────────────────────────────────────
    if (ahliWaris.kakekDariAyah && !ahliWaris.ayah) {
      const b = adaAnak ? harta / 6 : sisaHarta;
      hasil.push({ id: 'kakek-ayah', nama: 'Kakek (Ayah)', bagian: b, persentase: (b/harta)*100, warna: '#6366f1', fraksi: adaAnak ? '1/6' : 'Ashabah' });
      sisaHarta -= b;
    }

    // ── NENEK dari Ayah (terhijab Ayah, Ibu, Kakek dari Ayah) ─────────────────
    if (ahliWaris.nenekDariAyah && !ahliWaris.ayah && !ahliWaris.ibu && !ahliWaris.kakekDariAyah) {
      const b = harta / 6;
      hasil.push({ id: 'nenek-ayah', nama: 'Nenek (Ayah)', bagian: b, persentase: (b/harta)*100, warna: '#f97316', fraksi: '1/6' });
      sisaHarta -= b;
    }

    // ── NENEK dari Ibu (terhijab Ibu) ─────────────────────────────────────────
    if (ahliWaris.nenekDariIbu && !ahliWaris.ibu) {
      const b = harta / 6;
      hasil.push({ id: 'nenek-ibu', nama: 'Nenek (Ibu)', bagian: b, persentase: (b/harta)*100, warna: '#fb923c', fraksi: '1/6' });
      sisaHarta -= b;
    }

    // ── ANAK ───────────────────────────────────────────────────────────────────
    if (adaAnak) {
      if (adaAnakLaki) {
        // Ada anak laki → semua anak ashabah dengan rasio 2:1
        const unitLaki = ahliWaris.anakLaki * 2;
        const unitPr   = ahliWaris.anakPerempuan;
        const totalUnit = unitLaki + unitPr;
        const hartaAnak = sisaHarta;
        const clr1 = ['#10b981','#059669','#047857','#065f46'];
        const clr2 = ['#06b6d4','#0891b2','#0e7490','#155e75'];
        for (let i = 0; i < ahliWaris.anakLaki; i++) {
          const b = (hartaAnak * 2) / totalUnit;
          hasil.push({ id: `anak-laki-${i}`, nama: `Anak Laki ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr1[i%4], fraksi: '2/n' });
        }
        for (let i = 0; i < ahliWaris.anakPerempuan; i++) {
          const b = hartaAnak / totalUnit;
          hasil.push({ id: `anak-perempuan-${i}`, nama: `Anak Perempuan ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr2[i%4], fraksi: '1/n' });
        }
        sisaHarta = 0;
      } else {
        // Hanya anak perempuan
        const clr = ['#06b6d4','#0891b2','#0e7490','#155e75'];
        if (ahliWaris.anakPerempuan === 1) {
          const b = harta / 2;
          hasil.push({ id: 'anak-perempuan-0', nama: 'Anak Perempuan 1', bagian: b, persentase: (b/harta)*100, warna: clr[0], fraksi: '1/2' });
          sisaHarta -= b;
        } else {
          // 2+ anak perempuan → 2/3 dibagi rata
          const total23 = (harta * 2) / 3;
          const bPerOrang = total23 / ahliWaris.anakPerempuan;
          for (let i = 0; i < ahliWaris.anakPerempuan; i++) {
            hasil.push({ id: `anak-perempuan-${i}`, nama: `Anak Perempuan ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr[i%4], fraksi: '2/3÷n' });
          }
          sisaHarta -= total23;
        }
      }
    }

    // ── CUCU dari Anak Laki (jika tidak ada anak laki) ─────────────────────────
    if (!adaAnakLaki && (ahliWaris.cucuLakiDariAnakLaki > 0 || ahliWaris.cucuPerempuanDariAnakLaki > 0)) {
      // Cucu laki menggantikan posisi anak laki (ashabah)
      // Cucu perempuan: terhijab jika ada 2+ anak perempuan
      const cucuLaki = ahliWaris.cucuLakiDariAnakLaki;
      const cucuPr   = ada2AnakPerempuan ? 0 : ahliWaris.cucuPerempuanDariAnakLaki;
      const totalUnit = (cucuLaki * 2) + cucuPr;
      if (totalUnit > 0) {
        const hartaCucu = sisaHarta;
        const clr1 = ['#34d399','#10b981','#059669','#047857'];
        const clr2 = ['#67e8f9','#22d3ee','#06b6d4','#0891b2'];
        for (let i = 0; i < cucuLaki; i++) {
          const b = (hartaCucu * 2) / totalUnit;
          hasil.push({ id: `cucu-l-al-${i}`, nama: `Cucu L (Anak L) ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr1[i%4], fraksi: '2/n' });
        }
        for (let i = 0; i < cucuPr; i++) {
          const b = hartaCucu / totalUnit;
          hasil.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr2[i%4], fraksi: '1/n' });
        }
        // Cucu perempuan yang terhijab 2+ anak perempuan
        if (ada2AnakPerempuan && ahliWaris.cucuPerempuanDariAnakLaki > 0) {
          for (let i = 0; i < ahliWaris.cucuPerempuanDariAnakLaki; i++) {
            hasil.push({ id: `cucu-p-al-hijab-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: 0, persentase: 0, warna: '#9ca3af', fraksi: 'Terhijab' });
          }
        }
        sisaHarta = 0;
      }
    }

    // ── SAUDARA KANDUNG ────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Anak Laki, Cucu Laki dari Anak Laki
    const hijabSdrKandung = ahliWaris.ayah || pengganti_anakLaki;
    if (!hijabSdrKandung && (ahliWaris.saudaraLakiKandung > 0 || ahliWaris.saudaraPerempuanKandung > 0)) {
      const sdrLk = ahliWaris.saudaraLakiKandung;
      const sdrPr = ahliWaris.saudaraPerempuanKandung;
      if (sdrLk > 0) {
        // Ada saudara laki → ashabah rasio 2:1
        const totalUnit = (sdrLk * 2) + sdrPr;
        const hartaSdr = sisaHarta;
        const clr1 = ['#14b8a6','#0d9488','#0f766e','#115e59'];
        const clr2 = ['#34d399','#10b981','#059669','#047857'];
        for (let i = 0; i < sdrLk; i++) {
          const b = (hartaSdr * 2) / totalUnit;
          hasil.push({ id: `sdr-l-k-${i}`, nama: `Sdr L Kandung ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr1[i%4], fraksi: '2/n' });
        }
        for (let i = 0; i < sdrPr; i++) {
          const b = hartaSdr / totalUnit;
          hasil.push({ id: `sdr-p-k-${i}`, nama: `Sdr P Kandung ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr2[i%4], fraksi: '1/n' });
        }
        sisaHarta = 0;
      } else {
        // Hanya saudara perempuan kandung
        if (sdrPr === 1) {
          const b = harta / 2;
          hasil.push({ id: 'sdr-p-k-0', nama: 'Sdr P Kandung 1', bagian: b, persentase: (b/harta)*100, warna: '#14b8a6', fraksi: '1/2' });
          sisaHarta -= b;
        } else {
          const total23 = (harta * 2) / 3;
          const bPerOrang = total23 / sdrPr;
          const clr = ['#14b8a6','#0d9488','#0f766e','#115e59'];
          for (let i = 0; i < sdrPr; i++) {
            hasil.push({ id: `sdr-p-k-${i}`, nama: `Sdr P Kandung ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr[i%4], fraksi: '2/3÷n' });
          }
          sisaHarta -= total23;
        }
      }
    }

    // ── SAUDARA SEAYAH ─────────────────────────────────────────────────────────
    // Terhijab tambahan oleh: Saudara Laki Kandung
    const hijabSdrSeayah = hijabSdrKandung || adaSdrLakiKandung;
    if (!hijabSdrSeayah && (ahliWaris.saudaraLakiSeayah > 0 || ahliWaris.saudaraPerempuanSeayah > 0)) {
      const sdrLk = ahliWaris.saudaraLakiSeayah;
      const sdrPr = ahliWaris.saudaraPerempuanSeayah;
      if (sdrLk > 0) {
        const totalUnit = (sdrLk * 2) + sdrPr;
        const hartaSdr = sisaHarta;
        const clr1 = ['#a855f7','#9333ea','#7e22ce','#6b21a8'];
        const clr2 = ['#c084fc','#a855f7','#9333ea','#7e22ce'];
        for (let i = 0; i < sdrLk; i++) {
          const b = (hartaSdr * 2) / totalUnit;
          hasil.push({ id: `sdr-l-sa-${i}`, nama: `Sdr L Seayah ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr1[i%4], fraksi: '2/n' });
        }
        for (let i = 0; i < sdrPr; i++) {
          const b = hartaSdr / totalUnit;
          hasil.push({ id: `sdr-p-sa-${i}`, nama: `Sdr P Seayah ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr2[i%4], fraksi: '1/n' });
        }
        sisaHarta = 0;
      } else {
        if (sdrPr === 1) {
          const b = harta / 2;
          hasil.push({ id: 'sdr-p-sa-0', nama: 'Sdr P Seayah 1', bagian: b, persentase: (b/harta)*100, warna: '#a855f7', fraksi: '1/2' });
          sisaHarta -= b;
        } else {
          const total23 = (harta * 2) / 3;
          const bPerOrang = total23 / sdrPr;
          const clr = ['#a855f7','#9333ea','#7e22ce','#6b21a8'];
          for (let i = 0; i < sdrPr; i++) {
            hasil.push({ id: `sdr-p-sa-${i}`, nama: `Sdr P Seayah ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr[i%4], fraksi: '2/3÷n' });
          }
          sisaHarta -= total23;
        }
      }
    }

    // ── SAUDARA SEIBU ──────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Ibu, semua Anak, Cucu Laki dari Anak Laki
    const hijabSdrSeibu = ahliWaris.ayah || ahliWaris.ibu || adaAnak || adaCucuLakiDariAL;
    if (!hijabSdrSeibu && (ahliWaris.saudaraLakiSeibu > 0 || ahliWaris.saudaraPerempuanSeibu > 0)) {
      const totalSeibu = ahliWaris.saudaraLakiSeibu + ahliWaris.saudaraPerempuanSeibu;
      // Saudara seibu: laki dan perempuan mendapat bagian sama (tidak ada rasio 2:1)
      const totalBagianSeibu = totalSeibu === 1 ? harta / 6 : harta / 3;
      const bPerOrang = totalBagianSeibu / totalSeibu;
      const fraksi = totalSeibu === 1 ? '1/6' : '1/3 ÷ n';
      const clr1 = ['#f97316','#ea580c','#c2410c','#9a3412'];
      const clr2 = ['#fbbf24','#f59e0b','#d97706','#b45309'];
      for (let i = 0; i < ahliWaris.saudaraLakiSeibu; i++) {
        hasil.push({ id: `sdr-l-si-${i}`, nama: `Sdr L Seibu ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr1[i%4], fraksi });
      }
      for (let i = 0; i < ahliWaris.saudaraPerempuanSeibu; i++) {
        hasil.push({ id: `sdr-p-si-${i}`, nama: `Sdr P Seibu ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr2[i%4], fraksi });
      }
    }

    // ── Rekonsiliasi pembagian: sisa ashabah, 'aul, dan radd ──────────────────
    const EPS = 1; // toleransi pembulatan dalam rupiah

    const isAshabahFraksi = (fr) => {
      const s = String(fr || '').toLowerCase();
      return s.includes('ashabah') || s.includes('asobah') || s.includes('sisa') || s === '2/n' || s === '1/n';
    };
    const totalTeralokasi = () => hasil
      .filter(h => h.id !== 'pewaris')
      .reduce((s, h) => s + h.bagian, 0);

    // 1) Sisa harta menjadi ashabah untuk Ayah/Kakek ketika hanya ada keturunan perempuan.
    const hanyaKeturunanPr = adaAnak && !adaAnakLaki && !adaCucuLakiDariAL;
    if (hanyaKeturunanPr) {
      const sisa = harta - totalTeralokasi();
      if (sisa > EPS) {
        const asb = hasil.find(h => h.id === 'ayah') || hasil.find(h => h.id === 'kakek-ayah');
        if (asb) {
          asb.bagian += sisa;
          asb.persentase = (asb.bagian / harta) * 100;
          asb.fraksi = asb.fraksi ? `${asb.fraksi} + Ashabah` : 'Ashabah';
        }
      }
    }

    // 2) Hitung ulang total setelah penyesuaian ashabah.
    const penerima = hasil.filter(h => h.id !== 'pewaris' && h.bagian > 0);
    const totalBagian = penerima.reduce((s, h) => s + h.bagian, 0);
    const adaAshabah = penerima.some(h => isAshabahFraksi(h.fraksi));

    if (totalBagian > harta + EPS) {
      // 'AUL: jumlah bagian furudh melebihi harta, seluruh bagian diskalakan proporsional.
      const faktor = harta / totalBagian;
      penerima.forEach(h => {
        h.bagian *= faktor;
        h.persentase = (h.bagian / harta) * 100;
        if (!h.fraksi.includes("'aul")) h.fraksi = `${h.fraksi} ('aul)`;
      });
    } else if (totalBagian < harta - EPS && !adaAshabah) {
      // RADD: masih ada sisa harta dan tidak ada ahli waris ashabah,
      // sisa dikembalikan ke ahli furudh secara proporsional, kecuali suami/istri.
      const sisa = harta - totalBagian;
      const penerimaRadd = penerima.filter(h => h.id !== 'suami' && h.id !== 'istri');
      const basis = penerimaRadd.reduce((s, h) => s + h.bagian, 0);
      if (basis > 0) {
        penerimaRadd.forEach(h => {
          h.bagian += sisa * (h.bagian / basis);
          h.persentase = (h.bagian / harta) * 100;
          if (!h.fraksi.includes('radd')) h.fraksi = `${h.fraksi} + radd`;
        });
      }
    }

    return hasil;
  }, [harta, ahliWaris]);

  // ── Bangun daftar lengkap semua ahli waris (termasuk terhijab) ───────────────
  const semuaAhliWaris = useMemo(() => {
    const adaAnakLaki       = ahliWaris.anakLaki > 0;
    const adaAnakPerempuan  = ahliWaris.anakPerempuan > 0;
    const adaAnak           = adaAnakLaki || adaAnakPerempuan;
    const adaCucuLakiDariAL = ahliWaris.cucuLakiDariAnakLaki > 0;
    const pengganti_anakLaki = adaAnakLaki || adaCucuLakiDariAL;
    const adaSdrLakiKandung  = ahliWaris.saudaraLakiKandung > 0;
    const ada2AnakPerempuan  = ahliWaris.anakPerempuan >= 2;

    const daftar = [];

    // Temukan hasil yang sudah dihitung (dapat warisan)
    const hitungById = {};
    hitungWaris.forEach(h => { hitungById[h.id] = h; });

    const tambah = (id, nama, terhijabOleh) => {
      const hit = hitungById[id];
      const mendapat = hit && hit.bagian > 0;
      daftar.push({
        id, nama,
        mendapat,
        bagian: hit?.bagian || 0,
        persentase: hit?.persentase || 0,
        fraksi: hit?.fraksi || '',
        terhijabOleh: mendapat ? null : terhijabOleh,
      });
    };

    if (ahliWaris.istri)  tambah('istri',  'Istri',  null);
    if (ahliWaris.suami)  tambah('suami',  'Suami',  null);
    if (ahliWaris.ayah)   tambah('ayah',   'Ayah',   null);
    if (ahliWaris.ibu)    tambah('ibu',    'Ibu',    null);

    if (ahliWaris.kakekDariAyah)
      tambah('kakek-ayah', 'Kakek (Ayah)', ahliWaris.ayah ? 'Terhijab oleh Ayah' : null);
    if (ahliWaris.nenekDariAyah)
      tambah('nenek-ayah', 'Nenek (Ayah)',
        ahliWaris.ayah ? 'Terhijab oleh Ayah'
        : ahliWaris.ibu ? 'Terhijab oleh Ibu'
        : ahliWaris.kakekDariAyah ? 'Terhijab oleh Kakek (Ayah)' : null);
    if (ahliWaris.nenekDariIbu)
      tambah('nenek-ibu', 'Nenek (Ibu)', ahliWaris.ibu ? 'Terhijab oleh Ibu' : null);

    for (let i = 0; i < ahliWaris.anakLaki; i++)
      tambah(`anak-laki-${i}`, `Anak Laki ${i+1}`, null);
    for (let i = 0; i < ahliWaris.anakPerempuan; i++)
      tambah(`anak-perempuan-${i}`, `Anak Perempuan ${i+1}`, null);

    for (let i = 0; i < ahliWaris.cucuLakiDariAnakLaki; i++)
      tambah(`cucu-l-al-${i}`, `Cucu L (Anak L) ${i+1}`,
        adaAnakLaki ? 'Terhijab oleh Anak Laki' : null);
    for (let i = 0; i < ahliWaris.cucuPerempuanDariAnakLaki; i++)
      tambah(`cucu-p-al-${i}`, `Cucu P (Anak L) ${i+1}`,
        adaAnakLaki ? 'Terhijab oleh Anak Laki'
        : ada2AnakPerempuan ? 'Terhijab oleh 2+ Anak Perempuan' : null);
    for (let i = 0; i < ahliWaris.cucuLakiDariAnakPerempuan; i++)
      daftar.push({ id: `cucu-l-ap-${i}`, nama: `Cucu L (Anak P) ${i+1}`, mendapat: false, bagian: 0, persentase: 0, fraksi: '', terhijabOleh: 'Dzawil Arham' });
    for (let i = 0; i < ahliWaris.cucuPerempuanDariAnakPerempuan; i++)
      daftar.push({ id: `cucu-p-ap-${i}`, nama: `Cucu P (Anak P) ${i+1}`, mendapat: false, bagian: 0, persentase: 0, fraksi: '', terhijabOleh: 'Dzawil Arham' });

    const hijabSdrKandung = ahliWaris.ayah || pengganti_anakLaki;
    for (let i = 0; i < ahliWaris.saudaraLakiKandung; i++)
      tambah(`sdr-l-k-${i}`, `Sdr L Kandung ${i+1}`,
        hijabSdrKandung ? 'Terhijab oleh Ayah / Anak Laki / Cucu Laki' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanKandung; i++)
      tambah(`sdr-p-k-${i}`, `Sdr P Kandung ${i+1}`,
        hijabSdrKandung ? 'Terhijab oleh Ayah / Anak Laki / Cucu Laki' : null);

    const hijabSdrSeayah = hijabSdrKandung || adaSdrLakiKandung;
    for (let i = 0; i < ahliWaris.saudaraLakiSeayah; i++)
      tambah(`sdr-l-sa-${i}`, `Sdr L Seayah ${i+1}`,
        hijabSdrSeayah ? 'Terhijab oleh Ayah / Anak Laki / Sdr L Kandung' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanSeayah; i++)
      tambah(`sdr-p-sa-${i}`, `Sdr P Seayah ${i+1}`,
        hijabSdrSeayah ? 'Terhijab oleh Ayah / Anak Laki / Sdr L Kandung' : null);

    const hijabSdrSeibu = ahliWaris.ayah || ahliWaris.ibu || adaAnak || adaCucuLakiDariAL;
    for (let i = 0; i < ahliWaris.saudaraLakiSeibu; i++)
      tambah(`sdr-l-si-${i}`, `Sdr L Seibu ${i+1}`,
        hijabSdrSeibu ? 'Terhijab oleh Ayah / Ibu / Anak / Cucu Laki' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanSeibu; i++)
      tambah(`sdr-p-si-${i}`, `Sdr P Seibu ${i+1}`,
        hijabSdrSeibu ? 'Terhijab oleh Ayah / Ibu / Anak / Cucu Laki' : null);

    return daftar;
  }, [ahliWaris, hitungWaris]);

  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const tampil = semuaAhliWaris;

    if (tampil.length === 0) {
      const svg = d3.select(svgRef.current).attr("width", 1100).attr("height", 520);
      svg.append("text")
        .attr("x", 550)
        .attr("y", 260)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", "16px")
        .text("Tambahkan ahli waris untuk melihat graf silsilah");
      return;
    }

    // ── Warna status graf ────────────────────────────────────────────────────
    const WARNA_DAPAT_FILL   = '#bbf7d0';
    const WARNA_DAPAT_STROKE = '#16a34a';
    const WARNA_ASOBAH_FILL  = '#bfdbfe';
    const WARNA_ASOBAH_STROKE= '#60a5fa';
    const WARNA_HIJAB_FILL   = '#e5e7eb';
    const WARNA_HIJAB_STROKE = '#9ca3af';
    const WARNA_PEWARIS      = '#0f172a';
    const WARNA_GARIS        = '#111827';

    const svgWidth = 1220;
    const svgHeight = 760;
    const centerX = 610;
    const centerY = 330;
    const nodeR = 46;
    const pewarisR = 56;

    const svg = d3.select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    // Latar lembut agar graf terlihat seperti infografis, tetapi tetap sederhana.
    svg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", svgWidth).attr("height", svgHeight)
      .attr("rx", 22)
      .attr("fill", "#ffffff");

    const isAsobah = (node) => {
      const fr = String(node.fraksi || '').toLowerCase();
      // Pada visualisasi ini, bagian 2/n, 1/n, dan sisa dipakai untuk kelompok asobah.
      return fr.includes('ashabah') || fr.includes('asobah') || fr.includes('/n') || fr.includes('sisa');
    };

    const nodeStyle = (node) => {
      if (node.id === 'pewaris') return { fill: WARNA_PEWARIS, stroke: '#0f172a', text: '#ffffff' };
      if (!node.mendapat) return { fill: WARNA_HIJAB_FILL, stroke: WARNA_HIJAB_STROKE, text: '#111827' };
      if (isAsobah(node)) return { fill: WARNA_ASOBAH_FILL, stroke: WARNA_ASOBAH_STROKE, text: '#111827' };
      return { fill: WARNA_DAPAT_FILL, stroke: WARNA_DAPAT_STROKE, text: '#111827' };
    };

    const byId = Object.fromEntries(tampil.map(item => [item.id, item]));

    const take = (predicate) => tampil.filter(predicate);
    const isAnakLaki = id => id.startsWith('anak-laki-');
    const isAnakPr = id => id.startsWith('anak-perempuan-');
    const isCucuAL = id => id.startsWith('cucu-l-al-') || id.startsWith('cucu-p-al-');
    const isCucuAP = id => id.startsWith('cucu-l-ap-') || id.startsWith('cucu-p-ap-');

    const groups = [
      { id: 'gpAyah', label: 'Garis Ayah', x: 100, y: 88, w: 270, h: 98, dash: '#9ca3af', nodes: take(n => ['kakek-ayah','nenek-ayah'].includes(n.id)), cols: 2 },
      { id: 'gpIbu', label: 'Garis Ibu', x: 850, y: 88, w: 270, h: 98, dash: '#9ca3af', nodes: take(n => ['kakek-ibu','nenek-ibu'].includes(n.id)), cols: 2 },
      { id: 'sdrK', label: 'Saudara Sekandung', x: 58, y: 300, w: 330, h: 118, dash: WARNA_DAPAT_STROKE, nodes: take(n => n.id.startsWith('sdr-l-k-') || n.id.startsWith('sdr-p-k-')), cols: 3 },
      { id: 'sdrSa', label: 'Saudara Seayah', x: 58, y: 438, w: 330, h: 118, dash: WARNA_ASOBAH_STROKE, nodes: take(n => n.id.startsWith('sdr-l-sa-') || n.id.startsWith('sdr-p-sa-')), cols: 3 },
      { id: 'sdrSi', label: 'Saudara Seibu', x: 58, y: 576, w: 330, h: 118, dash: WARNA_HIJAB_STROKE, nodes: take(n => n.id.startsWith('sdr-l-si-') || n.id.startsWith('sdr-p-si-')), cols: 3 },
      { id: 'anak', label: 'Anak', x: 748, y: 418, w: 360, h: 132, dash: WARNA_DAPAT_STROKE, nodes: take(n => isAnakLaki(n.id) || isAnakPr(n.id)), cols: 4 },
      { id: 'cucuAL', label: 'Cucu dari Anak Laki-laki', x: 455, y: 590, w: 330, h: 118, dash: WARNA_ASOBAH_STROKE, nodes: take(n => isCucuAL(n.id)), cols: 3 },
      { id: 'cucuAP', label: 'Cucu dari Anak Perempuan', x: 820, y: 590, w: 330, h: 118, dash: WARNA_DAPAT_STROKE, nodes: take(n => isCucuAP(n.id)), cols: 3 },
    ];

    const positions = {
      pewaris: { x: centerX, y: centerY },
      ayah: { x: 455, y: 210 },
      ibu: { x: 765, y: 210 },
      istri: { x: 805, y: 330 },
      suami: { x: 925, y: 330 },
      'kakek-ayah': { x: 165, y: 135 },
      'nenek-ayah': { x: 305, y: 135 },
      'kakek-ibu': { x: 915, y: 135 },
      'nenek-ibu': { x: 1055, y: 135 },
    };

    const addGroupPositions = (group) => {
      const nodes = group.nodes;
      if (!nodes.length) return;
      const cols = Math.max(1, Math.min(group.cols || 3, nodes.length));
      const rows = Math.ceil(nodes.length / cols);
      const gapX = group.w / (cols + 1);
      const gapY = Math.min(92, group.h / (rows + 1));
      nodes.forEach((node, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        positions[node.id] = {
          x: group.x + gapX * (col + 1),
          y: group.y + 48 + gapY * row,
        };
      });
    };
    groups.forEach(addGroupPositions);

    const fixedNodes = [];
    ['ayah', 'ibu', 'istri', 'suami', 'kakek-ayah', 'nenek-ayah', 'kakek-ibu', 'nenek-ibu']
      .forEach(id => {
        if (byId[id]) fixedNodes.push(byId[id]);
      });

    const graphNodes = [
      { id: 'pewaris', nama: 'Pewaris', mendapat: true, bagian: harta, persentase: 100, fraksi: '(Yang Meninggal)' },
      ...fixedNodes,
      ...groups.flatMap(g => g.nodes),
    ].filter((node, index, arr) => arr.findIndex(n => n.id === node.id) === index)
     .map(node => ({ ...node, ...(positions[node.id] || { x: centerX, y: centerY }) }));

    const has = id => graphNodes.some(n => n.id === id);
    const firstId = (predicate) => graphNodes.find(n => predicate(n.id))?.id;

    const addLink = (source, target, dashed = false) => {
      if (source && target && has(source) && has(target)) links.push({ source, target, dashed });
    };

    const links = [];
    addLink('ayah', 'pewaris');
    addLink('ibu', 'pewaris');
    addLink('istri', 'pewaris');
    addLink('suami', 'pewaris');
    addLink('kakek-ayah', has('ayah') ? 'ayah' : 'pewaris', byId['kakek-ayah'] && !byId['kakek-ayah'].mendapat);
    addLink('nenek-ayah', has('ayah') ? 'ayah' : 'pewaris', byId['nenek-ayah'] && !byId['nenek-ayah'].mendapat);
    addLink('kakek-ibu', has('ibu') ? 'ibu' : 'pewaris', byId['kakek-ibu'] && !byId['kakek-ibu'].mendapat);
    addLink('nenek-ibu', has('ibu') ? 'ibu' : 'pewaris', byId['nenek-ibu'] && !byId['nenek-ibu'].mendapat);

    graphNodes.forEach(node => {
      if (node.id.startsWith('sdr-')) addLink(node.id, 'pewaris', !node.mendapat);
      if (isAnakLaki(node.id) || isAnakPr(node.id)) addLink('pewaris', node.id, !node.mendapat);
      if (isCucuAL(node.id)) addLink(firstId(isAnakLaki) || 'pewaris', node.id, !node.mendapat);
      if (isCucuAP(node.id)) addLink(firstId(isAnakPr) || 'pewaris', node.id, !node.mendapat);
    });

    const nodePos = Object.fromEntries(graphNodes.map(n => [n.id, { x: n.x, y: n.y }]));
    const elbowPath = (s, t) => {
      const sx = nodePos[s]?.x || centerX;
      const sy = nodePos[s]?.y || centerY;
      const tx = nodePos[t]?.x || centerX;
      const ty = nodePos[t]?.y || centerY;
      if (Math.abs(sx - tx) < 16 || Math.abs(sy - ty) < 16) return `M${sx},${sy} L${tx},${ty}`;
      const midX = sx + (tx - sx) / 2;
      return `M${sx},${sy} H${midX} V${ty} H${tx}`;
    };

    // Grup putus-putus seperti contoh infografis.
    svg.append('g').selectAll('g.group-box')
      .data(groups.filter(g => g.nodes.length > 0))
      .enter()
      .append('g')
      .attr('class', 'group-box')
      .each(function(group) {
        const g = d3.select(this);
        g.append('rect')
          .attr('x', group.x)
          .attr('y', group.y)
          .attr('width', group.w)
          .attr('height', group.h)
          .attr('rx', 16)
          .attr('fill', 'none')
          .attr('stroke', group.dash)
          .attr('stroke-width', 1.8)
          .attr('stroke-dasharray', '8,7')
          .attr('opacity', 0.9);
        g.append('text')
          .attr('x', group.x + group.w / 2)
          .attr('y', group.y - 8)
          .attr('text-anchor', 'middle')
          .attr('fill', group.dash)
          .attr('font-size', 13)
          .attr('font-weight', 800)
          .text(group.label);
      });

    // Garis penghubung dibuat gelap agar hubungan graf lebih jelas.
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', d => elbowPath(d.source, d.target))
      .attr('fill', 'none')
      .attr('stroke', WARNA_GARIS)
      .attr('stroke-width', 2.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-dasharray', d => d.dashed ? '8,6' : null)
      .attr('opacity', 0)
      .transition()
      .duration(450)
      .attr('opacity', 0.82);

    const nodeG = svg.append('g')
      .selectAll('g.node')
      .data(graphNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('opacity', 0);

    nodeG.transition().duration(350).delay((d, i) => i * 25).attr('opacity', 1);

    nodeG.append('circle')
      .attr('r', 0)
      .attr('fill', d => nodeStyle(d).fill)
      .attr('stroke', d => nodeStyle(d).stroke)
      .attr('stroke-width', d => d.id === 'pewaris' ? 3 : 2)
      .style('filter', 'drop-shadow(0 6px 12px rgba(15,23,42,.12))')
      .transition()
      .duration(350)
      .delay((d, i) => i * 25)
      .attr('r', d => d.id === 'pewaris' ? pewarisR : nodeR);

    const splitLabel = (text) => {
      const clean = String(text || '').replace('Sdr ', 'Saudara ').replace('L ', 'Laki ').replace('P ', 'Perempuan ');
      const words = clean.split(' ');
      const lines = [];
      let current = '';
      words.forEach(word => {
        const test = current ? `${current} ${word}` : word;
        if (test.length > 13 && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      });
      if (current) lines.push(current);
      return lines.slice(0, 3);
    };

    nodeG.each(function(d) {
      const g = d3.select(this);
      const style = nodeStyle(d);
      const isPewaris = d.id === 'pewaris';
      const lines = splitLabel(d.nama);
      const lineHeight = isPewaris ? 15 : 12;
      const info = isPewaris ? '(Meninggal)' : (d.fraksi || (d.terhijabOleh ? 'Terhijab' : ''));
      const totalLines = lines.length + (info ? 1 : 0);
      const startY = -((totalLines - 1) * lineHeight) / 2;

      lines.forEach((line, idx) => {
        g.append('text')
          .attr('x', 0)
          .attr('y', startY + idx * lineHeight)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isPewaris ? 15 : 11)
          .attr('font-weight', 800)
          .attr('fill', style.text)
          .style('pointer-events', 'none')
          .text(line);
      });

      if (info) {
        g.append('text')
          .attr('x', 0)
          .attr('y', startY + lines.length * lineHeight + 1)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isPewaris ? 11 : 11)
          .attr('font-weight', isPewaris ? 600 : 800)
          .attr('fill', style.text)
          .style('pointer-events', 'none')
          .text(info.length > 13 ? (isAsobah(d) ? 'Asobah' : info) : info);
      }

      // Tooltip bawaan browser untuk nominal dan alasan terhijab.
      const titleText = d.id === 'pewaris'
        ? `Pewaris\nTotal harta: ${formatRupiah(harta)}`
        : `${d.nama}\nStatus: ${d.mendapat ? (isAsobah(d) ? 'Asobah' : 'Mendapat warisan') : 'Tidak mendapat warisan'}\nBagian: ${d.fraksi || '-'}\nNominal: ${formatRupiah(d.bagian || 0)}${d.terhijabOleh ? `\nKeterangan: ${d.terhijabOleh}` : ''}`;
      g.append('title').text(titleText);
    });

    // Catatan kecil di bawah graf.
    svg.append('rect')
      .attr('x', 255)
      .attr('y', 718)
      .attr('width', 710)
      .attr('height', 32)
      .attr('rx', 12)
      .attr('fill', '#f0fdf4')
      .attr('stroke', '#bbf7d0');
    svg.append('text')
      .attr('x', 610)
      .attr('y', 738)
      .attr('text-anchor', 'middle')
      .attr('fill', '#166534')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .text('Prinsip umum: bagian ahli waris mengikuti status furudh, asobah, atau terhijab sesuai kondisi keluarga.');

  }, [semuaAhliWaris, harta, formatRupiah]);

  const inputPanel = (
    <div className="h-full overflow-y-auto p-5 space-y-4 bg-slate-50">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-50/95 backdrop-blur pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Input Data Ahli Waris</h2>
          <p className="text-xs text-slate-500 mt-1">Isi data keluarga, lalu hasil graf diperbarui otomatis.</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarTerbuka(false)}
          className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
          title="Sembunyikan sidebar input"
        >
          <PanelRightClose size={20} />
        </button>
      </div>

      <InputSection title="Total Harta Warisan">
        <input type="number" value={harta} onChange={(e) => setHarta(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-lg" />
      </InputSection>

      <InputSection title="Pasangan">
        <Checkbox label="Istri"  checked={ahliWaris.istri}  onChange={e => setAhliWaris({...ahliWaris, istri: e,  suami: false})} />
        <Checkbox label="Suami"  checked={ahliWaris.suami}  onChange={e => setAhliWaris({...ahliWaris, suami: e, istri: false})} />
      </InputSection>

      <InputSection title="Orang Tua">
        <Checkbox label="Ayah"   checked={ahliWaris.ayah}   onChange={e => setAhliWaris({...ahliWaris, ayah: e})} />
        <Checkbox label="Ibu"    checked={ahliWaris.ibu}    onChange={e => setAhliWaris({...ahliWaris, ibu: e})} />
      </InputSection>

      <InputSection title="Kakek & Nenek">
        <Checkbox label="Kakek (dari Ayah)"  checked={ahliWaris.kakekDariAyah}  onChange={e => setAhliWaris({...ahliWaris, kakekDariAyah: e})} />
        <Checkbox label="Nenek (dari Ayah)"  checked={ahliWaris.nenekDariAyah}  onChange={e => setAhliWaris({...ahliWaris, nenekDariAyah: e})} />
        <Checkbox label="Nenek (dari Ibu)"   checked={ahliWaris.nenekDariIbu}   onChange={e => setAhliWaris({...ahliWaris, nenekDariIbu: e})} />
      </InputSection>

      <InputSection title="Anak">
        <NumberInput label="Anak Laki-laki"  value={ahliWaris.anakLaki}     onChange={v => setAhliWaris({...ahliWaris, anakLaki: v})} />
        <NumberInput label="Anak Perempuan"  value={ahliWaris.anakPerempuan} onChange={v => setAhliWaris({...ahliWaris, anakPerempuan: v})} />
      </InputSection>

      <InputSection title="Cucu dari Anak Laki">
        <NumberInput label="Cucu Laki"       value={ahliWaris.cucuLakiDariAnakLaki}     onChange={v => setAhliWaris({...ahliWaris, cucuLakiDariAnakLaki: v})} />
        <NumberInput label="Cucu Perempuan"  value={ahliWaris.cucuPerempuanDariAnakLaki} onChange={v => setAhliWaris({...ahliWaris, cucuPerempuanDariAnakLaki: v})} />
      </InputSection>

      <InputSection title="Cucu dari Anak Perempuan">
        <NumberInput label="Cucu Laki"       value={ahliWaris.cucuLakiDariAnakPerempuan}     onChange={v => setAhliWaris({...ahliWaris, cucuLakiDariAnakPerempuan: v})} />
        <NumberInput label="Cucu Perempuan"  value={ahliWaris.cucuPerempuanDariAnakPerempuan} onChange={v => setAhliWaris({...ahliWaris, cucuPerempuanDariAnakPerempuan: v})} />
      </InputSection>

      <InputSection title="Saudara Kandung">
        <NumberInput label="Saudara Laki Kandung"     value={ahliWaris.saudaraLakiKandung}     onChange={v => setAhliWaris({...ahliWaris, saudaraLakiKandung: v})} />
        <NumberInput label="Saudara Perempuan Kandung" value={ahliWaris.saudaraPerempuanKandung} onChange={v => setAhliWaris({...ahliWaris, saudaraPerempuanKandung: v})} />
      </InputSection>

      <InputSection title="Saudara Seayah">
        <NumberInput label="Saudara Laki Seayah"     value={ahliWaris.saudaraLakiSeayah}     onChange={v => setAhliWaris({...ahliWaris, saudaraLakiSeayah: v})} />
        <NumberInput label="Saudara Perempuan Seayah" value={ahliWaris.saudaraPerempuanSeayah} onChange={v => setAhliWaris({...ahliWaris, saudaraPerempuanSeayah: v})} />
      </InputSection>

      <InputSection title="Saudara Seibu">
        <NumberInput label="Saudara Laki Seibu"     value={ahliWaris.saudaraLakiSeibu}     onChange={v => setAhliWaris({...ahliWaris, saudaraLakiSeibu: v})} />
        <NumberInput label="Saudara Perempuan Seibu" value={ahliWaris.saudaraPerempuanSeibu} onChange={v => setAhliWaris({...ahliWaris, saudaraPerempuanSeibu: v})} />
      </InputSection>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <p className="text-sm text-amber-800"><strong>Catatan:</strong> Ini adalah kalkulasi sederhana. Untuk kasus kompleks, konsultasikan dengan ahli waris Islam.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-[760px]">
      <div className="flex flex-col lg:flex-row min-h-[760px]">
        {/* ── UTAMA: Hasil Graf + Detail ───────────────────────────────────── */}
        <main className="flex-1 min-w-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 md:p-6">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Network size={15} /> HASIL VISUALISASI GRAF
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Visualisasi Graf Pembagian Waris</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Node menunjukkan ahli waris, edge menunjukkan relasi keluarga, dan warna menunjukkan status pembagian warisan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!sidebarTerbuka && (
                <button
                  type="button"
                  onClick={() => setSidebarTerbuka(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700"
                >
                  <PanelRightOpen size={18} /> Tampilkan Input
                </button>
              )}
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-emerald-100">
                <div className="text-xs text-slate-500 mb-1">Total Harta Warisan</div>
                <div className="text-2xl font-bold text-emerald-600">{formatRupiah(harta)}</div>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-white rounded-2xl p-4 mb-5 flex flex-wrap gap-4 text-sm shadow-sm border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
              <span className="font-medium text-slate-700">Mendapat warisan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-300"></div>
              <span className="font-medium text-slate-700">Asobah / Ashabah</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>
              <span className="font-medium text-slate-700">Tidak mendapat / terhijab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 border-t-2 border-dashed border-gray-400"></div>
              <span className="font-medium text-slate-700">Relasi terhalang</span>
            </div>
          </div>

          {/* Graf */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-5 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">Area Graf Silsilah Waris</h3>
                <p className="text-xs text-slate-500">Gunakan scroll horizontal jika jumlah ahli waris cukup banyak.</p>
              </div>
              <div className="text-xs text-slate-400">Vertex = ahli waris • Edge = hubungan keluarga</div>
            </div>
            <div className="overflow-auto min-h-[520px]">
              <svg ref={svgRef} style={{ display: 'block' }} />
            </div>
          </div>

          {/* Detail Pembagian — tampilkan SEMUA termasuk terhijab */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">Detail Pembagian</h3>
                <p className="text-xs text-slate-500 mt-1">Rincian bagian tiap ahli waris berdasarkan data yang dimasukkan.</p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{semuaAhliWaris.length} ahli waris</span>
            </div>

            {semuaAhliWaris.length === 0 && (
              <div className="text-sm text-gray-400 italic">Belum ada ahli waris yang dipilih.</div>
            )}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {semuaAhliWaris.map((ahli) => {
                const isAsobah = String(ahli.fraksi || '').toLowerCase().includes('ashabah') || String(ahli.fraksi || '').toLowerCase().includes('asobah');
                const dotClass = !ahli.mendapat ? 'bg-gray-400' : isAsobah ? 'bg-blue-300' : 'bg-emerald-500';
                const borderClass = !ahli.mendapat ? 'border-gray-100 opacity-75' : isAsobah ? 'border-blue-100' : 'border-emerald-100';
                return (
                  <div key={ahli.id} className={`rounded-2xl p-4 shadow-sm border ${borderClass} bg-white`}>
                    <div className="flex justify-between gap-3 items-start">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${dotClass}`}></div>
                        <div className="min-w-0">
                          <span className={`font-semibold text-sm ${ahli.mendapat ? 'text-slate-800' : 'text-slate-400'}`}>
                            {ahli.nama}
                          </span>
                          {ahli.terhijabOleh && (
                            <div className="text-xs text-red-400 mt-1">⛔ {ahli.terhijabOleh}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {ahli.mendapat ? (
                          <>
                            <div className={`font-bold text-sm ${isAsobah ? 'text-blue-500' : 'text-emerald-600'}`}>{formatRupiah(ahli.bagian)}</div>
                            <div className="text-xs text-gray-400">{ahli.fraksi} · {ahli.persentase.toFixed(1)}%</div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-400 font-medium">Rp 0 · Terhijab</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ── SIDEBAR INPUT ───────────────────────────────────────────────── */}
        <aside className={`lg:border-l lg:border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out ${sidebarTerbuka ? 'lg:w-[390px] xl:w-[430px]' : 'lg:w-0'} ${sidebarTerbuka ? 'block' : 'hidden lg:block overflow-hidden'}`}>
          {sidebarTerbuka && inputPanel}
        </aside>
      </div>
    </div>
  );
};

const HalamanMateri = () => {
  const materiUtama = [
    {
      icon: '📌',
      title: 'Pengertian Fikih Mawaris',
      body: 'Fikih mawaris atau ilmu faraidh adalah ilmu yang membahas pemindahan harta peninggalan seseorang yang meninggal dunia kepada ahli warisnya. Pembahasannya mencakup siapa yang berhak menerima warisan, siapa yang terhalang, kadar bagian masing-masing ahli waris, serta cara menyelesaikan pembagian harta warisan.',
      points: [
        'Faraidh berarti bagian-bagian yang telah ditentukan kadarnya.',
        'Mawarits berhubungan dengan harta peninggalan yang diwariskan.',
        'Pewaris disebut muwarrits, penerima waris disebut warits, dan harta warisan disebut mauruts atau tirkah.'
      ]
    },
    {
      icon: '⚖️',
      title: 'Dasar Hukum Kewarisan Islam',
      body: 'Hukum kewarisan Islam bersumber dari Al-Qur’an, hadis Rasulullah saw., pendapat sahabat, pendapat ahli hukum Islam, serta ketentuan hukum positif seperti Kompilasi Hukum Islam di Indonesia.',
      points: [
        'QS. An-Nisa’ menjadi salah satu dasar utama pembagian waris.',
        'Hadis menganjurkan umat Islam mempelajari dan mengajarkan ilmu faraidh.',
        'Kompilasi Hukum Islam mengatur pemindahan hak kepemilikan harta peninggalan pewaris kepada ahli waris yang berhak.'
      ]
    },
    {
      icon: '🧩',
      title: 'Rukun Waris',
      body: 'Pembagian waris Islam dapat berlangsung apabila rukun-rukun kewarisan terpenuhi. Rukun ini menjadi unsur utama sebelum harta warisan dibagikan.',
      points: [
        'Al-Muwarrits, yaitu orang yang meninggal dunia dan meninggalkan harta.',
        'Al-Warits, yaitu orang yang berhak menerima warisan karena hubungan darah, perkawinan, atau sebab yang dibenarkan syariat.',
        'Al-Mauruts, yaitu harta peninggalan pewaris yang dapat diwariskan setelah dikurangi kewajiban terkait pewaris.'
      ]
    },
    {
      icon: '✅',
      title: 'Syarat Kewarisan',
      body: 'Selain rukun, terdapat syarat yang harus dipenuhi agar proses kewarisan sah dan ahli waris dapat menerima bagian.',
      points: [
        'Pewaris benar-benar telah meninggal dunia, baik secara hakiki maupun berdasarkan keputusan hukum.',
        'Ahli waris masih hidup ketika pewaris meninggal dunia, termasuk janin yang sudah ada dalam kandungan.',
        'Ada hubungan yang sah antara pewaris dan ahli waris serta tidak terdapat penghalang kewarisan.'
      ]
    }
  ];

  const kewajibanSebelumWaris = [
    { title: 'Biaya Perawatan dan Pengurusan Jenazah', desc: 'Harta peninggalan digunakan lebih dulu untuk biaya yang wajar terkait sakit, perawatan, dan pengurusan jenazah pewaris.' },
    { title: 'Pelunasan Utang', desc: 'Utang pewaris harus diselesaikan sebelum pembagian warisan kepada ahli waris.' },
    { title: 'Pelaksanaan Wasiat', desc: 'Wasiat dilaksanakan setelah pelunasan utang, selama tidak bertentangan dengan ketentuan syariat.' },
    { title: 'Pembagian kepada Ahli Waris', desc: 'Sisa harta setelah kewajiban di atas diselesaikan baru dibagikan kepada ahli waris sesuai bagian masing-masing.' }
  ];

  const sebabWaris = [
    { title: 'Nasab / Hubungan Kekerabatan', desc: 'Hubungan darah seperti anak, orang tua, saudara, kakek, nenek, dan keturunan tertentu.' },
    { title: 'Perkawinan', desc: 'Hubungan suami atau istri yang sah menurut syariat dan masih berlaku ketika pewaris meninggal dunia.' },
    { title: 'Al-Wala’', desc: 'Hubungan karena pemerdekaan budak. Bagian ini lebih banyak dibahas dalam fikih klasik.' }
  ];

  const penghalangWaris = [
    'Perbedaan agama antara pewaris dan ahli waris.',
    'Pembunuhan terhadap pewaris yang menyebabkan ahli waris terhalang menerima warisan.',
    'Perbudakan dalam pembahasan fikih klasik.',
    'Terhijab oleh ahli waris yang lebih dekat kedudukannya, misalnya saudara terhalang oleh ayah atau anak laki-laki.'
  ];

  const bagianFurudh = [
    { bagian: '1/2', ahli: 'Suami bila tidak ada anak; satu anak perempuan; satu saudara perempuan kandung atau seayah dalam kondisi tertentu.' },
    { bagian: '1/4', ahli: 'Suami bila ada anak; istri bila tidak ada anak.' },
    { bagian: '1/8', ahli: 'Istri bila pewaris memiliki anak atau keturunan dari anak laki-laki.' },
    { bagian: '2/3', ahli: 'Dua anak perempuan atau lebih; dua saudara perempuan kandung/seayah atau lebih dalam kondisi tertentu.' },
    { bagian: '1/3', ahli: 'Ibu bila tidak ada anak dan tidak ada beberapa saudara; saudara seibu dua orang atau lebih.' },
    { bagian: '1/6', ahli: 'Ayah atau ibu bila ada anak; kakek/nenek dalam kondisi tertentu; satu saudara seibu; cucu perempuan dari anak laki-laki dalam kondisi tertentu.' }
  ];

  const kelompokAhliWaris = [
    {
      title: 'Dzawil Furudh',
      desc: 'Ahli waris yang bagian pastinya telah ditentukan, seperti 1/2, 1/4, 1/8, 2/3, 1/3, dan 1/6.'
    },
    {
      title: 'Asabah',
      desc: 'Ahli waris yang menerima sisa harta setelah bagian dzawil furudh diberikan. Dalam beberapa kondisi, laki-laki mendapat dua kali bagian perempuan.'
    },
    {
      title: 'Dzawil Arham',
      desc: 'Kerabat yang memiliki hubungan darah, tetapi tidak termasuk dzawil furudh dan asabah. Mereka umumnya menerima waris apabila tidak ada dzawil furudh dan asabah.'
    }
  ];

  const langkahPembagian = [
    'Menentukan seluruh anggota keluarga yang masih hidup saat pewaris meninggal.',
    'Memilah ahli waris yang berhak dan yang terhalang atau mahjub.',
    'Menentukan bagian tetap ahli waris dzawil furudh.',
    'Menentukan ahli waris asabah yang menerima sisa harta.',
    'Menetapkan asal masalah dan saham masing-masing ahli waris.',
    'Menghitung nilai rupiah atau nilai harta sesuai saham yang diperoleh.',
    'Memeriksa kemungkinan kasus khusus seperti aul ketika saham melebihi asal masalah atau radd ketika terdapat sisa harta.'
  ];

  const contohSederhana = [
    { label: 'Kasus', value: 'Pewaris meninggalkan istri, ayah, ibu, 1 anak laki-laki, dan 1 anak perempuan.' },
    { label: 'Istri', value: 'Mendapat 1/8 karena pewaris memiliki anak.' },
    { label: 'Ayah', value: 'Mendapat 1/6 karena ada anak.' },
    { label: 'Ibu', value: 'Mendapat 1/6 karena ada anak.' },
    { label: 'Anak', value: 'Sisa harta menjadi asabah untuk anak laki-laki dan perempuan dengan perbandingan 2 : 1.' }
  ];

  const SectionCard = ({ item }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">{item.icon}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-4">{item.body}</p>
          <ul className="space-y-2">
            {item.points.map((point, index) => (
              <li key={index} className="flex gap-2 text-[15px] text-gray-700 leading-relaxed">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Materi Ilmu Waris Islam</h2>
          <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
            Ringkasan materi fikih mawaris untuk mendukung visualisasi graf waris.
            Materi ini memuat pengertian, dasar hukum, rukun, syarat, ahli waris, bagian waris,
            hijab, serta alur pembagian warisan secara sederhana.
          </p>
        </div>

        <TopicIndex
          title="Daftar submateri waris"
          items={[
            'Pengertian dan dasar hukum',
            'Rukun dan syarat kewarisan',
            'Kewajiban sebelum pembagian',
            'Sebab dan penghalang waris',
            'Kelompok ahli waris',
            'Bagian dzawil furudh',
            'Langkah pembagian',
            'Contoh kasus sederhana'
          ]}
        />

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-emerald-800 mb-1">Tujuan Mempelajari Mawaris</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Ilmu mawaris membantu keluarga memahami hak ahli waris secara adil, mencegah sengketa,
                dan memastikan harta peninggalan dibagikan setelah kewajiban pewaris diselesaikan.
                Dalam aplikasi ini, materi digunakan sebagai pendamping visualisasi graf waris.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {materiUtama.map((item, index) => <SectionCard key={index} item={item} />)}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🧾</span> Kewajiban Sebelum Harta Dibagikan
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {kewajibanSebelumWaris.map((item, index) => (
              <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold mb-3">
                  {index + 1}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔗</span> Penyebab Mendapatkan Warisan
            </h3>
            <div className="space-y-3">
              {sebabWaris.map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🚫</span> Penghalang Mendapatkan Warisan
            </h3>
            <ul className="space-y-3">
              {penghalangWaris.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed bg-red-50 border border-red-100 rounded-xl p-3">
                  <span className="text-red-500 font-bold">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>👥</span> Kelompok Ahli Waris
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {kelompokAhliWaris.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5">
                <h4 className="font-bold text-emerald-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📐</span> Bagian Dzawil Furudh
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="text-left p-3 rounded-l-lg w-24">Bagian</th>
                  <th className="text-left p-3 rounded-r-lg">Contoh Ahli Waris yang Dapat Menerima</th>
                </tr>
              </thead>
              <tbody>
                {bagianFurudh.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-amber-50">
                    <td className="p-3 font-bold text-emerald-700 text-lg">{item.bagian}</td>
                    <td className="p-3 text-gray-700 leading-relaxed">{item.ahli}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Catatan: bagian di atas berlaku sesuai kondisi keluarga yang ditinggalkan. Satu ahli waris dapat berubah bagiannya karena keberadaan ahli waris lain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🪜</span> Langkah Umum Pembagian Waris
            </h3>
            <ol className="space-y-3">
              {langkahPembagian.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🧮</span> Contoh Kasus Sederhana
            </h3>
            <div className="space-y-3">
              {contohSederhana.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="font-bold text-gray-800 text-sm mb-1">{item.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-blue-800 mb-1">Keterangan untuk Penggunaan Aplikasi</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Materi ini bersifat ringkasan edukatif. Untuk kasus nyata yang kompleks, seperti ahli waris sangat banyak,
                harta bersama, wasiat, utang, ahli waris pengganti, atau perbedaan pendapat fikih, pembagian sebaiknya
                dikonsultasikan kepada ahli faraidh, tokoh agama, atau lembaga yang berwenang.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Sumber ringkasan: Fikih Mawaris A, Dr. H. Mukhsin Aseri, M.Ag., M.H. dan disesuaikan dengan kebutuhan prototype aplikasi.</p>
        </div>
      </div>
    </div>
  );
};


const HalamanMateriGraf = () => {
  const poinMahram = [
    {
      title: 'Keluarga garis atas',
      items: ['Ayah', 'Ibu', 'Kakek', 'Nenek']
    },
    {
      title: 'Keluarga garis bawah',
      items: ['Anak', 'Cucu, dan keturunan ke bawah']
    },
    {
      title: 'Saudara dan keturunannya',
      items: ['Saudara kandung/seayah/seibu', 'Keponakan dalam batas mahram sesuai nasab']
    },
    {
      title: 'Kerabat samping tertentu',
      items: ['Paman/Bibi dari jalur ayah atau ibu sesuai ketentuan nasab']
    }
  ];

  const catatan = [
    'Halaman ini disiapkan untuk mendukung pemahaman graf keluarga dalam aplikasi waris.',
    'Gambar utama dapat kamu buat manual, lalu diletakkan pada area placeholder yang sudah disediakan.',
    'Materi dimulai dari konsep umum teori graf, kemudian difokuskan pada penerapan silsilah keluarga.'
  ];

  const konsepDasarGraf = [
    { icon: '🔵', title: 'Simpul (Vertex/Node)', desc: 'Titik atau objek dalam graf. Himpunan simpul dilambangkan V. Contoh: setiap orang dalam silsilah keluarga adalah sebuah simpul.' },
    { icon: '➖', title: 'Sisi (Edge)', desc: 'Garis yang menghubungkan dua simpul dan menyatakan relasi di antaranya. Himpunan sisi dilambangkan E. Contoh: hubungan orang tua-anak.' },
    { icon: '🔢', title: 'Derajat (Degree)', desc: 'Banyaknya sisi yang terhubung pada sebuah simpul. Semakin banyak relasi, semakin tinggi derajatnya.' },
    { icon: '🛣️', title: 'Lintasan (Path)', desc: 'Urutan simpul yang saling terhubung oleh sisi. Menunjukkan bagaimana satu simpul dapat mencapai simpul lain.' },
  ];

  const jenisGraf = [
    { title: 'Graf Tak Berarah', desc: 'Sisi tidak memiliki arah; relasi berlaku dua arah (A-B sama dengan B-A).' },
    { title: 'Graf Berarah (Digraf)', desc: 'Sisi memiliki arah (A ke B). Cocok untuk relasi berjenjang seperti orang tua ke anak.' },
    { title: 'Graf Berbobot', desc: 'Setiap sisi diberi nilai/bobot, misalnya jarak, biaya, atau kedekatan relasi.' },
    { title: 'Pohon (Tree)', desc: 'Graf terhubung tanpa sirkuit. Silsilah keluarga adalah contoh pohon berakar (rooted tree).' },
  ];

  const representasiGraf = [
    { title: 'Matriks Ketetanggaan', desc: 'Tabel berukuran n x n; sel bernilai 1 jika dua simpul terhubung dan 0 jika tidak.' },
    { title: 'Senarai Ketetanggaan', desc: 'Setiap simpul menyimpan daftar tetangganya. Hemat memori untuk graf jarang (sparse).' },
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <span className="text-3xl">🌳</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Materi Graf Silsilah Keluarga</h2>
          <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
            Halaman ini diawali dengan konsep dasar teori graf secara umum, lalu dilanjutkan dengan penerapannya untuk
            memodelkan hubungan keluarga. Konsep graf digunakan untuk membantu pengguna membaca posisi keluarga,
            hubungan nasab, dan kedekatan relasi dalam bentuk visual.
          </p>
        </div>

        <TopicIndex
          title="Fokus materi graf"
          tone="teal"
          items={[
            'Pengertian graf (V, E)',
            'Simpul (vertex) dan sisi (edge)',
            'Jenis-jenis graf',
            'Istilah dasar dan representasi graf',
            'Graf sebagai pemodelan keluarga',
            'Silsilah keluarga sebagai graf',
            'Visualisasi mahram dari nasab',
            'Penerapan pada visualisasi waris'
          ]}
        />

        {/* MATERI GRAF UMUM: KONSEP DASAR TEORI GRAF */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-teal-100 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shadow-sm">
              📐
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Konsep Dasar Teori Graf</h3>
              <p className="text-sm text-gray-500">Pengantar umum sebelum diterapkan pada silsilah keluarga.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 mb-6">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <strong>Graf</strong> adalah struktur yang terdiri atas himpunan <strong>simpul</strong> (vertex) dan himpunan <strong>sisi</strong> (edge) yang menghubungkan pasangan simpul. Secara matematis ditulis <code className="px-1.5 py-0.5 rounded bg-white border border-teal-200 text-teal-700 font-semibold">G = (V, E)</code>, dengan V himpunan simpul dan E himpunan sisi. Graf dipakai untuk memodelkan relasi antarobjek, misalnya jaringan pertemanan, peta jalan, jaringan komputer, hingga silsilah keluarga.
            </p>
          </div>

          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🔑</span> Komponen dan Istilah Dasar</h4>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {konsepDasarGraf.map((item, index) => (
              <div key={index} className="rounded-2xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm shrink-0">{item.icon}</div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">{item.title}</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🗂️</span> Jenis-Jenis Graf</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {jenisGraf.map((item, index) => (
              <div key={index} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <h5 className="font-bold text-emerald-800 mb-1 text-sm">{item.title}</h5>
                <p className="text-xs text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🧮</span> Representasi Graf</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {representasiGraf.map((item, index) => (
              <div key={index} className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                <h5 className="font-bold text-cyan-800 mb-1">{item.title}</h5>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
            <strong>Kaitan dengan waris:</strong> pada aplikasi ini setiap anggota keluarga menjadi <em>simpul</em> dan setiap hubungan nasab atau perkawinan menjadi <em>sisi</em>. Silsilah keluarga membentuk sebuah <em>pohon</em> (jenis graf khusus), sehingga status tiap ahli waris dapat ditelusuri dari simpul pewaris melalui sisi-sisinya.
          </div>
        </div>

        {/* MATERI GRAF KELUARGA (MATERI YANG SUDAH ADA) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-teal-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shadow-sm">
                🧬
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Siapakah Mahram Kita dari Nasab?
                </h3>
                <p className="text-sm text-gray-500">
                  Ilustrasi utama hubungan keluarga sebagai pengantar konsep graf.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                Simpul
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                Sisi
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                Relasi Nasab
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-white to-teal-50 border border-amber-200 rounded-3xl p-4 md:p-8">
            <div className="bg-white rounded-2xl border border-amber-100 p-4 md:p-6 flex justify-center shadow-inner">
              <img
                src="/silsilah_keluarga.png"
                alt="Silsilah keluarga dalam hukum waris Islam"
                className="w-full max-w-6xl h-auto object-contain mx-auto"
              />
            </div>
          </div>

          <div className="mt-5 bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm text-teal-800 leading-relaxed">
            <strong>Catatan:</strong> Simpan file gambar di folder <code>public</code> dengan nama <code>silsilah_keluarga.png</code> agar gambar tampil melalui <code>src="/silsilah_keluarga.png"</code>.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-xl shadow-sm">
                🔗
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pemetaan Konsep Graf</h3>
                <p className="text-sm text-gray-500">Menghubungkan teori graf dengan relasi keluarga.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-cyan-200/40" />
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold shrink-0">
                    V
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Simpul / Vertex</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Mewakili anggota keluarga seperti saya, ayah, ibu, anak, kakek, nenek, paman, bibi, saudara, dan keponakan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-200/40" />
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                    E
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Sisi / Edge</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Mewakili hubungan langsung antaranggota keluarga, misalnya saya–ayah, saya–ibu, ayah–kakek, atau saudara–anak saudara.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-amber-200/40" />
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl shrink-0">
                    🌳
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Graf Keluarga</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Menggambarkan struktur keluarga secara bertingkat sehingga pengguna dapat memahami hubungan nasab secara visual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-xl shadow-sm">
                📌
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ringkasan Mahram Nasab</h3>
                <p className="text-sm text-gray-500">Kelompok hubungan keluarga yang divisualisasikan.</p>
              </div>
            </div>

            <div className="space-y-4">
              {poinMahram.map((item, index) => {
                const icons = ['⬆️', '⬇️', '👥', '↔️'];
                const tones = [
                  'from-emerald-50 to-green-50 border-emerald-100 text-emerald-700',
                  'from-sky-50 to-blue-50 border-sky-100 text-sky-700',
                  'from-violet-50 to-purple-50 border-violet-100 text-violet-700',
                  'from-amber-50 to-yellow-50 border-amber-100 text-amber-700'
                ];
                return (
                  <div key={index} className={`rounded-2xl border bg-gradient-to-br ${tones[index] || tones[0]} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-xl shadow-sm shrink-0">
                        {icons[index] || '•'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.items.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm">
              ✅
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Fungsi dalam Aplikasi</h3>
              <p className="text-sm text-gray-500">Peran materi graf terhadap visualisasi waris.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catatan.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold mb-3">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 p-6 mb-8">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-200/40 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-indigo-200/30 rounded-full translate-y-12 -translate-x-12" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
              ℹ️
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2 text-lg">Batasan Materi Graf</h3>
              <p className="text-sm text-blue-800 leading-relaxed max-w-5xl">
                Halaman ini mencakup konsep dasar teori graf (simpul, sisi, jenis, dan representasi graf), lalu difokuskan
                pada pemodelan silsilah keluarga dan hubungan mahram dari nasab. Teori graf lanjutan seperti pewarnaan graf,
                lintasan Hamilton, lintasan Euler, dan optimasi tidak dibahas mendalam karena bukan fokus utama aplikasi
                visualisasi waris ini.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Materi disesuaikan untuk kebutuhan visualisasi graf keluarga pada aplikasi visualisasi graf waris.</p>
        </div>
      </div>
    </div>
  );
};

export default WarisAppLengkap;