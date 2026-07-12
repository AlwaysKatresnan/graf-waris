// pages/HalamanVisualisasi.jsx
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Network, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { InputSection, Checkbox, NumberInput } from '../components/ui.jsx';
import { hitungWaris, daftarAhliWaris } from '../logic/waris.js';

export const HalamanVisualisasi = () => {
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

  const semuaAhliWaris = useMemo(() => {
    const hasilHitung = hitungWaris(harta, ahliWaris);
    return daftarAhliWaris(ahliWaris, hasilHitung);
  }, [harta, ahliWaris]);

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
