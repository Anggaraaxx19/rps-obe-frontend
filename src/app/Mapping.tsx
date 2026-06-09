import React, { useState, useEffect } from 'react';

export default function Mapping() {
    const [listMapping, setListMapping] = useState([]);
    const [listCpl, setListCpl] = useState([]);
    const [listCpmk, setListCpmk] = useState([]);
    const [form, setForm] = useState({ cpl_id: '', cpmk_id: '' });
    
    // Fitur Premium: Loading & Toast Notification
    const [sedangMemuat, setSedangMemuat] = useState(true);
    const [toast, setToast] = useState({ muncul: false, pesan: '', tipe: 'success' });

    const pemicuToast = (pesan: string, tipe: 'success' | 'error') => {
        setToast({ muncul: true, pesan, tipe });
        setTimeout(() => setToast({ muncul: false, pesan: '', tipe: 'success' }), 3500);
    };

    const ambilSemuaData = async () => {
        setSedangMemuat(true);
        try {
            const tokenHeader = { headers: { 'Accept': 'application/json' } };

            // 1. Ambil Data List Mapping Terbaru
            const resMapping = await fetch('/api/mapping', tokenHeader);
            const dMapping = await resMapping.json();
           if(dMapping.status === 'success') {
    console.log("DATA MAPPING =", dMapping.data);
    setListMapping(dMapping.data);
}
            // 2. Ambil Data Dropdown CPL
            const resCpl = await fetch('/api/cpl', tokenHeader);
            const dCpl = await resCpl.json();
            if(dCpl.status === 'success') setListCpl(dCpl.data);

            // 3. Ambil Data Dropdown CPMK
            const resCpmk = await fetch('/api/cpmk', tokenHeader);
            const dCpmk = await resCpmk.json();
            if(dCpmk.status === 'success') setListCpmk(dCpmk.data);

        } catch (error) { 
            console.error("Gagal sinkronisasi data pemetaan:", error); 
            pemicuToast("Gagal mengambil data dari server backend!", "error");
        } finally {
            setSedangMemuat(false);
        }
    };

    useEffect(() => { ambilSemuaData(); }, []);

    const simpanMapping = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.cpl_id || !form.cpmk_id) {
            pemicuToast("Harap pilih CPL dan CPMK terlebih dahulu!", "error");
            return;
        }

        try {
            const r = await fetch('/api/mapping', {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                }, 
                body: JSON.stringify(form)
            });
            const d = await r.json();
            
            if(r.ok && d.status === 'success') { 
                setForm({ cpl_id: '', cpmk_id: '' }); // Reset Form Dropdown
                ambilSemuaData(); // Reload isi tabel kanan secara otomatis
                pemicuToast("✓ Sukses mengunci hubungan CPL ke CPMK!", "success");
            } else {
                pemicuToast(d.message || "Gagal menyimpan hubungan data.", "error");
            }
        } catch (error) { 
            pemicuToast("🔌 Gagal terhubung, server backend offline.", "error"); 
        }
    };

    const hapusMapping = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin memutus hubungan kompetensi pemetaan ini?")) return;
        try {
            const r = await fetch(`/api/mapping/${id}`, { 
                method: 'DELETE', 
                headers: { 'Accept': 'application/json' } 
            });
            if (r.ok) {
                ambilSemuaData();
                pemicuToast("Hubungan kompetensi berhasil dihapus!", "success");
            }
        } catch (error) { 
            pemicuToast("Gagal memutus hubungan data.", "error"); 
        }
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50/40 min-h-screen relative">
            
            {/* COMPONENT TOAST NOTIFICATION MODERN */}
            {toast.muncul && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border transition-all duration-300 ${
                    toast.tipe === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-600/10' 
                        : 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-600/10'
                }`}>
                    <span className="text-lg">{toast.tipe === 'success' ? '⚡' : '⚠️'}</span>
                    <p className="text-xs font-bold tracking-wide">{toast.pesan}</p>
                </div>
            )}

            {/* HEADER SECTION */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-slate-800">Matriks Pemetaan Kurikulum OBE</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Hubungkan Capaian Pembelajaran Lulusan (CPL) dengan Capaian Pembelajaran Mata Kuliah (CPMK) secara real-time.</p>
                </div>
            </div>

            <div className="flex gap-6 items-start">
                {/* PANEL FORM INPUT LEFT SIDE */}
                <form onSubmit={simpanMapping} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-5 h-fit">
                    <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Mapping CPL ke CPMK</h3>
                    
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Capaian Lulusan (CPL)</label>
                        <select 
                            value={form.cpl_id} 
                            onChange={e => setForm({...form, cpl_id: e.target.value})} 
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                            required
                        >
                            <option value="">-- Pilih Kode CPL --</option>
                            {listCpl.map((cpl: any) => (
                                <option key={cpl.id} value={cpl.id}>{cpl.kode_cpl} - {cpl.deskripsi.substring(0, 45)}...</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Target Kompetensi (CPMK)</label>
                        <select 
                            value={form.cpmk_id} 
                            onChange={e => setForm({...form, cpmk_id: e.target.value})} 
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                            required
                        >
                            <option value="">-- Pilih Target CPMK --</option>
                            {listCpmk.map((cpmk: any) => (
                                <option key={cpmk.id} value={cpmk.id}>[{cpmk.kode_mk || 'MK'}] {cpmk.kode_cpmk} - {cpmk.nama_mk || 'Mata Kuliah'}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-bold text-xs transition-colors shadow-md shadow-blue-600/10 mt-2">
                        Hubungkan
                    </button>
                </form>

                {/* TABEL MATRIKS UTAMA RIGHT SIDE */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Matriks Pemetaan Kompetensi</h3>
                    <div className="overflow-hidden rounded-xl border border-slate-100">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600">
                                    <th className="p-3 font-bold">Mata Kuliah</th>
                                    <th className="p-3 font-bold text-center w-28">CPL</th>
                                    <th className="p-3 font-bold text-center w-28">CPMK</th>
                                    <th className="p-3 font-bold text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 divide-y divide-slate-100">
                                {sedangMemuat ? (
                                    [1, 2, 3].map((n) => (
                                        <tr key={n} className="animate-pulse bg-slate-50/50">
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-14 mx-auto"></div></td>
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-14 mx-auto"></div></td>
                                            <td className="p-4"><div className="h-6 bg-slate-200 rounded-lg w-14 mx-auto"></div></td>
                                        </tr>
                                    ))
                                ) : listMapping.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400 italic font-medium">Belum ada data kompetensi kurikulum yang terhubung.</td>
                                    </tr>
                                ) : (
                                    listMapping.map((item: any, i) => (
                                        <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="p-3 font-semibold text-slate-800">
    TEST
</td>
                                            <td className="p-3 text-center">
                                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 font-bold rounded-md text-[11px] font-mono">
                                                    {item.kode_cpl}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 font-bold rounded-md text-[11px] font-mono">
                                                    {item.kode_cpmk}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button 
                                                    onClick={() => hapusMapping(item.id)} 
                                                    className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-bold hover:bg-rose-600 hover:text-white transition-all text-[11px]"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}