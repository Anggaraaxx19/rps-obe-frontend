import React, { useState, useEffect } from 'react';

export default function Revisi() {
    const [logs, setLogs] = useState([]);

    const ambilLogRevisi = async () => {
        try {
            const res = await fetch('https://api.127.0.0.1:8000.com');
            const d = await res.json();
            if(d.status === 'success') setLogs(d.data);
        } catch (error) {
            console.error("Gagal memuat log riwayat perubahan:", error);
        }
    };

    useEffect(() => {
        ambilLogRevisi();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="text-xl font-black text-gray-800 mb-1">Riwayat Revisi & Perubahan Data RPS</h3>
                <p className="text-sm text-gray-500">Log sistem otomatis yang mencatat jejak digital audit setiap perubahan status dokumen kurikulum.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
                    {logs.length === 0 ? (
                        <p className="text-sm text-gray-400 pl-4">Belum ada rekaman aktivitas perubahan data.</p>
                    ) : (
                        logs.map((log: any, i) => (
                            <div key={i} className="relative pl-6">
                                {/* Dot Indicator */}
                                <span className="absolute -left-[9px] top-1.5 bg-blue-600 h-4 w-4 rounded-full border-4 border-white shadow-sm"></span>
                                
                                {/* Card Log Content */}
                                <div className="bg-gray-50 p-4 rounded-xl border hover:bg-gray-100/70 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            {log.nama_matkul}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 mt-2">{log.aktivitas}</p>
                                    <p className="text-xs text-gray-500 mt-1">Oleh: <span className="font-medium text-gray-700">{log.aktor}</span></p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}