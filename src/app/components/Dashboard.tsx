import React, { useState, useEffect } from 'react';

export function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ totalMk: 0, totalCpl: 0, totalCpmk: 0, draftRps: 0, sahRps: 0 });
    const [listRps, setListRps] = useState([]);

    useEffect(() => {
        // 1. Ambil data session user yang login
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));

        // 2. Ambil data statistik dari API backend
        const muatData = async () => {
            try {
                const resMk = await fetch('http://127.0.0.1:8000/api/mata-kuliah', { headers: { 'Accept': 'application/json' } });
                const dMk = await resMk.json();
                
                const resCpl = await fetch('http://127.0.0.1:8000/api/cpl', { headers: { 'Accept': 'application/json' } });
                const dCpl = await resCpl.json();

                const resRps = await fetch('http://127.0.0.1:8000/api/rps', { headers: { 'Accept': 'application/json' } });
                const dRps = await resRps.json();

                if (dRps.status === 'success') {
                    setListRps(dRps.data);
                    setStats({
                        totalMk: dMk.data?.length || 0,
                        totalCpl: dCpl.data?.length || 0,
                        totalCpmk: 4, // Statis sample counter
                        draftRps: dRps.data.filter((x: any) => x.status === 'Draft').length,
                        sahRps: dRps.data.filter((x: any) => x.status === 'Disetujui').length
                    });
                }
            } catch (error) {
                console.error("Gagal memuat data dashboard:", error);
            }
        };
        muatData();
    }, []);

    if (!user) return <p className="p-6">Memuat sesi dashboard...</p>;
    const role = user.role?.toLowerCase() || 'dosen';

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            
            {/* ATAS: HEADER & TOMBOL EKSPOR PDF UNIVERSAL */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm print:hidden">
                <div>
                    <span className="text-xs font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Workspace {role}
                    </span>
                    <h1 className="text-2xl font-black text-slate-800 mt-2">Selamat Datang, {user.nama || user.name} 👋</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Sistem Monitoring Kurikulum Capaian Pembelajaran OBE.</p>
                </div>
                
                {/* FITUR EKSPOR PDF UNIVERSAL (Bisa digunakan oleh semua akses role) */}
                <button 
                    onClick={() => window.print()} 
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
                >
                    📑 Ekspor Summary Dashboard (PDF)
                </button>
            </div>

            {/* DOKUMEN HEADER KHUSUS MODE PRINT (Otomatis muncul saat PDF di-export) */}
            <div className="hidden print:block text-center border-b-4 border-double border-slate-800 pb-4 mb-6">
                <h2 className="text-xl font-black uppercase">LAPORAN RINGKASAN PROGRESS KURIKULUM OBE</h2>
                <p className="text-xs text-slate-500 mt-1">Dicetak otomatis oleh: {user.nama} ({role}) pada {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            {/* TENGAH: GRID KARTU STATISTIK BERDASARKAN PRIVILEGE */}
            
            {/* TAMPILAN KARTU KHUSUS ADMIN */}
            {role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-2xl text-white shadow-md border border-slate-800">
                        <p className="text-xs font-bold uppercase opacity-70 tracking-wider">Infrastruktur Data</p>
                        <h3 className="text-3xl font-black mt-2">{stats.totalMk} Mata Kuliah</h3>
                        <p className="text-xs opacity-60 mt-2">Terdaftar resmi di pangkalan data kurikulum</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pernyataan CPL Institusi</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalCpl} Data</h3>
                        </div>
                        <span className="text-2xl p-3 bg-blue-50 rounded-xl">🎯</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Hubungan Kompetensi</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalCpl + 2} Terpetakan</h3>
                        </div>
                        <span className="text-2xl p-3 bg-purple-50 rounded-xl">🔗</span>
                    </div>
                </div>
            )}

            {/* TAMPILAN KARTU KHUSUS DOSEN */}
            {role === 'dosen' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-md">
                        <p className="text-xs font-bold uppercase opacity-80 tracking-wider">Tugas Penyusunan Anda</p>
                        <h3 className="text-3xl font-black mt-1">{stats.draftRps} Dokumen RPS</h3>
                        <p className="text-xs opacity-90 mt-2 italic">⚠️ Harap lengkapi materi & indikator penilaian minggu ini.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">RPS Anda yang Telah Sah</p>
                            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.sahRps} Valid</h3>
                            <p className="text-xs text-slate-400 mt-1">Siap digunakan untuk panduan mengajar kelas</p>
                        </div>
                        <span className="text-3xl bg-emerald-50 p-3 rounded-2xl">🎉</span>
                    </div>
                </div>
            )}

            {/* TAMPILAN KARTU KHUSUS KAPRODI */}
            {role === 'kaprodi' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-md">
                        <p className="text-xs font-bold uppercase opacity-80 tracking-wider">Menunggu Persetujuan Anda</p>
                        <h3 className="text-3xl font-black mt-1">{stats.draftRps} Draft RPS</h3>
                        <p className="text-xs opacity-90 mt-2">Perlu pemeriksaan keselarasan CPL prodi</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total RPS Disahkan</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.sahRps} Dokumen</h3>
                        </div>
                        <span className="text-2xl p-3 bg-emerald-50 rounded-xl">✅</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rasio Capaian OBE</p>
                            <h3 className="text-3xl font-black text-blue-600 mt-1">100% Ok</h3>
                        </div>
                        <span className="text-2xl p-3 bg-blue-50 rounded-xl">📈</span>
                    </div>
                </div>
            )}

            {/* BAWAH: TABEL MONITORING UTAMA (TERFORMAT UNTUK PRINT DAN LAYAR) */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center print:hidden">
                    <h3 className="text-md font-bold text-slate-800">📋 Pemantauan Status Dokumen RPS Kurikulum</h3>
                    <span className="text-xs font-medium text-slate-400">Realtime Database Sync</span>
                </div>
                
                <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600">
                                <th className="p-3 font-bold">Mata Kuliah</th>
                                <th className="p-3 font-bold">Dosen Pengembang</th>
                                <th className="p-3 font-bold text-center">Tahun Akademik</th>
                                <th className="p-3 font-bold text-center">Status Berkas</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 divide-y divide-slate-50">
                            {listRps.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-slate-400 italic">Belum ada aktivitas rekam data RPS.</td>
                                </tr>
                            ) : (
                                listRps.map((item: any, i) => (
                                    <tr key={i} className="hover:bg-slate-50/40">
                                        <td className="p-3 font-bold text-slate-900">{item.nama_mk} <span className="text-slate-400 font-mono text-[10px] block mt-0.5">[{item.kode_mk}]</span></td>
                                        <td className="p-3 font-medium text-slate-600">{item.dosen_pengembang}</td>
                                        <td className="p-3 text-center text-slate-500 font-mono">{item.tahun_akademik}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                                                item.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            }`}>
                                                {item.status}
                                            </span>
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