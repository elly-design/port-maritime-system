import { Routes, Route, Link, useLocation } from 'react-router-dom';
import VesselRegistration from './components/VesselRegistration';
import VesselDashboard from './components/VesselDashboard';
import CrewManagement from './components/CrewManagement';
import VoyageTracker from './components/VoyageTracker';
import MaintenanceSchedule from './components/MaintenanceSchedule';
import Home from './components/Home';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="p-4 bg-blue-900 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Maritime Vessel Management System</h1>
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/vessels/register"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/vessels/register'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Register Vessel
            </Link>
            <Link
              to="/vessels"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/vessels'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Vessels
            </Link>
            <Link
              to="/crew"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/crew'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Crew
            </Link>
            <Link
              to="/voyages"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/voyages'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Voyages
            </Link>
            <Link
              to="/maintenance"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/maintenance'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              Maintenance
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vessels/register" element={<VesselRegistration />} />
          <Route path="/vessels" element={<VesselDashboard />} />
          <Route path="/crew" element={<CrewManagement />} />
          <Route path="/voyages" element={<VoyageTracker />} />
          <Route path="/maintenance" element={<MaintenanceSchedule />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
