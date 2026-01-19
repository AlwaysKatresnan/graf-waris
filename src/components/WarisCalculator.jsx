import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

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
      fraksi: ''
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
        fraksi: adaAnak ? '1/8' : '1/4'
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
        fraksi: adaAnak ? '1/4' : '1/2'
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
        fraksi: adaAnak ? '1/6' : 'Ashabah'
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
        fraksi: (adaAnak || adaSaudara) ? '1/6' : '1/3'
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
            fraksi: '2/n'
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
            fraksi: '1/n'
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
        fraksi: '1/6'
      });
    }

    if (ahliWaris.nenek && !ahliWaris.ibu) {
      const bagianNenek = harta * (1/6);
      hasil.push({
        nama: 'Nenek',
        bagian: bagianNenek,
        persentase: (bagianNenek / harta) * 100,
        warna: '#f97316',
        fraksi: '1/6'
      });
    }

    return hasil;
  }, [harta, ahliWaris]);

  const canvasRef = useRef(null);

  // Draw Network Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = 200;
    const radius = 60;

    // Filter ahli waris yang mendapat bagian
    const ahliWarisAktif = hitungWaris.filter(h => h.bagian > 0 && h.nama !== 'Mayit (Pewaris)');
    const jumlahAhli = ahliWarisAktif.length;

    // Draw lines first (behind circles) - PANJANG GARIS BERDASARKAN PERSENTASE
    ahliWarisAktif.forEach((ahli, idx) => {
      const angle = (Math.PI / (jumlahAhli + 1)) * (idx + 1);
      
      // Panjang garis berdasarkan persentase (min 150px, max 400px)
      const minDistance = 150;
      const maxDistance = 400;
      const lineLength = minDistance + (ahli.persentase / 100) * (maxDistance - minDistance);
      
      const x = centerX + Math.cos(angle - Math.PI / 2) * lineLength;
      const y = centerY + Math.sin(angle - Math.PI / 2) * lineLength;

      // Garis dengan ketebalan berdasarkan persentase
      ctx.strokeStyle = ahli.warna;
      ctx.lineWidth = 2 + (ahli.persentase / 100) * 4;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw center circle (Mayit/Pewaris)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Pewaris', centerX, centerY - 10);
    ctx.font = '12px sans-serif';
    ctx.fillText('(Almarhum)', centerX, centerY + 10);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(formatRupiah(harta), centerX, centerY + 28);

    // Draw ahli waris circles
    ahliWarisAktif.forEach((ahli, idx) => {
      const angle = (Math.PI / (jumlahAhli + 1)) * (idx + 1);
      
      // Panjang garis berdasarkan persentase (sesuai dengan garis)
      const minDistance = 150;
      const maxDistance = 400;
      const lineLength = minDistance + (ahli.persentase / 100) * (maxDistance - minDistance);
      
      const x = centerX + Math.cos(angle - Math.PI / 2) * lineLength;
      const y = centerY + Math.sin(angle - Math.PI / 2) * lineLength;
      
      // Circle size based on bagian
      const nodeRadius = 45 + (ahli.persentase / 100) * 35;

      // Draw circle
      ctx.fillStyle = ahli.warna;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text - TAMPILKAN NAMA, FRAKSI, DAN NILAI
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Nama (bisa multi-line)
      const namaWords = ahli.nama.split(' ');
      const lineHeight = 15;
      let currentY = y - 25;
      
      // Kelompokkan kata jadi max 2 kata per baris
      let tempLine = '';
      const lines = [];
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
      
      lines.forEach((line) => {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
      });

      // Fraksi (1/8, 1/4, dll)
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(ahli.fraksi, x, y + 5);
      
      // Nilai rupiah
      ctx.font = 'bold 10px sans-serif';
      const rupiahText = formatRupiah(ahli.bagian);
      ctx.fillText(rupiahText, x, y + 22);
    });

  }, [hitungWaris, harta, formatRupiah]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Kalkulator Graf Waris Syariat Islam</h1>
            <p className="text-emerald-100">Hitung pembagian waris secara real-time sesuai hukum Islam dengan output Graf</p>
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

              {/* Network Graph */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6 overflow-auto" style={{ maxHeight: '600px' }}>
                <canvas 
                  ref={canvasRef} 
                  width={700} 
                  height={800}
                  className="mx-auto"
                />
              </div>

              {/* Detail Bagian */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Detail Pembagian</h3>
                {hitungWaris.filter(h => h.bagian > 0).map((ahli, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
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
          <p>Prototype Kalkulator Waris Syariat Islam v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default WarisCalculator;