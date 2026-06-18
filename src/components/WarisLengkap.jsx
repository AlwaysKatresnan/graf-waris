import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { BookOpen, Calculator, BookMarked, Network, GitBranch, Users, BookText } from 'lucide-react';


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

const MiniFamilyGraph = () => (
  <div className="hidden lg:block bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[280px]">
    <div className="text-white/90 text-sm font-semibold mb-3 flex items-center gap-2">
      <GitBranch size={18} /> Contoh visualisasi silsilah
    </div>
    <svg viewBox="0 0 260 150" className="w-full h-[150px]">
      <line x1="130" y1="35" x2="70" y2="90" stroke="rgba(255,255,255,.65)" strokeWidth="3" />
      <line x1="130" y1="35" x2="130" y2="90" stroke="rgba(255,255,255,.65)" strokeWidth="3" />
      <line x1="130" y1="35" x2="190" y2="90" stroke="rgba(255,255,255,.65)" strokeWidth="3" />
      <line x1="190" y1="90" x2="220" y2="130" stroke="rgba(255,255,255,.65)" strokeWidth="3" />
      {[
        [130,35,'Pewaris'], [70,90,'Ayah'], [130,90,'Istri'], [190,90,'Anak'], [220,130,'Cucu']
      ].map(([x,y,t]) => (
        <g key={t}>
          <circle cx={x} cy={y} r="18" fill="white" opacity="0.95" />
          <text x={x} y={y+35} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">{t}</text>
        </g>
      ))}
    </svg>
  </div>
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
  const [halamanAktif, setHalamanAktif] = useState('pembelajaran');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-7">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-emerald-50 text-sm font-semibold mb-4">
                  <Users size={17} /> Aplikasi pembelajaran, kalkulator, dan visualisasi keluarga
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Kalkulator Waris Islam dengan Visualisasi Graf
                </h1>
                <p className="text-emerald-50 text-base md:text-lg max-w-3xl leading-relaxed">
                  Dibuat dalam rangka penyusunan skripsi Muji Arofah.
                </p>
              </div>
              <MiniFamilyGraph />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <NavButton active={halamanAktif === 'pembelajaran'} onClick={() => setHalamanAktif('pembelajaran')} icon={BookOpen} label="Visualisasi" />
              <NavButton active={halamanAktif === 'kalkulator'} onClick={() => setHalamanAktif('kalkulator')} icon={Calculator} label="Kalkulator Waris" />
              <NavButton active={halamanAktif === 'materi'} onClick={() => setHalamanAktif('materi')} icon={BookMarked} label="Materi Waris" />
              <NavButton active={halamanAktif === 'materiGraf'} onClick={() => setHalamanAktif('materiGraf')} icon={Network} label="Materi Graf" />
            </div>
          </div>

          {halamanAktif === 'pembelajaran' && <HalamanPembelajaran />}
          {halamanAktif === 'kalkulator'  && <HalamanKalkulator />}
          {halamanAktif === 'materi'      && <HalamanMateri />}
          {halamanAktif === 'materiGraf'  && <HalamanMateriGraf />}
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Prototype Aplikasi Waris Islam v1.0 • Pembelajaran, Kalkulator, Materi Waris, dan Materi Graf</p>
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

const HalamanPembelajaran = () => {
  const [keluarga, setKeluarga] = useState({
    istri: false, suami: false, ayah: false, ibu: false,
    kakekDariAyah: false, nenekDariAyah: false, kakekDariIbu: false, nenekDariIbu: false,
    anakLaki: 0, anakPerempuan: 0,
    cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
    cucuLakiDariAnakPerempuan: 0, cucuPerempuanDariAnakPerempuan: 0,
    saudaraLakiKandung: 0, saudaraPerempuanKandung: 0,
    saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
    saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0,
  });

  const svgRef = useRef(null);

  const tentukanStatus = useCallback(() => {
    const status = [];
    const penjelasan = [];

    // ── kondisi dasar ──────────────────────────────────────────────────────────
    const adaAnakLaki        = keluarga.anakLaki > 0;
    const adaAnakPerempuan   = keluarga.anakPerempuan > 0;
    const adaAnak            = adaAnakLaki || adaAnakPerempuan;
    const ada2AnakPerempuan  = keluarga.anakPerempuan >= 2;
    const adaCucuLakiDariAL  = keluarga.cucuLakiDariAnakLaki > 0;
    // Cucu laki dari anak laki setara anak laki dalam hal hijab
    const pengganti_anakLaki = adaAnakLaki || adaCucuLakiDariAL;

    const adaSdrLakiKandung  = keluarga.saudaraLakiKandung > 0;

    status.push({ id: 'pewaris', nama: 'Pewaris', dapat: false, warna: '#3b82f6' });

    // ── PASANGAN (tidak terhijab siapapun) ─────────────────────────────────────
    if (keluarga.istri)  status.push({ id: 'istri',  nama: 'Istri',  dapat: true, warna: '#10b981' });
    if (keluarga.suami)  status.push({ id: 'suami',  nama: 'Suami',  dapat: true, warna: '#10b981' });

    // ── ORANG TUA (tidak terhijab siapapun) ────────────────────────────────────
    if (keluarga.ayah)   status.push({ id: 'ayah',   nama: 'Ayah',   dapat: true, warna: '#10b981' });
    if (keluarga.ibu)    status.push({ id: 'ibu',    nama: 'Ibu',    dapat: true, warna: '#10b981' });

    // ── KAKEK dari Ayah ────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah
    if (keluarga.kakekDariAyah) {
      const dapat = !keluarga.ayah;
      status.push({ id: 'kakek-ayah', nama: 'Kakek (Ayah)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Kakek (dari Ayah) terhijab oleh Ayah');
    }

    // ── NENEK dari Ayah ────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Ibu, Kakek dari Ayah
    if (keluarga.nenekDariAyah) {
      const dapat = !keluarga.ayah && !keluarga.ibu && !keluarga.kakekDariAyah;
      status.push({ id: 'nenek-ayah', nama: 'Nenek (Ayah)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Nenek (dari Ayah) terhijab oleh Ayah / Ibu / Kakek dari Ayah');
    }

    // ── NENEK dari Ibu ─────────────────────────────────────────────────────────
    // Terhijab oleh: Ibu
    if (keluarga.nenekDariIbu) {
      const dapat = !keluarga.ibu;
      status.push({ id: 'nenek-ibu', nama: 'Nenek (Ibu)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Nenek (dari Ibu) terhijab oleh Ibu');
    }

    // ── ANAK (tidak terhijab siapapun) ─────────────────────────────────────────
    for (let i = 0; i < keluarga.anakLaki; i++)
      status.push({ id: `anak-l-${i}`, nama: `Anak Laki ${i+1}`, dapat: true, warna: '#10b981' });
    for (let i = 0; i < keluarga.anakPerempuan; i++)
      status.push({ id: `anak-p-${i}`, nama: `Anak Perempuan ${i+1}`, dapat: true, warna: '#10b981' });

    // ── CUCU dari Anak Laki ────────────────────────────────────────────────────
    // Cucu laki: terhijab oleh Anak Laki
    // Cucu perempuan: terhijab oleh Anak Laki ATAU 2+ Anak Perempuan
    for (let i = 0; i < keluarga.cucuLakiDariAnakLaki; i++) {
      const dapat = !adaAnakLaki;
      status.push({ id: `cucu-l-al-${i}`, nama: `Cucu L (Anak L) ${i+1}`, dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat && i === 0) penjelasan.push('❌ Cucu Laki dari Anak Laki terhijab oleh Anak Laki');
    }
    for (let i = 0; i < keluarga.cucuPerempuanDariAnakLaki; i++) {
      const dapat = !adaAnakLaki && !ada2AnakPerempuan;
      status.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat && i === 0)
        penjelasan.push(adaAnakLaki
          ? '❌ Cucu Perempuan dari Anak Laki terhijab oleh Anak Laki'
          : '❌ Cucu Perempuan dari Anak Laki terhijab oleh 2+ Anak Perempuan');
    }

    // ── CUCU dari Anak Perempuan → selalu Dzawil Arham (tidak waris) ──────────
    for (let i = 0; i < keluarga.cucuLakiDariAnakPerempuan; i++) {
      status.push({ id: `cucu-l-ap-${i}`, nama: `Cucu L (Anak P) ${i+1}`, dapat: false, warna: '#9ca3af' });
      if (i === 0) penjelasan.push('❌ Cucu dari Anak Perempuan = Dzawil Arham, tidak mendapat waris');
    }
    for (let i = 0; i < keluarga.cucuPerempuanDariAnakPerempuan; i++) {
      status.push({ id: `cucu-p-ap-${i}`, nama: `Cucu P (Anak P) ${i+1}`, dapat: false, warna: '#9ca3af' });
    }

    // ── SAUDARA KANDUNG ────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Anak Laki, Cucu Laki dari Anak Laki
    const hijabSaudaraKandung = keluarga.ayah || pengganti_anakLaki;
    for (let i = 0; i < keluarga.saudaraLakiKandung; i++) {
      status.push({ id: `sdr-l-k-${i}`, nama: `Sdr L Kandung ${i+1}`, dapat: !hijabSaudaraKandung, warna: !hijabSaudaraKandung ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraKandung && i === 0)
        penjelasan.push('❌ Saudara Laki Kandung terhijab oleh Ayah / Anak Laki / Cucu Laki dari Anak Laki');
    }
    for (let i = 0; i < keluarga.saudaraPerempuanKandung; i++) {
      status.push({ id: `sdr-p-k-${i}`, nama: `Sdr P Kandung ${i+1}`, dapat: !hijabSaudaraKandung, warna: !hijabSaudaraKandung ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraKandung && i === 0)
        penjelasan.push('❌ Saudara Perempuan Kandung terhijab oleh Ayah / Anak Laki / Cucu Laki dari Anak Laki');
    }

    // ── SAUDARA SEAYAH ─────────────────────────────────────────────────────────
    // Terhijab oleh: semua penghalang saudara kandung + Saudara Laki Kandung
    const hijabSaudaraSeayah = hijabSaudaraKandung || adaSdrLakiKandung;
    for (let i = 0; i < keluarga.saudaraLakiSeayah; i++) {
      status.push({ id: `sdr-l-sa-${i}`, nama: `Sdr L Seayah ${i+1}`, dapat: !hijabSaudaraSeayah, warna: !hijabSaudaraSeayah ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraSeayah && i === 0)
        penjelasan.push('❌ Saudara Laki Seayah terhijab oleh Ayah / Anak Laki / Cucu Laki / Saudara Laki Kandung');
    }
    for (let i = 0; i < keluarga.saudaraPerempuanSeayah; i++) {
      // Saudara perempuan seayah juga terhijab oleh saudara laki kandung
      status.push({ id: `sdr-p-sa-${i}`, nama: `Sdr P Seayah ${i+1}`, dapat: !hijabSaudaraSeayah, warna: !hijabSaudaraSeayah ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraSeayah && i === 0)
        penjelasan.push('❌ Saudara Perempuan Seayah terhijab oleh Ayah / Anak Laki / Cucu Laki / Saudara Laki Kandung');
    }

    // ── SAUDARA SEIBU ──────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Ibu, semua Anak (laki maupun perempuan), Cucu Laki dari Anak Laki
    const hijabSaudaraSeibu = keluarga.ayah || keluarga.ibu || adaAnak || adaCucuLakiDariAL;
    for (let i = 0; i < keluarga.saudaraLakiSeibu; i++) {
      status.push({ id: `sdr-l-si-${i}`, nama: `Sdr L Seibu ${i+1}`, dapat: !hijabSaudaraSeibu, warna: !hijabSaudaraSeibu ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraSeibu && i === 0)
        penjelasan.push('❌ Saudara Laki Seibu terhijab oleh Ayah / Ibu / Anak / Cucu Laki dari Anak Laki');
    }
    for (let i = 0; i < keluarga.saudaraPerempuanSeibu; i++) {
      status.push({ id: `sdr-p-si-${i}`, nama: `Sdr P Seibu ${i+1}`, dapat: !hijabSaudaraSeibu, warna: !hijabSaudaraSeibu ? '#10b981' : '#9ca3af' });
      if (hijabSaudaraSeibu && i === 0)
        penjelasan.push('❌ Saudara Perempuan Seibu terhijab oleh Ayah / Ibu / Anak / Cucu Laki dari Anak Laki');
    }

    return { status, penjelasan };
  }, [keluarga]);

  useEffect(() => {
    if (!svgRef.current) return;
    const { status } = tentukanStatus();
    const anggota = status.filter(s => s.id !== 'pewaris');

    d3.select(svgRef.current).selectAll("*").remove();

    if (anggota.length === 0) {
      const svg = d3.select(svgRef.current).attr("width", 800).attr("height", 300);
      svg.append("text").attr("x", 400).attr("y", 150).attr("text-anchor", "middle")
        .attr("fill", "#9ca3af").attr("font-size", "16px").text("Pilih anggota keluarga untuk memulai");
      return;
    }

    // Bangun struktur pohon hierarki:
    // Level 0: Pewaris
    // Level 1: pasangan, orang tua, kakek/nenek, saudara (langsung ke pewaris)
    // Level 2: anak (anak dari pewaris)
    // Level 3: cucu (turunan dari anak)

    const grupLevel1 = ['istri','suami','ayah','ibu','kakek-ayah','nenek-ayah','nenek-ibu'];
    const isAnakLaki = id => id.startsWith('anak-l-');
    const isAnakPerempuan = id => id.startsWith('anak-p-');
    const isAnak = id => isAnakLaki(id) || isAnakPerempuan(id);
    const isCucuDariAnakLaki = id => id.startsWith('cucu-l-al-') || id.startsWith('cucu-p-al-');
    const isCucuDariAnakPerempuan = id => id.startsWith('cucu-l-ap-') || id.startsWith('cucu-p-ap-');
    const isSaudara = id => id.startsWith('sdr-');

    // Buat tree nodes dengan parentId
    const treeItems = [];
    anggota.forEach(a => {
      if (grupLevel1.includes(a.id) || isSaudara(a.id)) {
        treeItems.push({ ...a, parentId: 'pewaris', level: 1 });
      } else if (isAnak(a.id)) {
        treeItems.push({ ...a, parentId: 'pewaris', level: 1 });
      } else if (isCucuDariAnakLaki(a.id) || isCucuDariAnakPerempuan(a.id)) {
        // Hubungkan cucu ke induk anak pertama yang sesuai, atau pewaris jika tidak ada anak
        const anakInduk = anggota.find(x => isAnak(x.id));
        treeItems.push({ ...a, parentId: anakInduk ? anakInduk.id : 'pewaris', level: 2 });
      }
    });

    // Hitung posisi dengan layout pohon kiri-ke-kanan
    const nodeR = 36;
    const pewarisR = 45;
    const colGap = 220;
    const rowGap = 90;

    // Kelompokkan per parent
    const childrenOf = {};
    treeItems.forEach(item => {
      if (!childrenOf[item.parentId]) childrenOf[item.parentId] = [];
      childrenOf[item.parentId].push(item);
    });

    // Hitung tinggi total yang dibutuhkan
    const level1Count = (childrenOf['pewaris'] || []).length;
    const level2MaxCount = Math.max(0, ...Object.entries(childrenOf)
      .filter(([k]) => k !== 'pewaris')
      .map(([,v]) => v.length));
    const totalRows = Math.max(level1Count, level1Count + level2MaxCount);
    const svgHeight = Math.max(500, totalRows * rowGap + 150);
    const svgWidth = 800;
    const startX = 80;
    const startY = svgHeight / 2;

    const posMap = { pewaris: { x: startX, y: startY } };

    // Posisi anak level 1
    const l1Children = childrenOf['pewaris'] || [];
    l1Children.forEach((child, i) => {
      const totalH = (l1Children.length - 1) * rowGap;
      posMap[child.id] = {
        x: startX + colGap,
        y: startY - totalH / 2 + i * rowGap
      };
    });

    // Posisi cucu (level 2)
    l1Children.forEach(parent => {
      const children = childrenOf[parent.id] || [];
      if (children.length === 0) return;
      const parentPos = posMap[parent.id];
      children.forEach((child, i) => {
        const totalH = (children.length - 1) * rowGap;
        posMap[child.id] = {
          x: parentPos.x + colGap,
          y: parentPos.y - totalH / 2 + i * rowGap
        };
      });
    });

    const allNodes = [
      { ...status[0], r: pewarisR, ...posMap['pewaris'] },
      ...treeItems.map(item => ({ ...item, r: nodeR, ...posMap[item.id] }))
    ];

    const allLinks = treeItems.map(item => ({
      id: item.id,
      sourceId: item.parentId,
      color: item.warna
    }));

    const svg = d3.select(svgRef.current).attr("width", svgWidth).attr("height", svgHeight);

    // Gambar garis
    svg.append("g").selectAll("line").data(allLinks).enter().append("line")
      .attr("x1", d => posMap[d.sourceId]?.x || startX)
      .attr("y1", d => posMap[d.sourceId]?.y || startY)
      .attr("x2", d => posMap[d.sourceId]?.x || startX)
      .attr("y2", d => posMap[d.sourceId]?.y || startY)
      .attr("stroke", d => d.color).attr("stroke-width", 2).attr("opacity", 0)
      .transition().duration(600).delay((d, i) => i * 40)
      .attr("x2", d => posMap[d.id]?.x || startX)
      .attr("y2", d => posMap[d.id]?.y || startY)
      .attr("opacity", 0.7);

    // Gambar node
    const node = svg.append("g").selectAll("g").data(allNodes).enter().append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`).attr("opacity", 0);

    node.transition().duration(400).delay((d, i) => i * 40).attr("opacity", 1);

    node.append("circle").attr("r", 0).attr("fill", d => d.warna)
      .attr("stroke", "#fff").attr("stroke-width", 2)
      .transition().duration(400).delay((d, i) => i * 40).attr("r", d => d.r);

    node.append("text").attr("text-anchor", "middle").attr("dy", 4)
      .attr("fill", "#fff").attr("font-weight", "bold").attr("font-size", "10px")
      .attr("opacity", 0).text(d => d.nama)
      .transition().duration(300).delay((d, i) => i * 40 + 200).attr("opacity", 1);

  }, [keluarga, tentukanStatus]);

  const { penjelasan } = tentukanStatus();

  return (
    <div className="grid lg:grid-cols-2">
      <div className="bg-purple-50 p-6 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Visualisasi Silsilah Keluarga</h2>
        <div className="bg-white rounded p-3 mb-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Dapat Warisan</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-400"></div>Terhijab</div>
        </div>
        <div className="bg-white rounded p-4 mb-4">
          <svg ref={svgRef} style={{display:'block', margin:'0 auto'}} />
        </div>
        {penjelasan.length > 0 ? (
          <div className="bg-white rounded p-4">
            <h3 className="font-bold mb-2">Aturan Hijab:</h3>
            {penjelasan.map((p, i) => (
              <div key={i} className="bg-red-50 border-l-4 border-red-400 p-2 mb-2 text-sm text-red-800">{p}</div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-3 text-sm text-green-800">
            ✅ Semua yang dipilih mendapat warisan
          </div>
        )}
      </div>

      <div className="bg-indigo-50 p-6 overflow-y-auto" style={{maxHeight:'700px'}}>
        <h2 className="text-xl font-bold mb-4">Input Silsilah Keluarga</h2>
        
        <InputSection title="Pasangan">
          <Checkbox label="Istri" checked={keluarga.istri} onChange={e => setKeluarga({...keluarga, istri: e, suami: false})} />
          <Checkbox label="Suami" checked={keluarga.suami} onChange={e => setKeluarga({...keluarga, suami: e, istri: false})} />
        </InputSection>

        <InputSection title="Orang Tua">
          <Checkbox label="Ayah" checked={keluarga.ayah} onChange={e => setKeluarga({...keluarga, ayah: e})} />
          <Checkbox label="Ibu" checked={keluarga.ibu} onChange={e => setKeluarga({...keluarga, ibu: e})} />
        </InputSection>

        <InputSection title="Kakek & Nenek">
          <Checkbox label="Kakek (dari Ayah)" checked={keluarga.kakekDariAyah} onChange={e => setKeluarga({...keluarga, kakekDariAyah: e})} />
          <Checkbox label="Nenek (dari Ayah)" checked={keluarga.nenekDariAyah} onChange={e => setKeluarga({...keluarga, nenekDariAyah: e})} />
          <Checkbox label="Nenek (dari Ibu)" checked={keluarga.nenekDariIbu} onChange={e => setKeluarga({...keluarga, nenekDariIbu: e})} />
        </InputSection>

        <InputSection title="Anak">
          <NumberInput label="Anak Laki-laki" value={keluarga.anakLaki} onChange={v => setKeluarga({...keluarga, anakLaki: v})} />
          <NumberInput label="Anak Perempuan" value={keluarga.anakPerempuan} onChange={v => setKeluarga({...keluarga, anakPerempuan: v})} />
        </InputSection>

        <InputSection title="Cucu dari Anak Laki">
          <NumberInput label="Cucu Laki" value={keluarga.cucuLakiDariAnakLaki} onChange={v => setKeluarga({...keluarga, cucuLakiDariAnakLaki: v})} />
          <NumberInput label="Cucu Perempuan" value={keluarga.cucuPerempuanDariAnakLaki} onChange={v => setKeluarga({...keluarga, cucuPerempuanDariAnakLaki: v})} />
        </InputSection>

        <InputSection title="Cucu dari Anak Perempuan">
          <NumberInput label="Cucu Laki" value={keluarga.cucuLakiDariAnakPerempuan} onChange={v => setKeluarga({...keluarga, cucuLakiDariAnakPerempuan: v})} />
          <NumberInput label="Cucu Perempuan" value={keluarga.cucuPerempuanDariAnakPerempuan} onChange={v => setKeluarga({...keluarga, cucuPerempuanDariAnakPerempuan: v})} />
        </InputSection>

        <InputSection title="Saudara Kandung">
          <NumberInput label="Saudara Laki Kandung" value={keluarga.saudaraLakiKandung} onChange={v => setKeluarga({...keluarga, saudaraLakiKandung: v})} />
          <NumberInput label="Saudara Perempuan Kandung" value={keluarga.saudaraPerempuanKandung} onChange={v => setKeluarga({...keluarga, saudaraPerempuanKandung: v})} />
        </InputSection>

        <InputSection title="Saudara Seayah">
          <NumberInput label="Saudara Laki Seayah" value={keluarga.saudaraLakiSeayah} onChange={v => setKeluarga({...keluarga, saudaraLakiSeayah: v})} />
          <NumberInput label="Saudara Perempuan Seayah" value={keluarga.saudaraPerempuanSeayah} onChange={v => setKeluarga({...keluarga, saudaraPerempuanSeayah: v})} />
        </InputSection>

        <InputSection title="Saudara Seibu">
          <NumberInput label="Saudara Laki Seibu" value={keluarga.saudaraLakiSeibu} onChange={v => setKeluarga({...keluarga, saudaraLakiSeibu: v})} />
          <NumberInput label="Saudara Perempuan Seibu" value={keluarga.saudaraPerempuanSeibu} onChange={v => setKeluarga({...keluarga, saudaraPerempuanSeibu: v})} />
        </InputSection>
      </div>
    </div>
  );
};

const HalamanKalkulator = () => {
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

    // Hanya tampilkan di graf: pewaris + semua yang diinput (mendapat & terhijab)
    const tampil = semuaAhliWaris;

    if (tampil.length === 0) {
      const svg = d3.select(svgRef.current).attr("width", 800).attr("height", 300);
      svg.append("text").attr("x", 400).attr("y", 150).attr("text-anchor", "middle")
        .attr("fill", "#9ca3af").attr("font-size", "16px").text("Tambahkan ahli waris untuk melihat graf");
      return;
    }

    // ── Layout pohon kiri-ke-kanan (sama persis dengan HalamanPembelajaran) ────
    const WARNA_DAPAT   = '#10b981';
    const WARNA_HIJAB   = '#9ca3af';
    const WARNA_PEWARIS = '#3b82f6';

    const nodeR    = 36;
    const pewarisR = 45;
    const colGap   = 220;
    const rowGap   = 90;

    const isAnakLaki = id => id.startsWith('anak-laki-');
    const isAnakPr   = id => id.startsWith('anak-perempuan-');
    const isCucuDariAL = id => id.startsWith('cucu-l-al-') || id.startsWith('cucu-p-al-');
    const isCucuDariAP = id => id.startsWith('cucu-l-ap-') || id.startsWith('cucu-p-ap-');

    const treeItems = tampil.map(t => {
      if (isCucuDariAL(t.id)) {
        // Cucu dari Anak Laki → parent ke anak laki pertama
        const induk = tampil.find(x => isAnakLaki(x.id));
        return { ...t, parentId: induk ? induk.id : 'pewaris' };
      }
      if (isCucuDariAP(t.id)) {
        // Cucu dari Anak Perempuan → parent ke anak perempuan pertama
        const induk = tampil.find(x => isAnakPr(x.id));
        return { ...t, parentId: induk ? induk.id : 'pewaris' };
      }
      return { ...t, parentId: 'pewaris' };
    });

    const childrenOf = {};
    treeItems.forEach(item => {
      if (!childrenOf[item.parentId]) childrenOf[item.parentId] = [];
      childrenOf[item.parentId].push(item);
    });

    const l1 = childrenOf['pewaris'] || [];
    const svgWidth  = 800;
    const svgHeight = Math.max(500, l1.length * rowGap + 150);
    const startX = 80;
    const startY = svgHeight / 2;

    const posMap = { pewaris: { x: startX, y: startY } };
    l1.forEach((child, i) => {
      const totalH = (l1.length - 1) * rowGap;
      posMap[child.id] = { x: startX + colGap, y: startY - totalH / 2 + i * rowGap };
    });
    l1.forEach(parent => {
      const ch = childrenOf[parent.id] || [];
      ch.forEach((child, i) => {
        const totalH = (ch.length - 1) * rowGap;
        const pp = posMap[parent.id];
        posMap[child.id] = { x: pp.x + colGap, y: pp.y - totalH / 2 + i * rowGap };
      });
    });

    const allNodes = [
      { id: 'pewaris', nama: 'Pewaris', r: pewarisR, warna: WARNA_PEWARIS, mendapat: true, fraksi: '', bagian: harta, ...posMap['pewaris'] },
      ...treeItems.map(t => ({ ...t, r: nodeR, warna: t.mendapat ? WARNA_DAPAT : WARNA_HIJAB, ...posMap[t.id] }))
    ];
    const allLinks = treeItems.map(t => ({ id: t.id, parentId: t.parentId, mendapat: t.mendapat }));

    const svg = d3.select(svgRef.current).attr("width", svgWidth).attr("height", svgHeight);

    // ── Animasi sederhana: garis muncul fade-in dengan delay per item ──────────
    svg.append("g").selectAll("line").data(allLinks).enter().append("line")
      .attr("x1", d => posMap[d.parentId]?.x || startX)
      .attr("y1", d => posMap[d.parentId]?.y || startY)
      .attr("x2", d => posMap[d.parentId]?.x || startX)
      .attr("y2", d => posMap[d.parentId]?.y || startY)
      .attr("stroke", d => d.mendapat ? WARNA_DAPAT : WARNA_HIJAB)
      .attr("stroke-width", 2).attr("opacity", 0)
      .attr("stroke-dasharray", d => d.mendapat ? 'none' : '5,4')
      .transition().duration(500).delay((d, i) => i * 40)
      .attr("x2", d => posMap[d.id]?.x || startX)
      .attr("y2", d => posMap[d.id]?.y || startY)
      .attr("opacity", 0.7);

    // ── Node muncul dengan scale-up sederhana ─────────────────────────────────
    const nodeG = svg.append("g").selectAll("g").data(allNodes).enter().append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`).attr("opacity", 0);

    nodeG.transition().duration(400).delay((d, i) => i * 40).attr("opacity", 1);

    nodeG.append("circle")
      .attr("r", 0)
      .attr("fill", d => d.warna)
      .attr("stroke", "#fff").attr("stroke-width", 2)
      .transition().duration(400).delay((d, i) => i * 40)
      .attr("r", d => d.r);

    // ── Label teks muncul setelah circle ──────────────────────────────────────
    nodeG.each(function(d) {
      const g = d3.select(this);
      const words = d.nama.split(' ');
      let lines = [], cur = '';
      words.forEach(w => {
        const test = cur + (cur ? ' ' : '') + w;
        if (test.length > 12 && cur) { lines.push(cur); cur = w; } else { cur = test; }
      });
      if (cur) lines.push(cur);

      const isPewaris = d.id === 'pewaris';
      const lineH  = 13;
      const totalH = lines.length * lineH + (isPewaris ? lineH : (d.fraksi ? lineH : 0));
      const startDy = -(totalH / 2) + lineH / 2;

      lines.forEach((line, i) => {
        g.append("text").attr("text-anchor", "middle").attr("dy", startDy + i * lineH)
          .attr("fill", "#fff").attr("font-weight", "bold")
          .attr("font-size", isPewaris ? "12px" : "11px")
          .attr("opacity", 0).style("pointer-events", "none").text(line)
          .transition().duration(300).delay((_, idx) => idx * 40 + 250).attr("opacity", 1);
      });

      if (!isPewaris && d.fraksi) {
        g.append("text").attr("text-anchor", "middle").attr("dy", startDy + lines.length * lineH)
          .attr("fill", "#fff").attr("font-weight", "bold").attr("font-size", "13px")
          .attr("opacity", 0).style("pointer-events", "none").text(d.fraksi)
          .transition().duration(300).delay(300).attr("opacity", 1);
      }
      if (isPewaris) {
        g.append("text").attr("text-anchor", "middle").attr("dy", startDy + lines.length * lineH)
          .attr("fill", "#fff").attr("font-size", "10px")
          .attr("opacity", 0).style("pointer-events", "none").text("(Almarhum)")
          .transition().duration(300).delay(200).attr("opacity", 1);
      }
    });

  }, [semuaAhliWaris, harta]);

  return (
    <div className="grid lg:grid-cols-2">
      {/* ── KIRI: Graf + Detail ─────────────────────────────────────────────── */}
      <div className="bg-red-50 p-6 border-r border-gray-200 overflow-y-auto" style={{maxHeight:'900px'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Hasil Pembagian Waris</h2>
          <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">HASIL GRAF</div>
        </div>

        {/* Total harta */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="text-xs text-gray-500 mb-1">Total Harta Warisan</div>
          <div className="text-2xl font-bold text-emerald-600">{formatRupiah(harta)}</div>
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-lg px-4 py-2 mb-4 flex gap-5 text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Mendapat Warisan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Terhijab</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 border-t-2 border-dashed border-gray-400"></div>
            <span>Terhalang</span>
          </div>
        </div>

        {/* Graf */}
        <div className="bg-white rounded-xl shadow-sm mb-4 overflow-x-auto">
          <svg ref={svgRef} style={{ display: 'block' }} />
        </div>

        {/* Detail Pembagian — tampilkan SEMUA termasuk terhijab */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800 mb-2">Detail Pembagian</h3>

          {semuaAhliWaris.length === 0 && (
            <div className="text-sm text-gray-400 italic">Belum ada ahli waris yang dipilih.</div>
          )}

          {semuaAhliWaris.map((ahli) => (
            <div key={ahli.id}
              className={`bg-white rounded-lg p-3 shadow-sm border ${ahli.mendapat ? 'border-emerald-100' : 'border-gray-100 opacity-70'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${ahli.mendapat ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <span className={`font-semibold text-sm ${ahli.mendapat ? 'text-gray-800' : 'text-gray-400'}`}>
                      {ahli.nama}
                    </span>
                    {ahli.terhijabOleh && (
                      <div className="text-xs text-red-400 mt-0.5">⛔ {ahli.terhijabOleh}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {ahli.mendapat ? (
                    <>
                      <div className="font-bold text-emerald-600 text-sm">{formatRupiah(ahli.bagian)}</div>
                      <div className="text-xs text-gray-400">{ahli.fraksi} · {ahli.persentase.toFixed(1)}%</div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-400 font-medium">Rp 0 · Terhijab</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── KANAN: Input ────────────────────────────────────────────────────── */}
      <div className="bg-blue-50 p-6 overflow-y-auto" style={{maxHeight:'900px'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Input Data Ahli Waris</h2>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">INPUT DATA</div>
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

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-sm text-yellow-800"><strong>Catatan:</strong> Ini adalah kalkulasi sederhana. Untuk kasus kompleks, konsultasikan dengan ahli waris Islam.</p>
        </div>
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
            Ringkasan materi fikih mawaris untuk mendukung tab pembelajaran dan kalkulator waris.
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
                Dalam aplikasi ini, materi digunakan sebagai pendamping visualisasi graf dan kalkulator.
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
  const materiGraf = [
    {
      icon: '🕸️',
      title: 'Pengertian Graf',
      body: 'Graf adalah model matematika untuk merepresentasikan objek-objek diskrit beserta hubungan di antara objek tersebut. Dalam aplikasi waris, objek dapat berupa pewaris dan ahli waris, sedangkan hubungan dapat berupa garis kekerabatan atau hubungan keluarga.',
      points: [
        'Graf dinotasikan sebagai G = (V, E).',
        'V adalah himpunan simpul atau vertex, misalnya pewaris, ayah, ibu, anak, cucu, saudara, dan pasangan.',
        'E adalah himpunan sisi atau edge yang menghubungkan sepasang simpul, misalnya hubungan pewaris dengan anak atau anak dengan cucu.',
        'Pada visualisasi waris, graf membantu pengguna melihat susunan keluarga secara lebih mudah daripada hanya membaca tabel.'
      ]
    },
    {
      icon: '⚫',
      title: 'Simpul dan Sisi',
      body: 'Dua unsur utama graf adalah simpul dan sisi. Simpul menunjukkan entitas, sedangkan sisi menunjukkan adanya hubungan langsung antara dua entitas.',
      points: [
        'Simpul atau vertex: titik yang mewakili anggota keluarga.',
        'Sisi atau edge: garis yang menghubungkan dua anggota keluarga.',
        'Contoh: simpul “Pewaris” dihubungkan dengan simpul “Anak Laki-laki” melalui satu sisi.',
        'Jika sebuah simpul tidak memiliki hubungan dengan simpul lain, simpul tersebut disebut simpul terpencil.'
      ]
    },
    {
      icon: '🔁',
      title: 'Jenis Graf yang Relevan',
      body: 'Dalam teori graf terdapat beberapa jenis graf, tetapi tidak semuanya diperlukan untuk aplikasi kalkulator waris. Aplikasi ini cukup menggunakan konsep graf sederhana dan graf tak berarah untuk menyusun hubungan keluarga.',
      points: [
        'Graf sederhana adalah graf yang tidak memiliki gelang atau sisi ganda.',
        'Graf tak berarah adalah graf yang sisinya tidak memiliki orientasi arah tertentu.',
        'Graf berarah memiliki arah pada sisi, tetapi pada visualisasi dasar keluarga biasanya arah tidak wajib ditampilkan.',
        'Silsilah keluarga lebih mudah dipahami jika divisualisasikan sebagai struktur bertingkat seperti pohon.'
      ]
    },
    {
      icon: '📌',
      title: 'Ketetanggaan dan Bersisian',
      body: 'Ketetanggaan dan bersisian digunakan untuk menjelaskan hubungan langsung antar simpul dan sisi dalam graf.',
      points: [
        'Dua simpul disebut bertetangga apabila keduanya terhubung langsung oleh satu sisi.',
        'Sisi disebut bersisian dengan simpul apabila sisi tersebut menempel atau menghubungkan simpul tersebut.',
        'Contoh: Pewaris bertetangga dengan anak apabila terdapat garis langsung antara pewaris dan anak.',
        'Konsep ini membantu aplikasi menentukan siapa yang tampil dekat dengan pewaris pada visualisasi.'
      ]
    },
    {
      icon: '🔢',
      title: 'Derajat Simpul',
      body: 'Derajat simpul adalah jumlah sisi yang bersisian dengan suatu simpul. Dalam konteks silsilah keluarga, derajat dapat dipahami sebagai jumlah hubungan langsung yang dimiliki oleh satu anggota keluarga pada tampilan graf.',
      points: [
        'Jika pewaris terhubung dengan ayah, ibu, istri, dan dua anak, maka simpul pewaris memiliki beberapa hubungan langsung.',
        'Derajat yang lebih tinggi menunjukkan simpul tersebut memiliki lebih banyak relasi langsung pada graf.',
        'Dalam graf keluarga, pewaris biasanya menjadi simpul pusat karena terhubung dengan banyak ahli waris.',
        'Derajat tidak menentukan bagian waris, tetapi membantu memahami kepadatan hubungan dalam visualisasi.'
      ]
    },
    {
      icon: '🛤️',
      title: 'Lintasan dan Keterhubungan',
      body: 'Lintasan adalah urutan simpul dan sisi yang menghubungkan simpul awal menuju simpul tujuan. Dua simpul disebut terhubung apabila terdapat lintasan di antara keduanya.',
      points: [
        'Contoh lintasan: Pewaris → Anak Laki-laki → Cucu Laki-laki.',
        'Panjang lintasan dihitung dari jumlah sisi yang dilewati.',
        'Keterhubungan menunjukkan bahwa setiap anggota keluarga dalam tampilan masih berada dalam satu jaringan keluarga.',
        'Dalam aplikasi waris, lintasan membantu menjelaskan hubungan generasi seperti anak, cucu, dan kakek/nenek.'
      ]
    }
  ];

  const contohPemetaan = [
    { konsep: 'Simpul (V)', penerapan: 'Pewaris, suami/istri, ayah, ibu, anak, cucu, saudara, kakek, dan nenek.' },
    { konsep: 'Sisi (E)', penerapan: 'Hubungan langsung antaranggota keluarga, misalnya pewaris–anak atau anak–cucu.' },
    { konsep: 'Graf sederhana', penerapan: 'Tidak ada dua garis ganda untuk hubungan yang sama dan tidak ada garis yang kembali ke simpul itu sendiri.' },
    { konsep: 'Graf tak berarah', penerapan: 'Hubungan keluarga divisualisasikan tanpa panah agar mudah dibaca pengguna.' },
    { konsep: 'Graf pohon', penerapan: 'Susunan bertingkat dari pewaris ke anak hingga cucu sebagai gambaran silsilah.' }
  ];

  const langkahVisualisasi = [
    'Data ahli waris dimasukkan melalui form kalkulator atau pembelajaran.',
    'Setiap anggota keluarga diubah menjadi simpul graf.',
    'Hubungan keluarga diubah menjadi sisi graf.',
    'Simpul pewaris diletakkan sebagai pusat atau akar visualisasi.',
    'Anak, orang tua, pasangan, saudara, dan cucu ditempatkan sesuai tingkat hubungan keluarga.',
    'Warna simpul dapat digunakan untuk membedakan ahli waris yang mendapat bagian dan yang terhijab.'
  ];

  const SectionCard = ({ item }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">{item.icon}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-4">{item.body}</p>
          <ul className="space-y-2">
            {item.points.map((point, index) => (
              <li key={index} className="flex gap-2 text-[15px] text-gray-700 leading-relaxed">
                <span className="text-teal-600 font-bold">•</span>
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <span className="text-3xl">🕸️</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Materi Teori Graf</h2>
          <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
            Ringkasan teori graf yang digunakan sebagai dasar visualisasi hubungan keluarga pada aplikasi kalkulator waris.
            Materi dibatasi sampai kebutuhan pemodelan silsilah keluarga.
          </p>
        </div>

        <TopicIndex
          title="Daftar submateri graf"
          tone="teal"
          items={[
            'Pengertian graf',
            'Simpul dan sisi',
            'Jenis graf yang relevan',
            'Ketetanggaan dan bersisian',
            'Derajat simpul',
            'Lintasan dan keterhubungan',
            'Pemetaan ke aplikasi waris',
            'Silsilah keluarga sebagai graf'
          ]}
        />

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-teal-800 mb-1">Hubungan Teori Graf dengan Aplikasi Waris</h3>
              <p className="text-sm text-teal-700 leading-relaxed">
                Kalkulator waris tidak hanya menghitung bagian ahli waris, tetapi juga menampilkan relasi keluarga dalam bentuk graf.
                Dengan demikian, pengguna dapat memahami posisi pewaris, ahli waris, dan hubungan kekerabatan secara visual.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {materiGraf.map((item, index) => <SectionCard key={index} item={item} />)}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🧬</span> Pemetaan Graf ke Silsilah Keluarga
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="text-left p-3 rounded-l-lg w-48">Konsep Graf</th>
                  <th className="text-left p-3 rounded-r-lg">Penerapan pada Aplikasi Waris</th>
                </tr>
              </thead>
              <tbody>
                {contohPemetaan.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-teal-50">
                    <td className="p-3 font-bold text-teal-700">{item.konsep}</td>
                    <td className="p-3 text-gray-700 leading-relaxed">{item.penerapan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🌳</span> Graf Pohon untuk Silsilah Keluarga
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Silsilah keluarga dapat dipahami sebagai graf berbentuk pohon karena hubungan ditampilkan secara bertingkat.
              Pada aplikasi ini, pewaris dapat diposisikan sebagai simpul utama, kemudian ahli waris lain diletakkan berdasarkan kedekatan hubungan.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
              <p className="font-bold text-gray-800 mb-2">Contoh struktur:</p>
              <p>Pewaris → Anak → Cucu</p>
              <p>Pewaris → Ayah/Ibu</p>
              <p>Pewaris → Suami/Istri</p>
              <p>Pewaris → Saudara</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🪜</span> Alur Visualisasi Graf Waris
            </h3>
            <ol className="space-y-3">
              {langkahVisualisasi.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-blue-800 mb-1">Batasan Materi Graf</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Materi graf pada halaman ini hanya difokuskan pada konsep yang mendukung visualisasi silsilah keluarga:
                graf, simpul, sisi, jenis graf sederhana, graf tak berarah, ketetanggaan, derajat, lintasan, keterhubungan,
                dan graf pohon. Materi lanjutan seperti pewarnaan graf, graf Hamilton, graf Euler, dan optimasi lintasan tidak dibahas karena tidak menjadi kebutuhan utama aplikasi.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Sumber ringkasan: Rinaldi Munir, Graf, Bahan Kuliah IF2120 Matematika Diskrit, disesuaikan dengan kebutuhan prototype aplikasi.</p>
        </div>
      </div>
    </div>
  );
};

export default WarisAppLengkap;