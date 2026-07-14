// pages/HalamanKalkulatorMuhammadiyah.jsx
import React from 'react';
import { HalamanVisualisasi } from './HalamanVisualisasi.jsx';
import { hitungWarisMuhammadiyah } from '../logic/waris.js';

// Halaman kalkulator dengan aturan Majelis Tarjih Muhammadiyah.
// Tampilan & input identik dengan Visualisasi Graf; hanya logika pembagian
// anak laki-laki/perempuan yang berbeda (bagian anak perempuan tetap, tidak
// menyusut ketika jumlah anak laki-laki bertambah).
export const HalamanKalkulatorMuhammadiyah = () => (
  <HalamanVisualisasi
    hitungFn={hitungWarisMuhammadiyah}
    judul="Kalkulator Waris Muhammadiyah"
    keterangan="Perhitungan ini sesuai dengan pendapat tokoh PP Muhammadiyah."
  />
);
