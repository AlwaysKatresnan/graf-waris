// pages/HalamanMateri.jsx
import React from 'react';
import { TopicIndex } from '../components/ui.jsx';

export const HalamanMateri = () => {
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
    { title: 'Pelaksanaan Wasiat', desc: 'Wasiat dilaksanakan setelah pelunasan utang, dengan batas maksimal 1/3 dari harta warisan. Wasiat tidak boleh ditujukan kepada ahli waris kecuali disetujui ahli waris lain, dan tidak boleh bertentangan dengan ketentuan syariat.' },
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
                dan memastikan harta waris dibagikan setelah kewajiban pewaris diselesaikan.
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

