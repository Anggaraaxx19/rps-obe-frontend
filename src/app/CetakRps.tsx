import React, { useState, useEffect } from 'react';

export default function CetakRps({ rpsId, onKembali }: { rpsId: number, onKembali: () => void }) {
    const [detailRps, setDetailRps] = useState<any>(null);
    const [listPertemuan, setListPertemuan] = useState<any[]>([]);

    useEffect(() => {
        const ambilDetail = async () => {
            try {
                // 1. Ambil Data Detail RPS
                const resRps = await fetch("https://rpsobee.infinityfreeapp.com/api/rps");
                const dRps = await resRps.json();
                if (dRps.status === 'success') {
                    const ditemukan = dRps.data.find((x: any) => x.id === rpsId);
                    setDetailRps(ditemukan);
                }

                // 2. Ambil Data List Pertemuan Berdasarkan RPS ID
                const resPtm = await fetch(`https://rpsobee.infinityfreeapp.com/api/pertemuan/${rpsId}`);
                const dPtm = await resPtm.json();
                if (dPtm.status === 'success') {
                    setListPertemuan(dPtm.data);
                }
            } catch (error) {
                console.error("Gagal memuat dokumen untuk dicetak:", error);
            }
        };

        if (rpsId) {
            ambilDetail();
        }
    }, [rpsId]);

    if (!detailRps) return <p className="p-6 text-center">Memuat dokumen cetak...</p>;

    return (
        <div className="p-8 bg-white min-h-screen">
            {/* Tombol Kontrol (Akan Otomatis Hilang Saat Dicetak) */}
            <div className="print:hidden flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border">
                <button onClick={onKembali} className="text-sm font-bold text-gray-600 hover:text-gray-900">
                    ← Kembali ke Dashboard
                </button>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-sm">
                    🖨️ Cetak Dokumen / Simpan PDF
                </button>
            </div>

            {/* KOP DOKUMEN RESMI KAMPUS */}
            <div className="text-center border-b-4 border-double border-gray-800 pb-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-wide">Rencana Pembelajaran Semester (RPS)</h2>
                <h3 className="text-md font-bold text-gray-700">PROGRAM STUDI PENDIDIKAN TEKNOLOGI INFORMASI</h3>
                <p className="text-xs text-gray-500 font-mono">Standar Kurikulum Berbasis Outcome-Based Education (OBE)</p>
            </div>

            {/* DETAIL MATAKULIAH */}
            <div className="mt-6 grid grid-cols-2 gap-4 border p-4 rounded-xl text-sm bg-gray-50/50">
                <div>
                    <p className="text-gray-500">Mata Kuliah:</p>
                    <p className="font-bold text-gray-900">{detailRps.nama_mk} ({detailRps.kode_mk})</p>
                </div>
                <div>
                    <p className="text-gray-500">Dosen Pengembang RPS:</p>
                    <p className="font-bold text-gray-900">{detailRps.dosen_pengembang}</p>
                </div>
                <div>
                    <p className="text-gray-500">Bobot SKS / Semester:</p>
                    <p className="font-bold text-gray-900">{detailRps.sks} SKS / Semester {detailRps.semester}</p>
                </div>
                <div>
                    <p className="text-gray-500">Tahun Akademik / Status:</p>
                    <p className="font-bold text-gray-900">{detailRps.tahun_akademik} - <span className="text-emerald-600 font-black">{detailRps.status}</span></p>
                </div>
            </div>

            {/* STRUKTUR MINGGUAN */}
            <div className="mt-8">
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-sm tracking-wider">Rincian Aktivitas Perkuliahan Mingguan</h4>
                <table className="w-full text-left border-collapse border text-xs">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-2 border border-gray-300 text-center w-12">Wk</th>
                            <th className="p-2 border border-gray-300">Bahan Kajian & Materi Kuliah</th>
                            <th className="p-2 border border-gray-300 w-32">Metode</th>
                            <th className="p-2 border border-gray-300">Aktivitas Mandiri / Tugas</th>
                            <th className="p-2 border border-gray-300 text-center w-16">Bobot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPertemuan.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-400">Belum ada rincian pertemuan mingguan yang dimasukkan.</td>
                            </tr>
                        ) : (
                            listPertemuan.map((ptm: any, i) => (
                                <tr key={i} className="border-b">
                                    <td className="p-2 border border-gray-200 text-center font-bold">M-{ptm.minggu_ke}</td>
                                    <td className="p-2 border border-gray-200 font-medium">{ptm.materi}</td>
                                    <td className="p-2 border border-gray-200 text-gray-600">{ptm.metode}</td>
                                    <td className="p-2 border border-gray-200 text-gray-500 italic">{ptm.tugas || '-'}</td>
                                    <td className="p-2 border border-gray-200 text-center font-bold text-gray-900">{ptm.bobot_penilaian}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* KOLOM TANDA TANGAN */}
            <div className="mt-12 flex justify-between text-center text-xs">
                <div className="w-48 space-y-12">
                    <p>Dosen Pengembang,</p>
                    <p className="font-bold underline">{detailRps.dosen_pengembang}</p>
                </div>
                <div className="w-48 space-y-12">
                    <p>Mengetahui, Kaprodi</p>
                    <p className="font-bold underline">KAPRODI JURUSAN</p>
                </div>
            </div>
        </div>
    );
}