import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const WarisCalculator = () => {
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Kalkulator Graf Waris Syariat Islam</h1>
            <p className="text-emerald-100">Hitung pembagian waris secara real-time sesuai hukum Islam dengan output graf</p>
          </div>

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
            <div className="bg-blue-50 p-8">
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

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Prototype Kalkulator Waris Syariat Islam v1.0 - Powered by D3.js</p>
        </div>
      </div>
    </div>
  );
};

export default WarisCalculator;