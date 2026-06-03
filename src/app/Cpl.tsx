import React, { useState, useEffect } from 'react';

export default function Cpl() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ kode_cpl: '', deskripsi: '' });

    const ambilData = async () => {
        try {
            const r = await fetch('http://127.0.0.1:8000/api/cpl', { headers: { 'Accept': 'application/json' } });
            const d = await r.json();
            if(d.status === 'success') setList(d.data);
        } catch (error) {
            console.error("Gagal memuat data CPL:", error);
        }
    };

    useEffect(() => { ambilData(); }, []);

    const simpan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const r = await fetch('http://127.0.0.1:8000/api/cpl', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(form)
            });
            if(r.ok) { setForm({ kode_cpl: '', deskripsi: '' }); ambilData(); }
        } catch (error) { console.error(error); }
    };

    const hapusData = async (id: number) => {
        if (!confirm("Hapus capaian CPL ini?")) return;
        try {
            const r = await fetch(`http://127.0.0.1:8000/api/cpl/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
            if (r.ok) ambilData();
        } catch (error) { alert("Gagal hapus"); }
    };

    return (
        <div className="p-6 flex gap-6">
            <form onSubmit={simpan} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Tambah CPL</h3>
                <input type="text" placeholder="Kode CPL" value={form.kode_cpl} onChange={e => setForm({...form, kode_cpl: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" required />
                <textarea placeholder="Deskripsi CPL" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" rows={4} required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-xl font-bold text-sm">Simpan</button>
            </form>

            <div className="w-2/3 bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Capaian Pembelajaran Lulusan (CPL)</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                            <th className="p-3 font-semibold w-24">Kode</th>
                            <th className="p-3 font-semibold">Deskripsi</th>
                            <th className="p-3 text-center w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y">
                        {list.map((item: any, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                                <td className="p-3 font-bold text-blue-600 font-mono">{item.kode_cpl}</td>
                                <td className="p-3 text-gray-700">{item.deskripsi}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => hapusData(item.id)} className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}