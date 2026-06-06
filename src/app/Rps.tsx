import React, { useState, useEffect } from 'react';
import CetakRps from './CetakRps';

export default function Rps() {
    const [idCetak, setIdCetak] = useState<number | null>(null);
    const [listRps, setListRps] = useState([]);
    const [listMatkul, setListMatkul] = useState([]);
    const [form, setForm] = useState({ mata_kuliah_id: '', dosen_pengembang: '', tahun_akademik: '' });

    const ambilData = async () => {
        try {
            // Ditambah header Accept agar data sukses ditarik oleh Dosen
            const resRps = await fetch('[', {
                headers: { 'Accept': 'application/json' }
            });
            const dRps = await resRps.json();
            if(dRps.status === 'success') setListRps(dRps.data);

            const resMatkul = await fetch('/api/mata-kuliah', {
                headers: { 'Accept': 'application/json' }
            });
            const dMatkul = await resMatkul.json();
            if(dMatkul.status === 'success') setListMatkul(dMatkul.data);
        } catch (error) {
            console.error("Gagal memuat dokumen RPS:", error);
        }
    };

    useEffect(() => { ambilData(); }, []);

    const generateRps = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const r = await fetch('[', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(form)
            });
            const d = await r.json();
            if(r.ok) {
                setForm({ mata_kuliah_id: '', dosen_pengembang: '', tahun_akademik: '' });
                ambilData();
                alert("✓ Berhasil generate template RPS baru!");
            } else {
                alert("❌ " + (d.message || "Gagal membuat dokumen RPS."));
            }
        } catch (error) {
            alert("🔌 Koneksi database terputus.");
        }
    };

    if (idCetak !== null) {
        return <CetakRps rpsId={idCetak} onKembali={() => setIdCetak(null)} />;
    }

    return (
        <div className="p-6 flex gap-6">
            {/* Form Generator */}
            <form onSubmit={generateRps} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-4 h-fit">
                <h3 className="text-lg font-bold text-gray-800">Generate RPS Otomatis</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah Target</label>
                    <select value={form.mata_kuliah_id} onChange={e => setForm({...form, mata_kuliah_id: e.target.value})} className="w-full p-2 border rounded-xl bg-white text-sm outline-none" required>
                        <option value="">-- Pilih Mata Kuliah --</option>
                        {listMatkul.map((mk: any) => (
                            <option key={mk.id} value={mk.id}>[{mk.kode_mk}] {mk.nama_mk}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengembang</label>
                    <input type="text" placeholder="Nama Dosen Lengkap & Gelar" value={form.dosen_pengembang} onChange={e => setForm({...form, dosen_pengembang: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akademik</label>
                    <input type="text" placeholder="Contoh: 2025/2026 Ganjil" value={form.tahun_akademik} onChange={e => setForm({...form, tahun_akademik: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" required />
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white p-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm text-sm">
                    ⚡ Buat Template Dokumen
                </button>
            </form>

            {/* Dashboard List Dokumen */}
            <div className="w-2/3 bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monitoring Progress Penyusunan RPS</h3>
                <div className="grid grid-cols-2 gap-4">
                    {listRps.length === 0 ? (
                        <div className="col-span-2 p-12 text-center text-gray-400 border border-dashed rounded-2xl text-sm">
                            Belum ada dokumen RPS yang digenerate.
                        </div>
                    ) : (
                        listRps.map((rps: any, i) => (
                            <div key={i} className="p-4 border rounded-2xl space-y-3 hover:border-blue-400 transition-colors bg-gray-50/40 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{rps.kode_mk}</span>
                                            <h4 className="font-bold text-gray-900 mt-1 text-sm">{rps.nama_mk}</h4>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                            rps.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>{rps.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 space-y-1 pt-1 border-t border-gray-100 mt-2">
                                        <p>👤 Dosen: <span className="font-medium text-gray-700">{rps.dosen_pengembang}</span></p>
                                        <p>📅 TA: <span className="font-medium text-gray-700">{rps.tahun_akademik}</span></p>
                                        <p>📊 Beban: <span className="font-medium text-gray-700">{rps.sks} SKS</span></p>
                                    </div>
                                </div>
                                <button onClick={() => setIdCetak(rps.id)} className="w-full mt-3 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 rounded-xl font-bold text-xs transition-colors">
                                    🖨️ Lihat & Cetak Dokumen RPS
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}