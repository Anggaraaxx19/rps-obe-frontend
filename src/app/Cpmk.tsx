import React, { useState, useEffect } from 'react';

export default function Cpmk() {
    const [list, setList] = useState([]);
    const [listMatkul, setListMatkul] = useState([]);
    const [form, setForm] = useState({ mata_kuliah_id: '', kode_cpmk: '', deskripsi: '' });

    const ambilData = async () => {
        try {
            const r = await fetch('http://127.0.0.1:8000/api/cpmk', { headers: { 'Accept': 'application/json' } });
            const d = await r.json();
            if(d.status === 'success') setList(d.data);

            const rMk = await fetch('http://127.0.0.1:8000/api/mata-kuliah', { headers: { 'Accept': 'application/json' } });
            const dMk = await rMk.json();
            if(dMk.status === 'success') setListMatkul(dMk.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { ambilData(); }, []);

    const simpan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const r = await fetch('http://127.0.0.1:8000/api/cpmk', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(form)
            });
            if(r.ok) { setForm({ mata_kuliah_id: '', kode_cpmk: '', deskripsi: '' }); ambilData(); }
        } catch (error) { console.error(error); }
    };

    const hapusData = async (id: number) => {
        if (!confirm("Hapus data CPMK ini?")) return;
        try {
            const r = await fetch(`http://127.0.0.1:8000/api/cpmk/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
            if (r.ok) ambilData();
        } catch (error) { alert("Gagal hapus"); }
    };

    return (
        <div className="p-6 flex gap-6">
            <form onSubmit={simpan} className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Tambah CPMK</h3>
                <select value={form.mata_kuliah_id} onChange={e => setForm({...form, mata_kuliah_id: e.target.value})} className="w-full p-2 border rounded-xl text-sm bg-white outline-none" required>
                    <option value="">-- Pilih Mata Kuliah --</option>
                    {listMatkul.map((mk: any) => <option key={mk.id} value={mk.id}>[{mk.kode_mk}] {mk.nama_mk}</option>)}
                </select>
                <input type="text" placeholder="Kode CPMK (Contoh: CPMK-1)" value={form.kode_cpmk} onChange={e => setForm({...form, kode_cpmk: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" required />
                <textarea placeholder="Indikator Kinerja / Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full p-2 border rounded-xl text-sm outline-none" rows={3} required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-xl font-bold text-sm">Simpan</button>
            </form>

            <div className="w-2/3 bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Capaian Pembelajaran Mata Kuliah (CPMK)</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                            <th className="p-3 font-semibold">Mata Kuliah</th>
                            <th className="p-3 font-semibold">Kode</th>
                            <th className="p-3 font-semibold">Indikator</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y">
                        {list.map((item: any, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                                <td className="p-3 text-gray-600 font-medium">{item.nama_mk}</td>
                                <td className="p-3 font-bold text-purple-600 font-mono">{item.kode_cpmk}</td>
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