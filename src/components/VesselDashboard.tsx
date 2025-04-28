import React, { useState, useEffect } from 'react';
import API_CONFIG from '../api/config';
import { FaEdit, FaTrash, FaPlus, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

interface Vessel {
  _id: string;
  vesselId: string;
  name: string;
  type: string;
  flag: string;
  yearBuilt: number;
  grossTonnage: number;
  length: number;
  beam: number;
  draft: number;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    portName?: string;
  };
  lastMaintenance: string;
  nextScheduledMaintenance: string;
}

export default function VesselDashboard() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isAddingVessel, setIsAddingVessel] = useState<boolean>(false);
  const [newVesselData, setNewVesselData] = useState({
    vesselId: '',
    name: '',
    type: 'Cargo',
    flag: '',
    yearBuilt: new Date().getFullYear(),
    grossTonnage: 0,
    length: 0,
    beam: 0,
    draft: 0,
    status: 'Docked',
    latitude: 0,
    longitude: 0,
    portName: '',
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextScheduledMaintenance: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchVessels();
  }, []);

  const fetchVessels = async () => {
    try {
      setLoading(true);
      console.log('Fetching vessels from API...');
      
      // Direct API call to the server
      const apiUrl = '/api/vessels';
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vessels: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Vessels data received:', data);
      setVessels(data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching vessels:', error);
      setError(`Failed to load vessels: ${error.message}`);
      setLoading(false);
    }
  };

  const handleDeleteVessel = async (vesselId: string) => {
    if (!window.confirm('Are you sure you want to delete this vessel?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VESSELS}/${vesselId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vessel');
      }
      
      // Remove vessel from state
      setVessels(vessels.filter(vessel => vessel.vesselId !== vesselId));
      
      if (selectedVessel?.vesselId === vesselId) {
        setSelectedVessel(null);
      }
    } catch (error) {
      console.error('Error deleting vessel:', error);
      alert('Failed to delete vessel. Please try again later.');
    }
  };

  const handleUpdateStatus = async (vesselId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VESSELS}/${vesselId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vessel status');
      }
      
      // Update vessel in state
      setVessels(vessels.map(vessel => 
        vessel.vesselId === vesselId ? { ...vessel, status: newStatus } : vessel
      ));
      
      if (selectedVessel?.vesselId === vesselId) {
        setSelectedVessel({ ...selectedVessel, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating vessel status:', error);
      alert('Failed to update vessel status. Please try again later.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVesselData(prev => ({
      ...prev,
      [name]: name === 'yearBuilt' || name === 'grossTonnage' || name === 'length' || 
              name === 'beam' || name === 'draft' || name === 'latitude' || name === 'longitude'
              ? parseFloat(value) : value
    }));
  };

  const handleAddVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newVesselData.vesselId || !newVesselData.name || !newVesselData.flag) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Ensure numeric values are valid
      if (newVesselData.grossTonnage <= 0 || 
          newVesselData.length <= 0 || 
          newVesselData.beam <= 0 || 
          newVesselData.draft <= 0) {
        alert('Please enter valid measurements for the vessel');
        return;
      }
      
      // Create a properly formatted vessel object
      const vesselData = {
        vesselId: newVesselData.vesselId,
        name: newVesselData.name,
        type: newVesselData.type,
        flag: newVesselData.flag,
        yearBuilt: Number(newVesselData.yearBuilt),
        grossTonnage: Number(newVesselData.grossTonnage),
        length: Number(newVesselData.length),
        beam: Number(newVesselData.beam),
        draft: Number(newVesselData.draft),
        status: newVesselData.status,
        currentLocation: {
          latitude: Number(newVesselData.latitude),
          longitude: Number(newVesselData.longitude),
          portName: newVesselData.portName || undefined
        },
        lastMaintenance: new Date(newVesselData.lastMaintenance).toISOString(),
        nextScheduledMaintenance: new Date(newVesselData.nextScheduledMaintenance).toISOString()
      };
      
      console.log('Sending vessel data:', JSON.stringify(vesselData, null, 2));
      
      // Use XMLHttpRequest for better error visibility
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/vessels', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Vessel registration successful:', xhr.responseText);
          
          try {
            const data = JSON.parse(xhr.responseText);
            setVessels([...vessels, data]);
            setIsAddingVessel(false);
            
            // Reset form
            setNewVesselData({
              vesselId: '',
              name: '',
              type: 'Cargo',
              flag: '',
              yearBuilt: new Date().getFullYear(),
              grossTonnage: 0,
              length: 0,
              beam: 0,
              draft: 0,
              status: 'Docked',
              latitude: 0,
              longitude: 0,
              portName: '',
              lastMaintenance: new Date().toISOString().split('T')[0],
              nextScheduledMaintenance: new Date().toISOString().split('T')[0]
            });
            
            alert('Vessel registered successfully!');
            // Refresh the vessel list
            fetchVessels();
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            alert('Vessel was registered but there was an error processing the response');
            fetchVessels();
          }
        } else {
          console.error('Server error response:', xhr.status, xhr.statusText, xhr.responseText);
          try {
            const errorData = JSON.parse(xhr.responseText);
            alert(`Failed to register vessel: ${errorData.message || xhr.statusText}`);
          } catch (e) {
            alert(`Failed to register vessel: ${xhr.statusText || 'Unknown error'}`);
          }
        }
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred during vessel registration');
        alert('Network error. Please check if the server is running and accessible.');
      };
      
      xhr.send(JSON.stringify(vesselData));
    } catch (error: any) {
      console.error('Error registering vessel:', error);
      alert(`Failed to register vessel: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredVessels = filterStatus 
    ? vessels.filter(vessel => vessel.status === filterStatus)
    : vessels;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vessel Dashboard</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          onClick={() => setIsAddingVessel(true)}
        >
          <FaPlus className="mr-2" /> Add New Vessel
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vessels..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center">
            <FaFilter className="mr-2 text-gray-600" />
            <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Docked">Docked</option>
              <option value="In Transit">In Transit</option>
            </select>
            <button
              onClick={fetchVessels}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading vessels...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchVessels}
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-[500px] flex items-center justify-center bg-gray-100">
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold mb-4">Vessel Locations</h3>
                  <p className="text-gray-600 mb-4">
                    Map view temporarily disabled. We're working on fixing the map component.
                  </p>
                  <p className="text-sm text-gray-500">
                    In the meantime, you can view vessel details in the table below.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVessels.map((vessel) => (
                      <tr 
                        key={vessel._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedVessel(vessel)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vessel.vesselId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vessel.status === 'Active' ? 'bg-green-100 text-green-800' :
                            vessel.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                            vessel.status === 'Docked' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {vessel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vessel.currentLocation.portName || 'At Sea'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit logic
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVessel(vessel.vesselId);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedVessel ? 'Vessel Details' : 'Select a Vessel'}
              </h2>
              
              {selectedVessel ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedVessel.name}</h3>
                    <p className="text-sm text-gray-500">ID: {selectedVessel.vesselId}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{selectedVessel.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Flag</p>
                      <p className="font-medium">{selectedVessel.flag}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year Built</p>
                      <p className="font-medium">{selectedVessel.yearBuilt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gross Tonnage</p>
                      <p className="font-medium">{selectedVessel.grossTonnage} GT</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">
                      Length: {selectedVessel.length}m | Beam: {selectedVessel.beam}m | Draft: {selectedVessel.draft}m
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Current Location</p>
                    <p className="font-medium">
                      {selectedVessel.currentLocation.portName || 'At Sea'} 
                      ({selectedVessel.currentLocation.latitude.toFixed(4)}, {selectedVessel.currentLocation.longitude.toFixed(4)})
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                        selectedVessel.status === 'Active' ? 'bg-green-100 text-green-800' :
                        selectedVessel.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                        selectedVessel.status === 'Docked' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedVessel.status}
                      </span>
                      <select
                        className="text-sm border border-gray-300 rounded p-1"
                        value={selectedVessel.status}
                        onChange={(e) => handleUpdateStatus(selectedVessel.vesselId, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Docked">Docked</option>
                        <option value="In Transit">In Transit</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Maintenance</p>
                      <p className="font-medium">
                        {new Date(selectedVessel.lastMaintenance).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Scheduled</p>
                      <p className="font-medium">
                        {new Date(selectedVessel.nextScheduledMaintenance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
                      <FaEdit className="mr-2" /> Edit Details
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                      onClick={() => handleDeleteVessel(selectedVessel.vesselId)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a vessel from the map or table to view details</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Vessel Modal */}
      {isAddingVessel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Register New Vessel</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsAddingVessel(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddVessel} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vessel ID</label>
                  <input
                    type="text"
                    name="vesselId"
                    value={newVesselData.vesselId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newVesselData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={newVesselData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="Cargo">Cargo</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Passenger">Passenger</option>
                    <option value="Fishing">Fishing</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flag</label>
                  <input
                    type="text"
                    name="flag"
                    value={newVesselData.flag}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={newVesselData.yearBuilt}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gross Tonnage</label>
                  <input
                    type="number"
                    name="grossTonnage"
                    value={newVesselData.grossTonnage}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newVesselData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Docked">Docked</option>
                    <option value="In Transit">In Transit</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                  <input
                    type="number"
                    name="length"
                    value={newVesselData.length}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beam (m)</label>
                  <input
                    type="number"
                    name="beam"
                    value={newVesselData.beam}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Draft (m)</label>
                  <input
                    type="number"
                    name="draft"
                    value={newVesselData.draft}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={newVesselData.latitude}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={newVesselData.longitude}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port Name</label>
                  <input
                    type="text"
                    name="portName"
                    value={newVesselData.portName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={newVesselData.lastMaintenance}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Scheduled Maintenance</label>
                  <input
                    type="date"
                    name="nextScheduledMaintenance"
                    value={newVesselData.nextScheduledMaintenance}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingVessel(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Register Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
