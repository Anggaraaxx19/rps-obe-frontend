import { useState } from 'react';
import { School, TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

export function Nilai() {
  const [selectedKelas, setSelectedKelas] = useState('XII IPA 1');

  const gradeData = [
    { nama: 'Ahmad Rizki', nis: '2024001', matematika: 85, fisika: 90, kimia: 88, biologi: 87, rata: 87.5, trend: 'up' },
    { nama: 'Siti Nurhaliza', nis: '2024002', matematika: 92, fisika: 88, kimia: 90, biologi: 91, rata: 90.3, trend: 'up' },
    { nama: 'Budi Santoso', nis: '2024003', matematika: 78, fisika: 82, kimia: 80, biologi: 79, rata: 79.8, trend: 'down' },
    { nama: 'Dewi Lestari', nis: '2024004', matematika: 88, fisika: 86, kimia: 87, biologi: 88, rata: 87.3, trend: 'same' },
    { nama: 'Eko Prasetyo', nis: '2024005', matematika: 90, fisika: 92, kimia: 89, biologi: 90, rata: 90.3, trend: 'up' },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nilai & Rapor</h1>
        <p className="text-gray-600">Kelola nilai siswa dan cetak rapor</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <School />
            <TrendingUp />
          </div>
          <p className="text-3xl font-bold mb-1">87.5</p>
          <p className="text-blue-100">Rata-rata Kelas</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-3xl font-bold mb-1">95%</p>
          <p className="text-green-100">Kelulusan</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-3xl font-bold mb-1">12</p>
          <p className="text-purple-100">Siswa Berprestasi</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-3xl font-bold mb-1">3</p>
          <p className="text-orange-100">Perlu Bimbingan</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>XII IPA 1</option>
              <option>XII IPA 2</option>
              <option>XII IPS 1</option>
              <option>XI IPA 1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Semester</label>
            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tahun Ajaran</label>
            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2025/2026</option>
              <option>2024/2025</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">NIS</th>
                <th className="px-6 py-4 text-left">Nama Siswa</th>
                <th className="px-6 py-4 text-center">Matematika</th>
                <th className="px-6 py-4 text-center">Fisika</th>
                <th className="px-6 py-4 text-center">Kimia</th>
                <th className="px-6 py-4 text-center">Biologi</th>
                <th className="px-6 py-4 text-center">Rata-rata</th>
                <th className="px-6 py-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gradeData.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{student.nis}</td>
                  <td className="px-6 py-4 text-gray-700">{student.nama}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-medium ${getGradeColor(student.matematika)}`}>
                      {student.matematika}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-medium ${getGradeColor(student.fisika)}`}>
                      {student.fisika}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-medium ${getGradeColor(student.kimia)}`}>
                      {student.kimia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-medium ${getGradeColor(student.biologi)}`}>
                      {student.biologi}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full font-bold bg-purple-100 text-purple-700">
                      {student.rata.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.trend === 'up' && <TrendingUp className="text-green-500 mx-auto" />}
                    {student.trend === 'down' && <TrendingDown className="text-red-500 mx-auto" />}
                    {student.trend === 'same' && <Remove className="text-gray-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
