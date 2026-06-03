import { useState } from 'react';
import { AccessTime, Room } from '@mui/icons-material';

export function Jadwal() {
  const [selectedKelas, setSelectedKelas] = useState('XII IPA 1');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const schedule = {
    'Senin': [
      { time: '07:00 - 08:30', subject: 'Matematika', teacher: 'Dr. Susanto', room: 'Lab 301' },
      { time: '08:30 - 10:00', subject: 'Fisika', teacher: 'Prof. Wijaya', room: 'Lab 302' },
      { time: '10:15 - 11:45', subject: 'Kimia', teacher: 'Dra. Lestari', room: 'Lab 303' },
      { time: '12:45 - 14:15', subject: 'Bahasa Inggris', teacher: 'Mrs. Diana', room: 'Ruang 201' },
    ],
    'Selasa': [
      { time: '07:00 - 08:30', subject: 'Biologi', teacher: 'Dr. Rahmat', room: 'Lab 304' },
      { time: '08:30 - 10:00', subject: 'Matematika', teacher: 'Dr. Susanto', room: 'Lab 301' },
      { time: '10:15 - 11:45', subject: 'Bahasa Indonesia', teacher: 'Drs. Ahmad', room: 'Ruang 202' },
      { time: '12:45 - 14:15', subject: 'Olahraga', teacher: 'Pak Budi', room: 'Lapangan' },
    ],
    'Rabu': [
      { time: '07:00 - 08:30', subject: 'Fisika', teacher: 'Prof. Wijaya', room: 'Lab 302' },
      { time: '08:30 - 10:00', subject: 'Kimia', teacher: 'Dra. Lestari', room: 'Lab 303' },
      { time: '10:15 - 11:45', subject: 'Matematika', teacher: 'Dr. Susanto', room: 'Lab 301' },
      { time: '12:45 - 14:15', subject: 'Sejarah', teacher: 'Drs. Hadi', room: 'Ruang 203' },
    ],
    'Kamis': [
      { time: '07:00 - 08:30', subject: 'Bahasa Inggris', teacher: 'Mrs. Diana', room: 'Ruang 201' },
      { time: '08:30 - 10:00', subject: 'Biologi', teacher: 'Dr. Rahmat', room: 'Lab 304' },
      { time: '10:15 - 11:45', subject: 'Ekonomi', teacher: 'Dra. Siti', room: 'Ruang 204' },
      { time: '12:45 - 14:15', subject: 'Seni Budaya', teacher: 'Bu Indah', room: 'Ruang Seni' },
    ],
    'Jumat': [
      { time: '07:00 - 08:30', subject: 'Pendidikan Agama', teacher: 'Ustadz Yusuf', room: 'Ruang 205' },
      { time: '08:30 - 10:00', subject: 'PKN', teacher: 'Pak Joko', room: 'Ruang 206' },
      { time: '10:15 - 11:45', subject: 'TIK', teacher: 'Bu Maya', room: 'Lab Komputer' },
    ],
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Matematika': 'bg-blue-500',
      'Fisika': 'bg-purple-500',
      'Kimia': 'bg-green-500',
      'Biologi': 'bg-teal-500',
      'Bahasa Inggris': 'bg-orange-500',
      'Bahasa Indonesia': 'bg-red-500',
      'Olahraga': 'bg-yellow-500',
      'Sejarah': 'bg-indigo-500',
      'Ekonomi': 'bg-pink-500',
      'Seni Budaya': 'bg-rose-500',
      'Pendidikan Agama': 'bg-cyan-500',
      'PKN': 'bg-violet-500',
      'TIK': 'bg-slate-500',
    };
    return colors[subject] || 'bg-gray-500';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Jadwal Pelajaran</h1>
        <p className="text-gray-600">Jadwal pelajaran semester genap 2025/2026</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option>Semester Genap</option>
              <option>Semester Ganjil</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Cetak Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <h3 className="font-bold text-center">{day}</h3>
            </div>
            <div className="p-4 space-y-3">
              {schedule[day as keyof typeof schedule].map((lesson, index) => (
                <div
                  key={index}
                  className={`${getSubjectColor(lesson.subject)} rounded-lg p-4 text-white transform hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AccessTime fontSize="small" />
                    <span className="text-sm font-medium">{lesson.time}</span>
                  </div>
                  <h4 className="font-bold mb-1">{lesson.subject}</h4>
                  <p className="text-sm opacity-90 mb-1">{lesson.teacher}</p>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <Room fontSize="small" />
                    <span>{lesson.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Keterangan Mata Pelajaran</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Bahasa Indonesia',
            'Olahraga', 'Sejarah', 'Ekonomi', 'Seni Budaya', 'Pendidikan Agama', 'PKN'
          ].map((subject) => (
            <div key={subject} className="flex items-center gap-2">
              <div className={`${getSubjectColor(subject)} w-4 h-4 rounded`} />
              <span className="text-sm text-gray-700">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
