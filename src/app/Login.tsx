import React, { useState } from 'react';

interface LoginProps {
    onLoginSukses: (user: { name: string; email: string; role: string }) => void;
}

export default function Login({ onLoginSukses }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // PERBAIKAN UTAMA: Menggunakan URL API lokal murni yang valid
            const respon = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const hasil = await respon.json();

            if (hasil.status === 'success') {
                // Simpan data user & token di browser agar kalau di-refresh tidak log out
                localStorage.setItem('user', JSON.stringify(hasil.user));
                localStorage.setItem('token', hasil.token);
                
                // Kirim data user ke komponen utama
                onLoginSukses(hasil.user);
            } else {
                setError(hasil.message || 'Email atau Password salah!');
            }
        } catch (err) {
            setError('Gagal terhubung ke server Backend Laravel. Pastikan php artisan serve menyala!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
                <div className="text-center mb-8">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Politani Payakumbuh
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-800 mt-3">RPS OBE System</h2>
                    <p className="text-slate-500 text-sm mt-1">Silakan masuk dengan akun instruktur Anda</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center text-xs font-semibold border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Email Kampus</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm outline-none transition-all" placeholder="contoh@politani.ac.id" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm outline-none transition-all" placeholder="••••••••" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-slate-400 transition-all text-sm">
                        {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}