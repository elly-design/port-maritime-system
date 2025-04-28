import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      <div className="text-center text-white mb-12">
        <h1 className="text-4xl font-bold mb-4">Maritime Vessel Management System</h1>
        <p className="text-xl max-w-2xl mx-auto">
          A comprehensive solution for managing vessels, crew, voyages and maintenance in the maritime industry
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        <Link 
          to="/vessels/register" 
          className="bg-white text-blue-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Vessel Registration</h2>
          <p className="text-gray-600">Register new vessels and manage vessel information</p>
        </Link>
        
        <Link 
          to="/crew" 
          className="bg-white text-blue-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Crew Management</h2>
          <p className="text-gray-600">Manage crew members, certifications and assignments</p>
        </Link>
        
        <Link 
          to="/voyages" 
          className="bg-white text-blue-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Voyage Tracking</h2>
          <p className="text-gray-600">Plan and track voyages, routes and cargo information</p>
        </Link>
        
        <Link 
          to="/maintenance" 
          className="bg-white text-blue-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Maintenance</h2>
          <p className="text-gray-600">Schedule and track vessel maintenance and repairs</p>
        </Link>
      </div>
    </div>
  );
}
