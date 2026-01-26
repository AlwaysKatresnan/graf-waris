import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { BookOpen, Calculator } from 'lucide-react';

const WarisAppLengkap = () => {
  const [halamanAktif, setHalamanAktif] = useState('pembelajaran');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header dengan Tab */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Visualisasi Pembagian Waris Islam dengan Output Graf</h1>
            <p className="text-emerald-100 mb-6">Dibuat dalam rangka penyusunan skripsi Muji Arofah</p>
            
            {/* Tab Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => setHalamanAktif('pembelajaran')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  halamanAktif === 'pembelajaran'
                    ? 'bg-white text-emerald-600 shadow-lg'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                <BookOpen size={20} />
                Pembelajaran
              </button>
              <button
                onClick={() => setHalamanAktif('kalkulator')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  halamanAktif === 'kalkulator'
                    ? 'bg-white text-emerald-600 shadow-lg'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                <Calculator size={20} />
                Kalkulator Waris
              </button>
            </div>
          </div>

          {/* Konten Halaman */}
          {halamanAktif === 'pembelajaran' ? <HalamanPembelajaran /> : <HalamanKalkulator />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Prototype Aplikasi Waris Islam v1.0 - Dibuat untuk Skripsi Muji Arofah</p>
        </div>
      </div>
    </div>
  );
};

// Helper Components
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

