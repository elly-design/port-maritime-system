import React, { useState, useEffect } from 'react';

// Removing React Leaflet imports to fix context consumer errors
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icons in react-leaflet
// // @ts-ignore
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

interface Voyage {
  _id: string;
  voyageId: string;
  vessel: {
    _id: string;
    vesselId: string;
    name: string;
  };
  departurePort: string;
  destinationPort: string;
  departureTime: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: string;
  cargo: {
    type: string;
    weight: number;
    description: string;
  };
  route: {
    latitude: number;
    longitude: number;
    timestamp: string;
  }[];
  fuelConsumption: number;
  distance: number;
}

interface Vessel {
  _id: string;
  vesselId: string;
  name: string;
}

export default function VoyageTracker() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [isAddingVoyage, setIsAddingVoyage] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    voyageId: '',
    vessel: '',
    departurePort: '',
    destinationPort: '',
    departureTime: '',
    estimatedArrival: '',
    status: 'Planned',
    cargoType: '',
    cargoWeight: '',
    cargoDescription: ''
  });

  useEffect(() => {
    fetchVoyages();
    fetchVessels();
  }, []);

  const fetchVoyages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/voyages');
      
      if (!response.ok) {
        throw new Error('Failed to fetch voyages');
      }
      
      const data = await response.json();
      setVoyages(data);
      if (data.length > 0) {
        setSelectedVoyage(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching voyages:', error);
      setError('Failed to load voyages. Please try again later.');
      setLoading(false);
    }
  };

  const fetchVessels = async () => {
    try {
      const response = await fetch('/api/vessels');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vessels');
      }
      
      const data = await response.json();
      setVessels(data);
    } catch (error) {
      console.error('Error fetching vessels:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/voyages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voyageId: formData.voyageId,
          vessel: formData.vessel,
          departurePort: formData.departurePort,
          destinationPort: formData.destinationPort,
          departureTime: new Date(formData.departureTime),
          estimatedArrival: new Date(formData.estimatedArrival),
          status: formData.status,
          cargo: {
            type: formData.cargoType,
            weight: parseFloat(formData.cargoWeight),
            description: formData.cargoDescription
          },
          route: [],
          fuelConsumption: 0,
          distance: 0,
          crew: []
        }),
      });

      if (response.ok) {
        alert('Voyage added successfully!');
        fetchVoyages();
        setIsAddingVoyage(false);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to add voyage: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding voyage:', error);
      alert('Failed to add voyage. Please try again.');
    }
  };

  const handleUpdateVoyageStatus = async (voyageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/voyages/${voyageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setVoyages(voyages.map(voyage => 
          voyage.voyageId === voyageId ? { ...voyage, status: newStatus } : voyage
        ));
        
        if (selectedVoyage?.voyageId === voyageId) {
          setSelectedVoyage({ ...selectedVoyage, status: newStatus });
        }
        
        alert('Voyage status updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update voyage status: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating voyage status:', error);
      alert('Failed to update voyage status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      voyageId: '',
      vessel: '',
      departurePort: '',
      destinationPort: '',
      departureTime: '',
      estimatedArrival: '',
      status: 'Planned',
      cargoType: '',
      cargoWeight: '',
      cargoDescription: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Voyage Tracker</h1>
        <button
          onClick={() => {
            setIsAddingVoyage(!isAddingVoyage);
            resetForm();
          }}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          {isAddingVoyage ? 'Cancel' : 'Add Voyage'}
        </button>
      </div>

      {isAddingVoyage && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Voyage</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voyage ID
                </label>
                <input
                  type="text"
                  name="voyageId"
                  value={formData.voyageId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vessel
                </label>
                <select
                  name="vessel"
                  value={formData.vessel}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Vessel</option>
                  {vessels.map((vessel) => (
                    <option key={vessel._id} value={vessel._id}>
                      {vessel.name} ({vessel.vesselId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Port
                </label>
                <input
                  type="text"
                  name="departurePort"
                  value={formData.departurePort}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Port
                </label>
                <input
                  type="text"
                  name="destinationPort"
                  value={formData.destinationPort}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Arrival
                </label>
                <input
                  type="datetime-local"
                  name="estimatedArrival"
                  value={formData.estimatedArrival}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Type
                </label>
                <input
                  type="text"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Weight (tons)
                </label>
                <input
                  type="number"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Description
                </label>
                <textarea
                  name="cargoDescription"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
              >
                Add Voyage
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading voyages...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchVoyages}
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Voyages</h2>
              
              {voyages.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No voyages found</p>
              ) : (
                <div className="space-y-4 max-h-[440px] overflow-y-auto">
                  {voyages.map((voyage) => (
                    <div 
                      key={voyage._id} 
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedVoyage?._id === voyage._id 
                          ? 'bg-blue-100 border-blue-300' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => setSelectedVoyage(voyage)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{voyage.vessel.name}</h3>
                          <p className="text-sm text-gray-600">ID: {voyage.voyageId}</p>
                          <p className="text-sm text-gray-600">
                            {voyage.departurePort} → {voyage.destinationPort}
                          </p>
                          <div className="mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(voyage.status)}`}>
                              {voyage.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedVoyage ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Voyage: {selectedVoyage.voyageId}
                    </h2>
                    <div>
                      <select
                        value={selectedVoyage.status}
                        onChange={(e) => handleUpdateVoyageStatus(selectedVoyage.voyageId, e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Voyage Details</h3>
                    <ul className="space-y-1">
                      <li><span className="text-gray-600">Vessel:</span> {selectedVoyage.vessel.name}</li>
                      <li><span className="text-gray-600">Departure:</span> {selectedVoyage.departurePort}</li>
                      <li><span className="text-gray-600">Destination:</span> {selectedVoyage.destinationPort}</li>
                      <li>
                        <span className="text-gray-600">Departure Time:</span> {new Date(selectedVoyage.departureTime).toLocaleString()}
                      </li>
                      <li>
                        <span className="text-gray-600">Estimated Arrival:</span> {new Date(selectedVoyage.estimatedArrival).toLocaleString()}
                      </li>
                      {selectedVoyage.actualArrival && (
                        <li>
                          <span className="text-gray-600">Actual Arrival:</span> {new Date(selectedVoyage.actualArrival).toLocaleString()}
                        </li>
                      )}
                      <li><span className="text-gray-600">Status:</span> {selectedVoyage.status}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Cargo Information</h3>
                    <ul className="space-y-1">
                      <li><span className="text-gray-600">Type:</span> {selectedVoyage.cargo.type}</li>
                      <li><span className="text-gray-600">Weight:</span> {selectedVoyage.cargo.weight} tons</li>
                      <li><span className="text-gray-600">Description:</span> {selectedVoyage.cargo.description}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Route Tracking</h3>
                  <div className="h-[300px] border rounded overflow-auto p-4">
                    <div className="flex flex-col h-full">
                      <p className="text-gray-500 mb-4">Map view temporarily disabled. Showing route data in table format.</p>
                      
                      {selectedVoyage && selectedVoyage.route && selectedVoyage.route.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Point
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Latitude
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Longitude
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Timestamp
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedVoyage.route.map((point, index) => (
                                <tr key={index} className={index === 0 ? 'bg-green-50' : (index === selectedVoyage.route.length - 1 ? 'bg-blue-50' : '')}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index === 0 ? 'Departure' : (index === selectedVoyage.route.length - 1 ? 'Current/Arrival' : `Waypoint ${index}`)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {point.latitude.toFixed(6)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {point.longitude.toFixed(6)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(point.timestamp).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">No route data available for this voyage</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Distance:</span> {selectedVoyage.distance} nautical miles
                    </div>
                    <div>
                      <span className="text-gray-600">Fuel Consumption:</span> {selectedVoyage.fuelConsumption} tons
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
                <p className="text-gray-500">Select a voyage to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
