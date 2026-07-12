// logic/waris.js
// Logika perhitungan waris Islam — fungsi murni tanpa React sehingga mudah diuji unit.

export function hitungWaris(harta, ahliWaris) {
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

    // far'un warith = keturunan yang menghijab (anak, atau cucu dari anak laki-laki)
    const adaKakekAyah      = ahliWaris.kakekDariAyah && !ahliWaris.ayah;
    const adaCucuPrDariAL   = ahliWaris.cucuPerempuanDariAnakLaki > 0;
    const adaKeturunan      = adaAnak || adaCucuLakiDariAL || adaCucuPrDariAL;
    const adaKeturunanLaki  = adaAnakLaki || adaCucuLakiDariAL;

    // ── PASANGAN ───────────────────────────────────────────────────────────────
    if (ahliWaris.istri) {
      const b = adaKeturunan ? harta / 8 : harta / 4;
      hasil.push({ id: 'istri', nama: 'Istri', bagian: b, persentase: (b/harta)*100, warna: '#ec4899', fraksi: adaKeturunan ? '1/8' : '1/4' });
      sisaHarta -= b;
    }
    if (ahliWaris.suami) {
      const b = adaKeturunan ? harta / 4 : harta / 2;
      hasil.push({ id: 'suami', nama: 'Suami', bagian: b, persentase: (b/harta)*100, warna: '#3b82f6', fraksi: adaKeturunan ? '1/4' : '1/2' });
      sisaHarta -= b;
    }

    // ── ORANG TUA (Ibu dihitung lebih dulu untuk kasus 'Umariyyatain) ──────────
    const adaPasangan  = ahliWaris.istri || ahliWaris.suami;
    const totalSaudara = ahliWaris.saudaraLakiKandung + ahliWaris.saudaraPerempuanKandung +
                         ahliWaris.saudaraLakiSeayah  + ahliWaris.saudaraPerempuanSeayah  +
                         ahliWaris.saudaraLakiSeibu   + ahliWaris.saudaraPerempuanSeibu;
    const ada2Sdr = totalSaudara >= 2;
    if (ahliWaris.ibu) {
      // 'Umariyyatain: pasangan + ayah + ibu, tanpa keturunan & tanpa saudara → ibu 1/3 dari SISA
      const umariyyatain = adaPasangan && ahliWaris.ayah && !adaKeturunan && totalSaudara === 0;
      let b, fr;
      if (adaKeturunan || ada2Sdr) { b = harta / 6;      fr = '1/6'; }
      else if (umariyyatain)       { b = sisaHarta / 3;  fr = '1/3 sisa'; }
      else                         { b = harta / 3;      fr = '1/3'; }
      hasil.push({ id: 'ibu', nama: 'Ibu', bagian: b, persentase: (b/harta)*100, warna: '#f59e0b', fraksi: fr });
      sisaHarta -= b;
    }
    if (ahliWaris.ayah) {
      // Ada keturunan → 1/6 fardh; tanpa keturunan → ashabah (sisa setelah pasangan & ibu)
      const b = adaKeturunan ? harta / 6 : sisaHarta;
      hasil.push({ id: 'ayah', nama: 'Ayah', bagian: b, persentase: (b/harta)*100, warna: '#8b5cf6', fraksi: adaKeturunan ? '1/6' : 'Ashabah' });
      sisaHarta -= b;
    }

    // ── KAKEK dari Ayah (terhijab Ayah) ───────────────────────────────────────
    if (ahliWaris.kakekDariAyah && !ahliWaris.ayah) {
      const b = adaKeturunan ? harta / 6 : sisaHarta;
      hasil.push({ id: 'kakek-ayah', nama: 'Kakek (Ayah)', bagian: b, persentase: (b/harta)*100, warna: '#6366f1', fraksi: adaKeturunan ? '1/6' : 'Ashabah' });
      sisaHarta -= b;
    }

    // ── NENEK dari Ayah (terhijab hanya oleh Ayah atau Ibu, TIDAK oleh Kakek) ─
    if (ahliWaris.nenekDariAyah && !ahliWaris.ayah && !ahliWaris.ibu) {
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
      const cucuLaki = ahliWaris.cucuLakiDariAnakLaki;
      const cucuPrInput = ahliWaris.cucuPerempuanDariAnakLaki;
      const clr1 = ['#34d399','#10b981','#059669','#047857'];
      const clr2 = ['#67e8f9','#22d3ee','#06b6d4','#0891b2'];

      if (cucuLaki > 0) {
        // Ada cucu laki -> cucu laki & perempuan menjadi ashabah bil-ghair (2:1), ambil seluruh sisa.
        const totalUnit = (cucuLaki * 2) + cucuPrInput;
        const hartaCucu = sisaHarta;
        for (let i = 0; i < cucuLaki; i++) {
          const b = (hartaCucu * 2) / totalUnit;
          hasil.push({ id: `cucu-l-al-${i}`, nama: `Cucu L (Anak L) ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr1[i%4], fraksi: '2/n' });
        }
        for (let i = 0; i < cucuPrInput; i++) {
          const b = hartaCucu / totalUnit;
          hasil.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: b, persentase: (b/harta)*100, warna: clr2[i%4], fraksi: '1/n' });
        }
        sisaHarta = 0;
      } else if (cucuPrInput > 0) {
        // Hanya cucu perempuan dari anak laki (tanpa cucu laki).
        if (ada2AnakPerempuan) {
          // Terhijab: 2+ anak perempuan sudah memenuhi 2/3.
          for (let i = 0; i < cucuPrInput; i++) {
            hasil.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: 0, persentase: 0, warna: '#9ca3af', fraksi: 'Terhijab' });
          }
        } else if (ahliWaris.anakPerempuan === 1) {
          // Takmilah lith-thuluthain: pelengkap 1/6 (melengkapi 2/3 bersama 1 anak perempuan).
          const total16 = harta / 6;
          const bPerOrang = total16 / cucuPrInput;
          for (let i = 0; i < cucuPrInput; i++) {
            hasil.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr2[i%4], fraksi: '1/6 \u00f7 n' });
          }
          sisaHarta -= total16;
        } else if (cucuPrInput === 1) {
          // Tidak ada anak perempuan -> seperti anak perempuan tunggal: 1/2.
          const b = harta / 2;
          hasil.push({ id: 'cucu-p-al-0', nama: 'Cucu P (Anak L) 1', bagian: b, persentase: (b/harta)*100, warna: clr2[0], fraksi: '1/2' });
          sisaHarta -= b;
        } else {
          // 2+ cucu perempuan tanpa anak perempuan -> 2/3 dibagi rata.
          const total23 = (harta * 2) / 3;
          const bPerOrang = total23 / cucuPrInput;
          for (let i = 0; i < cucuPrInput; i++) {
            hasil.push({ id: `cucu-p-al-${i}`, nama: `Cucu P (Anak L) ${i+1}`, bagian: bPerOrang, persentase: (bPerOrang/harta)*100, warna: clr2[i%4], fraksi: '2/3 \u00f7 n' });
          }
          sisaHarta -= total23;
        }
      }
    }

    // ── SAUDARA KANDUNG ────────────────────────────────────────────────────────
    // Terhijab oleh: Ayah, Anak Laki, Cucu Laki dari Anak Laki
    const hijabSdrKandung = ahliWaris.ayah || adaKakekAyah || pengganti_anakLaki;
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
    const hijabSdrSeibu = ahliWaris.ayah || adaKakekAyah || ahliWaris.ibu || adaKeturunan;
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
    const hanyaKeturunanPr = adaKeturunan && !adaKeturunanLaki;
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
}

export function daftarAhliWaris(ahliWaris, hitungWaris) {
    const adaAnakLaki       = ahliWaris.anakLaki > 0;
    const adaAnakPerempuan  = ahliWaris.anakPerempuan > 0;
    const adaAnak           = adaAnakLaki || adaAnakPerempuan;
    const adaCucuLakiDariAL = ahliWaris.cucuLakiDariAnakLaki > 0;
    const pengganti_anakLaki = adaAnakLaki || adaCucuLakiDariAL;
    const adaSdrLakiKandung  = ahliWaris.saudaraLakiKandung > 0;
    const adaKakekAyah       = ahliWaris.kakekDariAyah && !ahliWaris.ayah;
    const adaCucuPrDariAL    = ahliWaris.cucuPerempuanDariAnakLaki > 0;
    const adaKeturunan       = adaAnak || adaCucuLakiDariAL || adaCucuPrDariAL;
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
        : ahliWaris.ibu ? 'Terhijab oleh Ibu' : null);
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

    const hijabSdrKandung = ahliWaris.ayah || adaKakekAyah || pengganti_anakLaki;
    for (let i = 0; i < ahliWaris.saudaraLakiKandung; i++)
      tambah(`sdr-l-k-${i}`, `Sdr L Kandung ${i+1}`,
        hijabSdrKandung ? 'Terhijab oleh Ayah / Kakek / Anak Laki / Cucu Laki' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanKandung; i++)
      tambah(`sdr-p-k-${i}`, `Sdr P Kandung ${i+1}`,
        hijabSdrKandung ? 'Terhijab oleh Ayah / Kakek / Anak Laki / Cucu Laki' : null);

    const hijabSdrSeayah = hijabSdrKandung || adaSdrLakiKandung;
    for (let i = 0; i < ahliWaris.saudaraLakiSeayah; i++)
      tambah(`sdr-l-sa-${i}`, `Sdr L Seayah ${i+1}`,
        hijabSdrSeayah ? 'Terhijab oleh Ayah / Kakek / Anak Laki / Sdr L Kandung' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanSeayah; i++)
      tambah(`sdr-p-sa-${i}`, `Sdr P Seayah ${i+1}`,
        hijabSdrSeayah ? 'Terhijab oleh Ayah / Kakek / Anak Laki / Sdr L Kandung' : null);

    const hijabSdrSeibu = ahliWaris.ayah || adaKakekAyah || ahliWaris.ibu || adaKeturunan;
    for (let i = 0; i < ahliWaris.saudaraLakiSeibu; i++)
      tambah(`sdr-l-si-${i}`, `Sdr L Seibu ${i+1}`,
        hijabSdrSeibu ? 'Terhijab oleh Ayah / Kakek / Ibu / Keturunan' : null);
    for (let i = 0; i < ahliWaris.saudaraPerempuanSeibu; i++)
      tambah(`sdr-p-si-${i}`, `Sdr P Seibu ${i+1}`,
        hijabSdrSeibu ? 'Terhijab oleh Ayah / Kakek / Ibu / Keturunan' : null);

    return daftar;
}