// ============= HALAMAN PEMBELAJARAN =============
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

    status.push({ id: 'pewaris', nama: 'Pewaris', dapat: false, warna: '#3b82f6' });

    if (keluarga.istri) status.push({ id: 'istri', nama: 'Istri', dapat: true, warna: '#10b981' });
    if (keluarga.suami) status.push({ id: 'suami', nama: 'Suami', dapat: true, warna: '#10b981' });
    if (keluarga.ayah) status.push({ id: 'ayah', nama: 'Ayah', dapat: true, warna: '#10b981' });
    if (keluarga.ibu) status.push({ id: 'ibu', nama: 'Ibu', dapat: true, warna: '#10b981' });

    if (keluarga.kakekDariAyah) {
      const dapat = !keluarga.ayah;
      status.push({ id: 'kakek-ayah', nama: 'Kakek (Ayah)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Kakek (dari Ayah) terhijab karena Ayah masih hidup');
    }

    if (keluarga.nenekDariAyah) {
      const dapat = !keluarga.ayah && !keluarga.ibu;
      status.push({ id: 'nenek-ayah', nama: 'Nenek (Ayah)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Nenek (dari Ayah) terhijab karena Ayah/Ibu masih hidup');
    }

    if (keluarga.nenekDariIbu) {
      const dapat = !keluarga.ibu;
      status.push({ id: 'nenek-ibu', nama: 'Nenek (Ibu)', dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat) penjelasan.push('❌ Nenek (dari Ibu) terhijab karena Ibu masih hidup');
    }

    for (let i = 0; i < keluarga.anakLaki; i++) {
      status.push({ id: `anak-l-${i}`, nama: `Anak Laki ${i + 1}`, dapat: true, warna: '#10b981' });
    }
    for (let i = 0; i < keluarga.anakPerempuan; i++) {
      status.push({ id: `anak-p-${i}`, nama: `Anak Perempuan ${i + 1}`, dapat: true, warna: '#10b981' });
    }

    const adaAnakLaki = keluarga.anakLaki > 0;
    const ada2AnakPerempuan = keluarga.anakPerempuan >= 2;
    
    for (let i = 0; i < keluarga.cucuLakiDariAnakLaki; i++) {
      const dapat = !adaAnakLaki && !ada2AnakPerempuan;
      status.push({ id: `cucu-l-al-${i}`, nama: `Cucu L (Anak L) ${i + 1}`, dapat, warna: dapat ? '#10b981' : '#9ca3af' });
      if (!dapat && i === 0) {
        penjelasan.push(adaAnakLaki ? '❌ Cucu dari anak laki terhijab karena ada Anak Laki' : '❌ Cucu dari anak laki terhijab karena ada 2+ Anak Perempuan');
      }
    }

    for (let i = 0; i < keluarga.cucuPerempuanDariAnakLaki; i++) {
      const dapat = !adaAnakLaki && !ada2AnakPerempuan;
      status.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i + 1}`, dapat, warna: dapat ? '#10b981' : '#9ca3af' });
    }

    for (let i = 0; i < keluarga.cucuLakiDariAnakPerempuan; i++) {
      status.push({ id: `cucu-l-ap-${i}`, nama: `Cucu L (Anak P) ${i + 1}`, dapat: false, warna: '#9ca3af' });
      if (i === 0) penjelasan.push('❌ Cucu dari anak perempuan TIDAK dapat warisan');
    }

    for (let i = 0; i < keluarga.cucuPerempuanDariAnakPerempuan; i++) {
      status.push({ id: `cucu-p-ap-${i}`, nama: `Cucu P (Anak P) ${i + 1}`, dapat: false, warna: '#9ca3af' });
    }

    const cucuLakiAnakLaki = keluarga.cucuLakiDariAnakLaki > 0;
    const saudaraHijab = keluarga.ayah || adaAnakLaki || cucuLakiAnakLaki;

    for (let i = 0; i < keluarga.saudaraLakiKandung; i++) {
      status.push({ id: `sdr-l-k-${i}`, nama: `Sdr L Kandung ${i + 1}`, dapat: !saudaraHijab, warna: !saudaraHijab ? '#10b981' : '#9ca3af' });
      if (saudaraHijab && i === 0) penjelasan.push('❌ Saudara kandung terhijab karena ada Ayah/Anak Laki/Cucu Laki');
    }

    for (let i = 0; i < keluarga.saudaraPerempuanKandung; i++) {
      status.push({ id: `sdr-p-k-${i}`, nama: `Sdr P Kandung ${i + 1}`, dapat: !saudaraHijab, warna: !saudaraHijab ? '#10b981' : '#9ca3af' });
    }

    const seibuHijab = keluarga.ayah || keluarga.ibu || adaAnakLaki || keluarga.anakPerempuan > 0 || cucuLakiAnakLaki;
    
    for (let i = 0; i < keluarga.saudaraLakiSeibu; i++) {
      status.push({ id: `sdr-l-si-${i}`, nama: `Sdr L Seibu ${i + 1}`, dapat: !seibuHijab, warna: !seibuHijab ? '#10b981' : '#9ca3af' });
      if (seibuHijab && i === 0) penjelasan.push('❌ Saudara seibu terhijab karena ada Ayah/Ibu/Anak');
    }

    for (let i = 0; i < keluarga.saudaraPerempuanSeibu; i++) {
      status.push({ id: `sdr-p-si-${i}`, nama: `Sdr P Seibu ${i + 1}`, dapat: !seibuHijab, warna: !seibuHijab ? '#10b981' : '#9ca3af' });
    }

    return { status, penjelasan };
  }, [keluarga]);

  useEffect(() => {
    if (!svgRef.current) return;
    const { status } = tentukanStatus();
    const width = 800;
    const anggota = status.filter(s => s.id !== 'pewaris');
    
    // Hitung tinggi dinamis berdasarkan jumlah anggota
    const gap = 110;
    const minHeight = 600;
    const height = Math.max(minHeight, anggota.length * gap + 150);
    
    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    
    if (anggota.length === 0) {
      svg.append("text").attr("x", width/2).attr("y", height/2).attr("text-anchor", "middle")
        .attr("fill", "#9ca3af").attr("font-size", "16px").text("Pilih anggota keluarga untuk memulai");
      return;
    }

    const cx = width/8, cy = height/2;
    const nodes = [{ id: 'pewaris', x: cx, y: cy, r: 45, ...status[0] }];
    const links = [];

    anggota.forEach((a, i) => {
      const startY = cy - ((anggota.length - 1) * gap) / 2;

      nodes.push({
        ...a,
        x: cx + 220,
        y: startY + i * gap,
        r: 36
      });

      links.push({
        source: 'pewaris',
        target: a.id,
        color: a.warna
      });
    });

    // Animasi garis dengan delay
    svg.append("g").selectAll("line").data(links).enter().append("line")
      .attr("x1", cx).attr("y1", cy)
      .attr("x2", cx).attr("y2", cy)
      .attr("stroke", d => d.color).attr("stroke-width", 2).attr("opacity", 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .attr("x2", d => nodes.find(n => n.id === d.target)?.x || cx)
      .attr("y2", d => nodes.find(n => n.id === d.target)?.y || cy)
      .attr("opacity", 0.6);

    const node = svg.append("g").selectAll("g").data(nodes).enter().append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("opacity", 0);

    // Animasi fade in untuk node
    node.transition()
      .duration(400)
      .delay((d, i) => i * 50)
      .attr("opacity", 1);

    // Circle dengan animasi scale
    node.append("circle")
      .attr("r", 0)
      .attr("fill", d => d.warna)
      .attr("stroke", "#fff").attr("stroke-width", 2)
      .transition()
      .duration(400)
      .delay((d, i) => i * 50)
      .attr("r", d => d.r);

    node.append("text").attr("text-anchor", "middle").attr("dy", 4)
      .attr("fill", "#fff").attr("font-weight", "bold").attr("font-size", "10px")
      .attr("opacity", 0)
      .text(d => d.nama)
      .transition()
      .duration(300)
      .delay((d, i) => i * 50 + 200)
      .attr("opacity", 1);

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

        <InputSection title="Saudara Seibu">
          <NumberInput label="Saudara Laki Seibu" value={keluarga.saudaraLakiSeibu} onChange={v => setKeluarga({...keluarga, saudaraLakiSeibu: v})} />
          <NumberInput label="Saudara Perempuan Seibu" value={keluarga.saudaraPerempuanSeibu} onChange={v => setKeluarga({...keluarga, saudaraPerempuanSeibu: v})} />
        </InputSection>
      </div>
    </div>
  );
};

// ============= HALAMAN KALKULATOR =============
const HalamanKalkulator = () => {
  const [harta, setHarta] = useState(100000000);
  const [ahliWaris, setAhliWaris] = useState({
    istri: false,
    suami: false,
    anakLaki: 0,
    anakPerempuan: 0,
    ayah: false,
    ibu: false,
    kakek: false,
    nenek: false,
  });

  const formatRupiah = useCallback((angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }, []);

  // Perhitungan bagian waris (simplified version)
  const hitungWaris = useMemo(() => {
    const hasil = [];
    let sisaHarta = harta;
    
    // Mayit
    hasil.push({
      nama: 'Mayit (Pewaris)',
      bagian: 0,
      persentase: 0,
      warna: '#64748b',
      fraksi: '',
      id: 'pewaris'
    });

    // Pasangan (Istri/Suami) - dapat bagian tetap dulu
    if (ahliWaris.istri) {
      const adaAnak = ahliWaris.anakLaki > 0 || ahliWaris.anakPerempuan > 0;
      const bagianIstri = adaAnak ? harta * (1/8) : harta * (1/4);
      hasil.push({
        nama: 'Istri',
        bagian: bagianIstri,
        persentase: adaAnak ? 12.5 : 25,
        warna: '#ec4899',
        fraksi: adaAnak ? '1/8' : '1/4',
        id: 'istri'
      });
      sisaHarta -= bagianIstri;
    }

    if (ahliWaris.suami) {
      const adaAnak = ahliWaris.anakLaki > 0 || ahliWaris.anakPerempuan > 0;
      const bagianSuami = adaAnak ? harta * (1/4) : harta * (1/2);
      hasil.push({
        nama: 'Suami',
        bagian: bagianSuami,
        persentase: adaAnak ? 25 : 50,
        warna: '#3b82f6',
        fraksi: adaAnak ? '1/4' : '1/2',
        id: 'suami'
      });
      sisaHarta -= bagianSuami;
    }

    // Orang tua
    if (ahliWaris.ayah) {
      const adaAnak = ahliWaris.anakLaki > 0 || ahliWaris.anakPerempuan > 0;
      const bagianAyah = adaAnak ? harta * (1/6) : sisaHarta * 0.3;
      hasil.push({
        nama: 'Ayah',
        bagian: bagianAyah,
        persentase: (bagianAyah / harta) * 100,
        warna: '#8b5cf6',
        fraksi: adaAnak ? '1/6' : 'Ashabah',
        id: 'ayah'
      });
      sisaHarta -= bagianAyah;
    }

    if (ahliWaris.ibu) {
      const adaAnak = ahliWaris.anakLaki > 0 || ahliWaris.anakPerempuan > 0;
      const adaSaudara = false; // simplified
      const bagianIbu = (adaAnak || adaSaudara) ? harta * (1/6) : harta * (1/3);
      hasil.push({
        nama: 'Ibu',
        bagian: bagianIbu,
        persentase: (bagianIbu / harta) * 100,
        warna: '#f59e0b',
        fraksi: (adaAnak || adaSaudara) ? '1/6' : '1/3',
        id: 'ibu'
      });
      sisaHarta -= bagianIbu;
    }

    // Anak-anak (sistem ashabah - sisa harta) - DIPISAH PER INDIVIDU
    const totalAnak = ahliWaris.anakLaki + ahliWaris.anakPerempuan;
    if (totalAnak > 0) {
      // Anak laki-laki dapat 2x anak perempuan
      const totalBagian = (ahliWaris.anakLaki * 2) + ahliWaris.anakPerempuan;
      
      // Tambahkan setiap anak laki-laki secara terpisah
      if (ahliWaris.anakLaki > 0) {
        const bagianPerAnakLaki = (sisaHarta * 2) / totalBagian;
        const warnaBiru = ['#10b981', '#059669', '#047857', '#065f46'];
        
        for (let i = 0; i < ahliWaris.anakLaki; i++) {
          hasil.push({
            nama: `Anak Laki-laki ${i + 1}`,
            bagian: bagianPerAnakLaki,
            persentase: (bagianPerAnakLaki / harta) * 100,
            warna: warnaBiru[i % warnaBiru.length],
            fraksi: '2/n',
            id: `anak-laki-${i}`
          });
        }
      }

      // Tambahkan setiap anak perempuan secara terpisah
      if (ahliWaris.anakPerempuan > 0) {
        const bagianPerAnakPerempuan = sisaHarta / totalBagian;
        const warnaPink = ['#06b6d4', '#0891b2', '#0e7490', '#155e75'];
        
        for (let i = 0; i < ahliWaris.anakPerempuan; i++) {
          hasil.push({
            nama: `Anak Perempuan ${i + 1}`,
            bagian: bagianPerAnakPerempuan,
            persentase: (bagianPerAnakPerempuan / harta) * 100,
            warna: warnaPink[i % warnaPink.length],
            fraksi: '1/n',
            id: `anak-perempuan-${i}`
          });
        }
      }
    }

    // Kakek & Nenek (simplified - dapat 1/6 jika tidak ada ayah/ibu)
    if (ahliWaris.kakek && !ahliWaris.ayah) {
      const bagianKakek = harta * (1/6);
      hasil.push({
        nama: 'Kakek',
        bagian: bagianKakek,
        persentase: (bagianKakek / harta) * 100,
        warna: '#6366f1',
        fraksi: '1/6',
        id: 'kakek'
      });
    }

    if (ahliWaris.nenek && !ahliWaris.ibu) {
      const bagianNenek = harta * (1/6);
      hasil.push({
        nama: 'Nenek',
        bagian: bagianNenek,
        persentase: (bagianNenek / harta) * 100,
        warna: '#f97316',
        fraksi: '1/6',
        id: 'nenek'
      });
    }

    return hasil;
  }, [harta, ahliWaris]);

  const svgRef = useRef(null);

  // Draw Network Graph with D3.js
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 800;
    const centerX = 200; // Geser dari kiri
    const centerY = 400; // Center vertikal di tengah canvas

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Filter ahli waris yang mendapat bagian
    const ahliWarisAktif = hitungWaris.filter(h => h.bagian > 0 && h.id !== 'pewaris');
    const jumlahAhli = ahliWarisAktif.length;

    // Create data structure for D3
    const nodes = [
      { id: 'pewaris', x: centerX, y: centerY, radius: 60, ...hitungWaris[0] }
    ];

    const links = [];

    ahliWarisAktif.forEach((ahli, idx) => {
      // Distribusi setengah lingkaran ke kanan (dari atas sampai bawah)
      const angle = (Math.PI / (jumlahAhli + 1)) * (idx + 1) - Math.PI / 2;
      
      // Panjang garis berdasarkan persentase (min 180px, max 350px)
      const minDistance = 180;
      const maxDistance = 350;
      const lineLength = minDistance + (ahli.persentase / 100) * (maxDistance - minDistance);
      
      const x = centerX + Math.cos(angle) * lineLength;
      const y = centerY + Math.sin(angle) * lineLength;
      const nodeRadius = 45 + (ahli.persentase / 100) * 35;

      nodes.push({
        ...ahli,
        x,
        y,
        radius: nodeRadius
      });

      links.push({
        source: 'pewaris',
        target: ahli.id,
        width: 2 + (ahli.persentase / 100) * 4,
        color: ahli.warna
      });
    });

    // Draw links (lines)
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", d => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.x : centerX;
      })
      .attr("y2", d => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.y : centerY;
      })
      .attr("stroke", d => d.color)
      .attr("stroke-width", 0)
      .attr("opacity", 0.7);

    // Animate links
    link.transition()
      .duration(800)
      .attr("stroke-width", d => d.width);

    // Draw nodes (circles)
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles
    node.append("circle")
      .attr("r", 0)
      .attr("fill", d => d.id === 'pewaris' ? '#3b82f6' : d.warna)
      .attr("stroke", d => d.id === 'pewaris' ? '#1e40af' : '#ffffff')
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("mouseenter", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 5);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 3);
      })
      .transition()
      .duration(800)
      .attr("r", d => d.radius);

    // Add text for center node (Pewaris)
    const pewarisNode = node.filter(d => d.id === 'pewaris');
    
    pewarisNode.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -10)
      .attr("fill", "#ffffff")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .style("pointer-events", "none")
      .text("Pewaris")
      .style("opacity", 0)
      .transition()
      .delay(400)
      .duration(600)
      .style("opacity", 1);

    pewarisNode.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 10)
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .style("pointer-events", "none")
      .text("(Almarhum)")
      .style("opacity", 0)
      .transition()
      .delay(400)
      .duration(600)
      .style("opacity", 1);

    pewarisNode.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 28)
      .attr("fill", "#ffffff")
      .attr("font-weight", "bold")
      .attr("font-size", "11px")
      .style("pointer-events", "none")
      .text(formatRupiah(harta))
      .style("opacity", 0)
      .transition()
      .delay(400)
      .duration(600)
      .style("opacity", 1);

    // Add text for ahli waris nodes
    const ahliWarisNodes = node.filter(d => d.id !== 'pewaris');

    // Nama (multi-line)
    ahliWarisNodes.each(function(d) {
      const nodeGroup = d3.select(this);
      const namaWords = d.nama.split(' ');
      let lines = [];
      let tempLine = '';
      
      namaWords.forEach(word => {
        const testLine = tempLine + (tempLine ? ' ' : '') + word;
        if (testLine.length > 12 && tempLine) {
          lines.push(tempLine);
          tempLine = word;
        } else {
          tempLine = testLine;
        }
      });
      if (tempLine) lines.push(tempLine);

      const lineHeight = 15;
      const startY = -25;

      lines.forEach((line, i) => {
        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", startY + i * lineHeight)
          .attr("fill", "#ffffff")
          .attr("font-weight", "bold")
          .attr("font-size", "13px")
          .style("pointer-events", "none")
          .text(line)
          .style("opacity", 0)
          .transition()
          .delay(600)
          .duration(600)
          .style("opacity", 1);
      });

      // Fraksi
      nodeGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "#ffffff")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .style("pointer-events", "none")
        .text(d.fraksi)
        .style("opacity", 0)
        .transition()
        .delay(700)
        .duration(600)
        .style("opacity", 1);

      // Nilai rupiah
      nodeGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 22)
        .attr("fill", "#ffffff")
        .attr("font-weight", "bold")
        .attr("font-size", "10px")
        .style("pointer-events", "none")
        .text(formatRupiah(d.bagian))
        .style("opacity", 0)
        .transition()
        .delay(800)
        .duration(600)
        .style("opacity", 1);
    });

  }, [hitungWaris, harta, formatRupiah]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* AREA HASIL GRAF (ATAS) */}
            <div className="bg-red-50 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Hasil Pembagian Waris</h2>
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  HASIL GRAF
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="text-sm text-gray-600 mb-2">Total Harta Warisan</div>
                <div className="text-3xl font-bold text-emerald-600">{formatRupiah(harta)}</div>
              </div>

              {/* Network Graph with D3.js */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6 overflow-auto">
                <svg 
                  ref={svgRef}
                  className="mx-auto"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Detail Bagian */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Detail Pembagian</h3>
                {hitungWaris.filter(h => h.bagian > 0).map((ahli, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-105">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: ahli.warna }}
                        ></div>
                        <span className="font-semibold text-gray-800">{ahli.nama}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{formatRupiah(ahli.bagian)}</div>
                        <div className="text-sm text-gray-500">{ahli.persentase.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AREA PENGISIAN DATA (BAWAH) */}
            <div className="bg-white-50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Input Data Ahli Waris</h2>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  INPUT DATA
                </div>
              </div>

              <div className="space-y-6">
                {/* Harta */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Total Harta Warisan (Rp)
                  </label>
                  <input
                    type="number"
                    value={harta}
                    onChange={(e) => setHarta(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
                    placeholder="100000000"
                  />
                </div>

                {/* Pasangan */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Pasangan</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.istri}
                        onChange={(e) => setAhliWaris({...ahliWaris, istri: e.target.checked, suami: false})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Istri</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.suami}
                        onChange={(e) => setAhliWaris({...ahliWaris, suami: e.target.checked, istri: false})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Suami</span>
                    </label>
                  </div>
                </div>

                {/* Anak */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Anak</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Anak Laki-laki
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={ahliWaris.anakLaki}
                        onChange={(e) => setAhliWaris({...ahliWaris, anakLaki: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Anak Perempuan
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={ahliWaris.anakPerempuan}
                        onChange={(e) => setAhliWaris({...ahliWaris, anakPerempuan: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Orang Tua */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Orang Tua</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.ayah}
                        onChange={(e) => setAhliWaris({...ahliWaris, ayah: e.target.checked})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Ayah</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.ibu}
                        onChange={(e) => setAhliWaris({...ahliWaris, ibu: e.target.checked})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Ibu</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.kakek}
                        onChange={(e) => setAhliWaris({...ahliWaris, kakek: e.target.checked})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Kakek</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={ahliWaris.nenek}
                        onChange={(e) => setAhliWaris({...ahliWaris, nenek: e.target.checked})}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-medium">Nenek</span>
                    </label>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Catatan:</strong> Ini adalah kalkulasi sederhana. Untuk kasus kompleks, konsultasikan dengan ahli waris Islam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarisAppLengkap;