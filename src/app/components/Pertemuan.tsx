import React, { useState, useEffect } from 'react';

export default function Pertemuan() {
    const [listRps, setListRps] = useState([]);
    const [selectedRps, setSelectedRps] = useState('');
    const [listPertemuan, setListPertemuan] = useState([]);
    const [form, setForm] = useState({ minggu_ke: '', materi: '', metode: '', tugas: '', bobot_penilaian: '' });

    const ambilRps = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/rps');
            const d = await res.json();
            if(d.status === 'success') setListRps(d.data);
        } catch (error) {
            console.error("Gagal memuat dokumen RPS:", error);
        }
    };

    const ambilPertemuan = async (rpsId: string) => {
        if (!rpsId) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/pertemuan/${rpsId}`);
            const d = await res.json();
            if(d.status === 'success') setListPertemuan(d.data);
        } catch (error) {
            console.error("Gagal memuat detail pertemuan:", error);
        }
    };

    useEffect(() => { ambilRps(); }, []);

    useEffect(() => {
        if(selectedRps) ambilPertemuan(selectedRps);
    }, [selectedRps]);

    const simpanPertemuan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const r = await fetch('http://127.0.0.1:8000/api/pertemuan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, rps_id: selectedRps })
            });
            if(r.ok) {
                setForm({ minggu_ke: '', materi: '', metode: '', tugas: '', bobot_penilaian: '' });
                ambilPertemuan(selectedRps);
            }
        } catch (error) {
            console.error("Gagal terhubung ke server:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Dropdown Pemilih Dokumen RPS Target */}
            <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
                <label className="font-bold text-gray-700 whitespace-nowrap">Pilih Dokumen RPS Target:</label>
                <select value={selectedRps} onChange={e => setSelectedRps(e.target.value)} className="w-full md:w-1/3 p-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Silakan Pilih RPS Terlebih Dahulu --</option>
                    {listRps.map((rps: any) => (
                        <option key={rps.id} value={rps.id}>[{rps.kode_mk}] {rps.nama_mk} - {rps.dosen_pengembang}</option>
                    ))}
                </select>
            </div>

            {selectedRps && (
                <div className="flex gap-6">
                    {/* Form Input Mingguan */}
                    <form onSubmit={simpanPertemuan} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-4 h-fit">
                        <h3 className="text-lg font-bold text-gray-800">Input Materi Mingguan</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Pertemuan Minggu Ke-</label>
                            <input type="number" placeholder="1 s/16" value={form.minggu_ke} onChange={e => setForm({...form, minggu_ke: e.target.value})} className="w-full p-2 border rounded-xl outline-none" min="1" max="16" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Bahan Kajian / Materi</label>
                            <input type="text" placeholder="Pokok pembahasan materi" value={form.materi} onChange={e => setForm({...form, materi: e.target.value})} className="w-full p-2 border rounded-xl outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Metode Pembelajaran</label>
                            <input type="text" placeholder="Contoh: Kuliah, Diskusi Kelompok, Project" value={form.metode} onChange={e => setForm({...form, metode: e.target.value})} className="w-full p-2 border rounded-xl outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi Tugas (Opsional)</label>
                            <input type="text" placeholder="Contoh: Membuat resume materi" value={form.tugas} onChange={e => setForm({...form, tugas: e.target.value})} className="w-full p-2 border rounded-xl outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Bobot Penilaian Mingguan (%)</label>
                            <input type="number" placeholder="Contoh: 5" value={form.bobot_penilaian} onChange={e => setForm({...form, bobot_penilaian: e.target.value})} className="w-full p-2 border rounded-xl outline-none" min="0" max="100" required />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            Simpan Pertemuan
                        </button>
                    </form>

                    {/* Jendela List Pertemuan 1-16 */}
                    <div className="w-2/3 bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Struktur Program Perkuliahan (16 Minggu)</h3>
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase border-b">
                                    <tr>
                                        <th className="p-3 text-center">Minggu</th>
                                        <th className="p-3">Materi Kuliah</th>
                                        <th className="p-3">Metode</th>
                                        <th className="p-3">Tugas / Aktivitas</th>
                                        <th className="p-3 text-center">Bobot</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-50">
                                    {listPertemuan.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada rincian pertemuan untuk RPS ini.</td>
                                        </tr>
                                    ) : (
                                        listPertemuan.map((ptm: any, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3 text-center font-bold text-gray-500">M-{ptm.minggu_ke}</td>
                                                <td className="p-3 font-medium text-gray-900">{ptm.materi}</td>
                                                <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">{ptm.metode}</span></td>
                                                <td className="p-3 text-gray-600 text-xs">{ptm.tugas || '-'}</td>
                                                <td className="p-3 text-center font-bold text-emerald-600">{ptm.bobot_penilaian}%</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}