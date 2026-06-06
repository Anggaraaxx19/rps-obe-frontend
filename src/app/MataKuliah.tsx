import React, { useState, useEffect } from 'react';

export default function MataKuliah() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ kode_mk: '', nama_mk: '', sks: '', semester: '' });
    const [sedangMemuat, setSedangMemuat] = useState(true);
    const [toast, setToast] = useState({ muncul: false, pesan: '', tipe: 'success' });

    const pemicuToast = (pesan: string, tipe: 'success' | 'error') => {
        setToast({ muncul: true, pesan, tipe });
        setTimeout(() => setToast({ muncul: false, pesan: '', tipe: 'success' }), 3500);
    };

    const ambilData = async () => {
        setSedangMemuat(true);
        try {
            // KUNCI PERBAIKAN 1: URL Fetch Ambil Data Lokal yang Benar
            const r = await fetch('/api/mata-kuliah', { 
                headers: { 'Accept': 'application/json' } 
            });
            const d = await r.json();
            if(d.status === 'success') setList(d.data);
        } catch (error) {
            console.error("Gagal memuat data:", error);
        } finally {
            setSedangMemuat(false);
        }
    };

    useEffect(() => { ambilData(); }, []);

    const simpan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // KUNCI PERBAIKAN 2: URL Fetch Simpan Data Lokal yang Benar
            const r = await fetch('/api/mata-kuliah', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(form)
            });
            const d = await r.json();
            if(r.ok && d.status === 'success') {
                setForm({ kode_mk: '', nama_mk: '', sks: '', semester: '' });
                ambilData();
                pemicuToast("Mata kuliah berhasil disimpan ke sistem!", "success");
            } else {
                pemicuToast(d.message || "Gagal menyimpan data.", "error");
            }
        } catch (error) {
            pemicuToast("Koneksi gagal, server backend offline.", "error");
        }
    };

    const hapusData = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        try {
            // KUNCI PERBAIKAN 3: URL Fetch Hapus Data Lokal yang Benar
            const r = await fetch(`/api/mata-kuliah/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            if (r.ok) {
                ambilData();
                pemicuToast("Data berhasil diubah ke status Soft Delete!", "success");
            }
        } catch (error) {
            pemicuToast("Gagal menghapus data.", "error");
        }
    };

    return (
        <div className="p-6 flex gap-6 relative min-h-screen bg-slate-50/30">
            
            {/* COMPONENT TOAST NOTIFICATION MODERN */}
            {toast.muncul && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border transition-all ${
                    toast.tipe === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-600/10' 
                        : 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-600/10'
                }`}>
                    <span className="text-lg">{toast.tipe === 'success' ? '⚡' : '⚠️'}</span>
                    <p className="text-xs font-bold tracking-wide">{toast.pesan}</p>
                </div>
            )}

            {/* FORM INPUT SECTION */}
            <form onSubmit={simpan} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-4 h-fit">
                <h3 className="text-md font-bold text-slate-800 border-b pb-2">Tambah Mata Kuliah</h3>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kode MK</label>
                    <input type="text" placeholder="Contoh: INT45" value={form.kode_mk} onChange={e => setForm({...form, kode_mk: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Mata Kuliah</label>
                    <input type="text" placeholder="Contoh: ALJABAR" value={form.nama_mk} onChange={e => setForm({...form, nama_mk: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SKS</label>
                        <input type="number" placeholder="SKS" value={form.sks} onChange={e => setForm({...form, sks: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Semester</label>
                        <input type="number" placeholder="Semester" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors mt-2">Simpan Data</button>
            </form>

            {/* LIST TABLE SECTION */}
            <div className="w-2/3 bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-md font-bold text-slate-800 mb-4">Daftar Mata Kuliah Aktif</h3>
                <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b text-slate-600">
                                <th className="p-3 font-bold">Kode</th>
                                <th className="p-3 font-bold">Nama Mata Kuliah</th>
                                <th className="p-3 text-center">SKS</th>
                                <th className="p-3 text-center">Semester</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {sedangMemuat ? (
                                [1, 2, 3].map((n) => (
                                    <tr key={n} className="animate-pulse bg-slate-50/50">
                                        <td className="p-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-200 rounded w-10 mx-auto"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-200 rounded w-10 mx-auto"></div></td>
                                        <td className="p-4"><div className="h-6 bg-slate-200 rounded-lg w-14 mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : list.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">Belum ada data mata kuliah aktif.</td>
                                </tr>
                            ) : (
                                list.map((item: any, i) => (
                                    <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                                        <td className="p-3 font-bold text-blue-600 font-mono">{item.kode_mk}</td>
                                        <td className="p-3 font-medium text-slate-800">{item.nama_mk}</td>
                                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-black">{item.sks} SKS</span></td>
                                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black">Smstr {item.semester}</span></td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => hapusData(item.id)} className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-bold hover:bg-rose-600 hover:text-white transition-all">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}