import { useState, useEffect } from 'react'; 
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import Login from './Login';

import MataKuliah from './MataKuliah';
import Cpl from './Cpl';
import Cpmk from './Cpmk';
import Mapping from './Mapping';
import Rps from './Rps';
import Pertemuan from './components/Pertemuan';
import Validasi from './components/Validasi';
import Revisi from './Revisi';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <Login onLoginSukses={(userData) => setUser(userData)} />;
  }

  const roleUser = user?.role?.toLowerCase() || 'dosen';

  // SISTEM SAKLAR KEAMANAN KONTEN BERDASARKAN PRIVILEGE ROLE
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': 
        return <Dashboard />;
        
      case 'mata-kuliah': 
        return roleUser === 'admin' ? <MataKuliah /> : <Dashboard />;
        
      case 'siswa': 
        return roleUser === 'admin' ? <Cpl /> : <Dashboard />;
        
      case 'nilai': 
        return roleUser === 'admin' ? <Cpmk /> : <Dashboard />;
        
      case 'jadwal': 
        return roleUser === 'admin' ? <Mapping /> : <Dashboard />;
        
      case 'guru': 
        return roleUser === 'dosen' ? <Rps /> : <Dashboard />;
        
      case 'pertemuan': 
        return roleUser === 'dosen' ? <Pertemuan /> : <Dashboard />;
        
      case 'review': 
        return roleUser === 'kaprodi' ? <Validasi /> : <Dashboard />;
        
      case 'revisi': 
        return (roleUser === 'admin' || roleUser === 'kaprodi') ? <Revisi /> : <Dashboard />;
        
      default: 
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} user={user} />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}