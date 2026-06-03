import React from 'react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  user: any;
}

export function Sidebar({ activeMenu, onMenuChange, user }: SidebarProps) {
  const roleUser = user?.role?.toLowerCase() || 'dosen';

  // Daftar menu yang disaring ketat berdasarkan asas fungsionalitas OBE
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard Monitoring', icon: '📊', roles: ['admin', 'dosen', 'kaprodi'] },
    { id: 'mata-kuliah', label: 'Manajemen Mata Kuliah', icon: '📚', roles: ['admin'] },
    { id: 'siswa', label: 'Manajemen CPL', icon: '🎯', roles: ['admin'] },
    { id: 'nilai', label: 'Manajemen CPMK', icon: '📝', roles: ['admin'] },
    { id: 'jadwal', label: 'Mapping CPL-CPMK', icon: '🔗', roles: ['admin'] },
    { id: 'guru', label: 'Pembuatan RPS Otomatis', icon: '⚡', roles: ['dosen'] },
    { id: 'pertemuan', label: 'Pertemuan & Rubrik', icon: '📅', roles: ['dosen'] },
    { id: 'review', label: 'Review & Validasi RPS', icon: '✅', roles: ['kaprodi'] },
    { id: 'revisi', label: 'Riwayat Revisi', icon: '⏳', roles: ['admin', 'kaprodi'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(roleUser));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen border-r border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
          <span>🛡️</span> RPS OBE System
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-wide">Politeknik Pertanian Negeri</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10 scale-[1.02]'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-sm uppercase">
            {roleUser.substring(0, 1)}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate uppercase">{user?.nama || user?.name || 'User Akses'}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-slate-800 px-1.5 py-0.5 rounded w-fit mt-0.5">
              Akses {roleUser}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-slate-800/50 hover:bg-rose-950/40 hover:text-rose-400 text-xs font-bold py-2 px-3 rounded-xl border border-slate-800 hover:border-rose-900/50 transition-all text-center block"
        >
          🚪 Keluar dari Sistem
        </button>
      </div>
    </div>
  );
}