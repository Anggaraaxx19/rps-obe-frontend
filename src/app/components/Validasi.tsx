import React, { useState, useEffect } from 'react';

export default function Validasi() {
    const [listRps, setListRps] = useState([]);

    const ambilDataRps = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/rps');
            const d = await res.json();
            if(d.status === 'success') setListRps(d.data);
        } catch (error) {
            console.error("Gagal memuat data RPS untuk validasi:", error);
        }
    };

    useEffect(() => { 
        ambilDataRps(); 
    }, []);

    const ubahStatusRps = async (id: number, statusBaru: string) => {
        try {
            const r = await fetch(`http://127.0.0.1:8000/api/rps/${id}/validasi`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: statusBaru })
            });
            if(r.ok) {
                alert(`Dokumen berhasil diubah menjadi ${statusBaru}!`);
                ambilDataRps();
            }
        } catch (error) {
            console.error("Gagal memperbarui status dokumen:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="text-xl font-black text-gray-800 mb-2">Persetujuan & Validasi Dokumen RPS</h3>
                <p className="text-sm text-gray-500">Halaman khusus Kaprodi / Reviewer untuk memeriksa kelayakan rancangan pembelajaran sebelum disahkan.</p>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-white text-sm uppercase font-semibold">
                        <tr>
                            <th className="p-4">Mata Kuliah</th>
                            <th className="p-4">Dosen Pengembang</th>
                            <th className="p-4 text-center">Beban / TA</th>
                            <th className="p-4 text-center">Status Saat Ini</th>
                            <th className="p-4 text-center">Aksi Persetujuan Kaprodi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {listRps.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada ajuan dokumen RPS masuk untuk diperiksa.</td>
                            </tr>
                        ) : (
                            listRps.map((rps: any, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{rps.nama_mk}</div>
                                        <div className="text-xs font-mono text-gray-400 mt-0.5">{rps.kode_mk}</div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">{rps.dosen_pengembang}</td>
                                    <td className="p-4 text-center">
                                        <div className="text-gray-800 font-medium">{rps.sks} SKS - Sem. {rps.semester}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{rps.tahun_akademik}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            rps.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 
                                            rps.status === 'Review' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-emerald-100 text-emerald-800'
                                        }`}>{rps.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 justify-center">
                                            {rps.status !== 'Review' && rps.status !== 'Disetujui' && (
                                                <button onClick={() => ubahStatusRps(rps.id, 'Review')} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors">
                                                    Ajukan Review
                                                </button>
                                            )}
                                            {rps.status !== 'Disetujui' && (
                                                <button onClick={() => ubahStatusRps(rps.id, 'Disetujui')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors">
                                                    ✓ Setujui & Sahkan
                                                </button>
                                            )}
                                            {rps.status === 'Disetujui' && (
                                                <button onClick={() => ubahStatusRps(rps.id, 'Draft')} className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-xl font-bold text-xs hover:bg-rose-200 transition-colors">
                                                    ✕ Batalkan Pengesahan
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}