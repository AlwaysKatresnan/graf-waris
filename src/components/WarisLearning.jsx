import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const WarisLearning = () => {
  const [keluarga, setKeluarga] = useState({
    // Pasangan
    istri: false,
    suami: false,
    
    // Orang tua
    ayah: false,
    ibu: false,
    
    // Kakek nenek
    kakekDariAyah: false,
    nenekDariAyah: false,
    kakekDariIbu: false,
    nenekDariIbu: false,
    
    // Anak
    anakLaki: 0,
    anakPerempuan: 0,
    
    // Cucu dari anak laki-laki
    cucuLakiDariAnakLaki: 0,
    cucuPerempuanDariAnakLaki: 0,
    
    // Cucu dari anak perempuan
    cucuLakiDariAnakPerempuan: 0,
    cucuPerempuanDariAnakPerempuan: 0,
    
    // Saudara kandung
    saudaraLakiKandung: 0,
    saudaraPerempuanKandung: 0,
    
    // Saudara seayah
    saudaraLakiSeayah: 0,
    saudaraPerempuanSeayah: 0,
    
    // Saudara seibu
    saudaraLakiSeibu: 0,
    saudaraPerempuanSeibu: 0,
  });

  const svgRef = useRef(null);

  // Logika menentukan siapa yang terhijab (tidak dapat warisan)
  const tentukanStatus = useCallback(() => {
    const status = [];
    const penjelasan = [];

    // 1. Pewaris (almarhum)
    status.push({
      id: 'pewaris',
      nama: 'Pewaris (Almarhum)',
      dapat: false,
      warna: '#3b82f6',
      group: 'pewaris'
    });

    // 2. Pasangan - SELALU DAPAT
    if (keluarga.istri) {
      status.push({
        id: 'istri',
        nama: 'Istri',
        dapat: true,
        warna: '#10b981',
        group: 'pasangan'
      });
    }
    if (keluarga.suami) {
      status.push({
        id: 'suami',
        nama: 'Suami',
        dapat: true,
        warna: '#10b981',
        group: 'pasangan'
      });
    }

    // 3. Ayah - SELALU DAPAT
    if (keluarga.ayah) {
      status.push({
        id: 'ayah',
        nama: 'Ayah',
        dapat: true,
        warna: '#10b981',
        group: 'orangtua'
      });
    }

    // 4. Ibu - SELALU DAPAT
    if (keluarga.ibu) {
      status.push({
        id: 'ibu',
        nama: 'Ibu',
        dapat: true,
        warna: '#10b981',
        group: 'orangtua'
      });
    }

    // 5. Kakek - TERHIJAB jika Ayah ada
    if (keluarga.kakekDariAyah) {
      const dapatWarisan = !keluarga.ayah;
      status.push({
        id: 'kakek-ayah',
        nama: 'Kakek (dari Ayah)',
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'kakek-nenek'
      });
      if (!dapatWarisan) {
        penjelasan.push('❌ Kakek (dari Ayah) terhijab karena Ayah masih hidup');
      }
    }

    if (keluarga.kakekDariIbu) {
      const dapatWarisan = !keluarga.ayah;
      status.push({
        id: 'kakek-ibu',
        nama: 'Kakek (dari Ibu)',
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'kakek-nenek'
      });
      if (!dapatWarisan) {
        penjelasan.push('❌ Kakek (dari Ibu) terhijab karena Ayah masih hidup');
      }
    }

    // 6. Nenek - TERHIJAB jika Ibu atau Ayah ada (tergantung dari siapa)
    if (keluarga.nenekDariAyah) {
      const dapatWarisan = !keluarga.ayah && !keluarga.ibu;
      status.push({
        id: 'nenek-ayah',
        nama: 'Nenek (dari Ayah)',
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'kakek-nenek'
      });
      if (!dapatWarisan) {
        penjelasan.push('❌ Nenek (dari Ayah) terhijab karena Ayah atau Ibu masih hidup');
      }
    }

    if (keluarga.nenekDariIbu) {
      const dapatWarisan = !keluarga.ibu;
      status.push({
        id: 'nenek-ibu',
        nama: 'Nenek (dari Ibu)',
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'kakek-nenek'
      });
      if (!dapatWarisan) {
        penjelasan.push('❌ Nenek (dari Ibu) terhijab karena Ibu masih hidup');
      }
    }

    // 7. Anak - SELALU DAPAT
    for (let i = 0; i < keluarga.anakLaki; i++) {
      status.push({
        id: `anak-laki-${i}`,
        nama: `Anak Laki-laki ${i + 1}`,
        dapat: true,
        warna: '#10b981',
        group: 'anak'
      });
    }

    for (let i = 0; i < keluarga.anakPerempuan; i++) {
      status.push({
        id: `anak-perempuan-${i}`,
        nama: `Anak Perempuan ${i + 1}`,
        dapat: true,
        warna: '#10b981',
        group: 'anak'
      });
    }

    // 8. Cucu dari anak laki-laki - TERHIJAB jika ada anak laki-laki atau (anak perempuan >= 2)
    const adaAnakLaki = keluarga.anakLaki > 0;
    const adaDuaAnakPerempuan = keluarga.anakPerempuan >= 2;
    
    for (let i = 0; i < keluarga.cucuLakiDariAnakLaki; i++) {
      const dapatWarisan = !adaAnakLaki && !adaDuaAnakPerempuan;
      status.push({
        id: `cucu-laki-anak-laki-${i}`,
        nama: `Cucu Laki-laki dari Anak Laki ${i + 1}`,
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'cucu'
      });
      if (!dapatWarisan && i === 0) {
        if (adaAnakLaki) {
          penjelasan.push('❌ Cucu dari anak laki-laki terhijab karena ada Anak Laki-laki');
        } else if (adaDuaAnakPerempuan) {
          penjelasan.push('❌ Cucu dari anak laki-laki terhijab karena ada 2 Anak Perempuan atau lebih');
        }
      }
    }

    for (let i = 0; i < keluarga.cucuPerempuanDariAnakLaki; i++) {
      const dapatWarisan = !adaAnakLaki && !adaDuaAnakPerempuan;
      status.push({
        id: `cucu-perempuan-anak-laki-${i}`,
        nama: `Cucu Perempuan dari Anak Laki ${i + 1}`,
        dapat: dapatWarisan,
        warna: dapatWarisan ? '#10b981' : '#9ca3af',
        group: 'cucu'
      });
    }

    // 9. Cucu dari anak perempuan - SELALU TERHIJAB (tidak dapat warisan)
    for (let i = 0; i < keluarga.cucuLakiDariAnakPerempuan; i++) {
      status.push({
        id: `cucu-laki-anak-perempuan-${i}`,
        nama: `Cucu Laki dari Anak Perempuan ${i + 1}`,
        dapat: false,
        warna: '#9ca3af',
        group: 'cucu'
      });
      if (i === 0) {
        penjelasan.push('❌ Cucu dari anak perempuan TIDAK mendapat warisan (bukan ahli waris)');
      }
    }

    for (let i = 0; i < keluarga.cucuPerempuanDariAnakPerempuan; i++) {
      status.push({
        id: `cucu-perempuan-anak-perempuan-${i}`,
        nama: `Cucu Perempuan dari Anak Perempuan ${i + 1}`,
        dapat: false,
        warna: '#9ca3af',
        group: 'cucu'
      });
    }

    // 10. Saudara - TERHIJAB jika ada Ayah, Anak laki-laki, atau Cucu laki-laki dari anak laki
    const adaCucuLakiDariAnakLaki = keluarga.cucuLakiDariAnakLaki > 0;
    const saudaraTerhijab = keluarga.ayah || adaAnakLaki || adaCucuLakiDariAnakLaki;

    for (let i = 0; i < keluarga.saudaraLakiKandung; i++) {
      status.push({
        id: `saudara-laki-kandung-${i}`,
        nama: `Saudara Laki Kandung ${i + 1}`,
        dapat: !saudaraTerhijab,
        warna: !saudaraTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
      if (saudaraTerhijab && i === 0) {
        penjelasan.push('❌ Saudara kandung terhijab karena ada Ayah, Anak Laki-laki, atau Cucu Laki dari Anak Laki');
      }
    }

    for (let i = 0; i < keluarga.saudaraPerempuanKandung; i++) {
      status.push({
        id: `saudara-perempuan-kandung-${i}`,
        nama: `Saudara Perempuan Kandung ${i + 1}`,
        dapat: !saudaraTerhijab,
        warna: !saudaraTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
    }

    for (let i = 0; i < keluarga.saudaraLakiSeayah; i++) {
      status.push({
        id: `saudara-laki-seayah-${i}`,
        nama: `Saudara Laki Seayah ${i + 1}`,
        dapat: !saudaraTerhijab,
        warna: !saudaraTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
    }

    for (let i = 0; i < keluarga.saudaraPerempuanSeayah; i++) {
      status.push({
        id: `saudara-perempuan-seayah-${i}`,
        nama: `Saudara Perempuan Seayah ${i + 1}`,
        dapat: !saudaraTerhijab,
        warna: !saudaraTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
    }

    // Saudara seibu - terhijab jika ada anak atau cucu dari anak laki-laki atau ayah/ibu
    const saudaraSeibuTerhijab = keluarga.ayah || keluarga.ibu || adaAnakLaki || keluarga.anakPerempuan > 0 || adaCucuLakiDariAnakLaki;
    
    for (let i = 0; i < keluarga.saudaraLakiSeibu; i++) {
      status.push({
        id: `saudara-laki-seibu-${i}`,
        nama: `Saudara Laki Seibu ${i + 1}`,
        dapat: !saudaraSeibuTerhijab,
        warna: !saudaraSeibuTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
      if (saudaraSeibuTerhijab && i === 0) {
        penjelasan.push('❌ Saudara seibu terhijab karena ada Ayah, Ibu, Anak, atau Cucu dari Anak Laki');
      }
    }

    for (let i = 0; i < keluarga.saudaraPerempuanSeibu; i++) {
      status.push({
        id: `saudara-perempuan-seibu-${i}`,
        nama: `Saudara Perempuan Seibu ${i + 1}`,
        dapat: !saudaraSeibuTerhijab,
        warna: !saudaraSeibuTerhijab ? '#10b981' : '#9ca3af',
        group: 'saudara'
      });
    }

    return { status, penjelasan };
  }, [keluarga]);

  // Visualisasi D3.js
  useEffect(() => {
    if (!svgRef.current) return;

    const { status } = tentukanStatus();
    const width = 900;
    const height = 700;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Filter yang akan ditampilkan (semua yang di-input)
    const anggotaKeluarga = status.filter(s => s.id !== 'pewaris');
    
    if (anggotaKeluarga.length === 0) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#9ca3af")
        .attr("font-size", "18px")
        .text("Silakan pilih anggota keluarga yang masih hidup");
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Buat nodes
    const nodes = [
      { id: 'pewaris', x: centerX, y: centerY, radius: 50, ...status[0] }
    ];

    const links = [];

    // Atur posisi melingkar
    anggotaKeluarga.forEach((anggota, idx) => {
      const angle = (2 * Math.PI / anggotaKeluarga.length) * idx - Math.PI / 2;
      const distance = 220;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      nodes.push({
        ...anggota,
        x,
        y,
        radius: 40
      });

      links.push({
        source: 'pewaris',
        target: anggota.id,
        color: anggota.warna
      });
    });

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", d => {
        const target = nodes.find(n => n.id === d.target);
        return target ? target.x : centerX;
      })
      .attr("y2", d => {
        const target = nodes.find(n => n.id === d.target);
        return target ? target.y : centerY;
      })
      .attr("stroke", d => d.color)
      .attr("stroke-width", 3)
      .attr("opacity", 0.6);

    // Draw nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.warna)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3);

    // Add text
    node.each(function(d) {
      const g = d3.select(this);
      
      if (d.id === 'pewaris') {
        g.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", 5)
          .attr("fill", "#ffffff")
          .attr("font-weight", "bold")
          .attr("font-size", "14px")
          .text("Pewaris");
      } else {
        const words = d.nama.split(' ');
        let line1 = words.slice(0, 2).join(' ');
        let line2 = words.slice(2).join(' ');
        
        if (line1.length > 15) {
          line1 = words[0];
          line2 = words.slice(1).join(' ');
        }

        g.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", line2 ? -5 : 5)
          .attr("fill", "#ffffff")
          .attr("font-weight", "bold")
          .attr("font-size", "11px")
          .text(line1);

        if (line2) {
          g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", 10)
            .attr("fill", "#ffffff")
            .attr("font-weight", "bold")
            .attr("font-size", "11px")
            .text(line2);
        }
      }
    });

  }, [keluarga, tentukanStatus]);

  const { penjelasan } = tentukanStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Pembelajaran Waris Islam - Sistem Hijab & Mahrum</h1>
            <p className="text-indigo-100">Pelajari siapa yang mendapat warisan dan siapa yang terhijab (terhalang)</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* VISUALISASI GRAF */}
            <div className="bg-purple-50 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Visualisasi Graf Keluarga</h2>
                <div className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  VISUALISASI
                </div>
              </div>

              {/* Legenda */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Dapat Warisan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm font-medium">Terhijab (Tidak Dapat)</span>
                  </div>
                </div>
              </div>

              {/* Graf SVG */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <svg ref={svgRef} className="mx-auto" style={{ display: 'block' }} />
              </div>

              {/* Penjelasan Aturan */}
              {penjelasan.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-lg mb-4">Aturan Hijab yang Berlaku:</h3>
                  <div className="space-y-2">
                    {penjelasan.map((p, idx) => (
                      <div key={idx} className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
                        <p className="text-sm text-red-800">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {penjelasan.length === 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
                    <p className="text-sm text-green-800">✅ Semua anggota keluarga yang dipilih mendapat warisan</p>
                  </div>
                </div>
              )}
            </div>

            {/* INPUT DATA */}
            <div className="bg-indigo-50 p-8 overflow-y-auto" style={{ maxHeight: '800px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Silsilah Keluarga</h2>
                <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  INPUT DATA
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Pasangan */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Pasangan</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.istri}
                        onChange={(e) => setKeluarga({...keluarga, istri: e.target.checked, suami: false})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Istri</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.suami}
                        onChange={(e) => setKeluarga({...keluarga, suami: e.target.checked, istri: false})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Suami</span>
                    </label>
                  </div>
                </div>

                {/* Orang Tua */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Orang Tua</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.ayah}
                        onChange={(e) => setKeluarga({...keluarga, ayah: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Ayah</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.ibu}
                        onChange={(e) => setKeluarga({...keluarga, ibu: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Ibu</span>
                    </label>
                  </div>
                </div>

                {/* Kakek & Nenek */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Kakek & Nenek</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.kakekDariAyah}
                        onChange={(e) => setKeluarga({...keluarga, kakekDariAyah: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Kakek (dari Ayah)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.nenekDariAyah}
                        onChange={(e) => setKeluarga({...keluarga, nenekDariAyah: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Nenek (dari Ayah)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.kakekDariIbu}
                        onChange={(e) => setKeluarga({...keluarga, kakekDariIbu: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Kakek (dari Ibu)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={keluarga.nenekDariIbu}
                        onChange={(e) => setKeluarga({...keluarga, nenekDariIbu: e.target.checked})}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-medium">Nenek (dari Ibu)</span>
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
                        value={keluarga.anakLaki}
                        onChange={(e) => setKeluarga({...keluarga, anakLaki: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Anak Perempuan
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.anakPerempuan}
                        onChange={(e) => setKeluarga({...keluarga, anakPerempuan: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cucu dari Anak Laki-laki */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Cucu dari Anak Laki-laki</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cucu Laki-laki dari Anak Laki
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.cucuLakiDariAnakLaki}
                        onChange={(e) => setKeluarga({...keluarga, cucuLakiDariAnakLaki: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cucu Perempuan dari Anak Laki
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.cucuPerempuanDariAnakLaki}
                        onChange={(e) => setKeluarga({...keluarga, cucuPerempuanDariAnakLaki: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cucu dari Anak Perempuan */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Cucu dari Anak Perempuan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cucu Laki-laki dari Anak Perempuan
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.cucuLakiDariAnakPerempuan}
                        onChange={(e) => setKeluarga({...keluarga, cucuLakiDariAnakPerempuan: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cucu Perempuan dari Anak Perempuan
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.cucuPerempuanDariAnakPerempuan}
                        onChange={(e) => setKeluarga({...keluarga, cucuPerempuanDariAnakPerempuan: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Saudara Kandung */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Saudara Kandung</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Laki-laki Kandung
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraLakiKandung}
                        onChange={(e) => setKeluarga({...keluarga, saudaraLakiKandung: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Perempuan Kandung
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraPerempuanKandung}
                        onChange={(e) => setKeluarga({...keluarga, saudaraPerempuanKandung: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Saudara Seayah */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Saudara Seayah</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Laki-laki Seayah
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraLakiSeayah}
                        onChange={(e) => setKeluarga({...keluarga, saudaraLakiSeayah: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Perempuan Seayah
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraPerempuanSeayah}
                        onChange={(e) => setKeluarga({...keluarga, saudaraPerempuanSeayah: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Saudara Seibu */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Saudara Seibu</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Laki-laki Seibu
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraLakiSeibu}
                        onChange={(e) => setKeluarga({...keluarga, saudaraLakiSeibu: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudara Perempuan Seibu
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={keluarga.saudaraPerempuanSeibu}
                        onChange={(e) => setKeluarga({...keluarga, saudaraPerempuanSeibu: Number(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Petunjuk:</strong> Pilih anggota keluarga yang masih hidup. Graf akan menampilkan warna hijau untuk yang mendapat warisan dan abu-abu untuk yang terhijab.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Halaman Pembelajaran Waris Islam - Sistem Hijab & Mahrum v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default WarisLearning;