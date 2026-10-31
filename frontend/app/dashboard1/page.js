'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function Dashboard1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bins, setBins] = useState([]);
  const [stats, setStats] = useState({
    totalBins: 0,
    criticalBins: 0,
    optimizedRoutes: '89%',
    co2Saved: '1.2 Tons'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Agar URL me Google login ka token aaya hai, toh use save kar lo
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('accessToken', tokenFromUrl);
      router.replace('/dashboard1'); // URL clean karne ke liye
      return;
    }

    // 2. LocalStorage se token check karo
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 3. Backend se real-time Bins data fetch karo
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bins', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setBins(res.data.bins);
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching bin telemetry data:', err);
        // Agar token expired ya unauthorized ho toh login par bhej do
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [searchParams, router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-indigo-400 font-semibold text-lg">
        Loading SmartCycle AI Telemetry...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-400 mb-8">SmartCycle AI</h1>
          <nav className="space-y-3 text-sm">
            <a href="#" className="block p-3 bg-indigo-600/20 text-indigo-400 rounded-xl font-medium">🗑️ Bin Monitoring</a>
            <a href="#" className="block p-3 hover:bg-gray-800 text-gray-400 rounded-xl transition">📊 IoT Analytics</a>
            <a href="#" className="block p-3 hover:bg-gray-800 text-gray-400 rounded-xl transition">🚨 Alert Logs</a>
            <a href="#" className="block p-3 hover:bg-gray-800 text-gray-400 rounded-xl transition">⚙️ System Settings</a>
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full py-2.5 bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition duration-200 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold">Urban Waste Monitoring Dashboard</h2>
            <p className="text-xs text-gray-400">Real-time IoT sensor telemetry & municipal tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-300 font-medium">System Online</span>
          </div>
        </header>

        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Total Active Bins</p>
              <h3 className="text-3xl font-bold mt-2 text-indigo-400">{stats.totalBins}</h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Critical / Overflowing</p>
              <h3 className="text-3xl font-bold mt-2 text-red-400">{stats.criticalBins}</h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Optimized Routes</p>
              <h3 className="text-3xl font-bold mt-2 text-emerald-400">{stats.optimizedRoutes}</h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <p className="text-sm text-gray-400">CO2 Emissions Saved</p>
              <h3 className="text-3xl font-bold mt-2 text-amber-400">{stats.co2Saved}</h3>
            </div>
          </div>

          {/* Bins Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Live IoT Bin Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="border-b border-gray-800 text-gray-400">
                  <tr>
                    <th className="pb-3">Bin ID</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Fill Level</th>
                    <th className="pb-3">Temperature</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bins.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500">
                        No active bins found in the database.
                      </td>
                    </tr>
                  ) : (
                    bins.map((bin) => (
                      <tr key={bin.binId || bin._id} className="hover:bg-gray-800/50">
                        <td className="py-4 font-medium text-white">{bin.binId}</td>
                        <td className="py-4 text-gray-400">{bin.location}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${bin.fillLevel > 80 ? 'bg-red-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${bin.fillLevel}%` }}
                              ></div>
                            </div>
                            <span>{bin.fillLevel}%</span>
                          </div>
                        </td>
                        <td className="py-4">{bin.temperature}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            bin.status === 'Overflowing' || bin.status === 'Critical' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {bin.status}
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
      </main>
    </div>
  );
}

export default function SmartBinDashboard() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">Loading Dashboard...</div>}>
      <Dashboard1Content />
    </Suspense>
  );
}