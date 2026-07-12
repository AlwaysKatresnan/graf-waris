// pages/HalamanMateriGraf.jsx
import React from 'react';
import { TopicIndex } from '../components/ui.jsx';

export const HalamanMateriGraf = () => {
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
                src="/SILSILAH.png"
                alt="Silsilah keluarga dalam hukum waris Islam"
                className="w-full max-w-6xl h-auto object-contain mx-auto"
              />
            </div>
          </div>

          <div className="mt-5 bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm text-teal-800 leading-relaxed">
            <strong>Catatan:</strong> Simpan file gambar di folder <code>public</code> dengan nama <code>SILSILAH.png</code> agar gambar tampil melalui <code>src="/silsilah_keluarga.png"</code>.
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
