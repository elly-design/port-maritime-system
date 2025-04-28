import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VesselFormData {
  vesselId: string;
  name: string;
  type: string;
  flag: string;
  yearBuilt: string;
  grossTonnage: string;
  length: string;
  beam: string;
  draft: string;
  status: string;
}

export default function VesselRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VesselFormData>({
    vesselId: '',
    name: '',
    type: '',
    flag: '',
    yearBuilt: '',
    grossTonnage: '',
    length: '',
    beam: '',
    draft: '',
    status: 'Active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/vessels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          yearBuilt: parseInt(formData.yearBuilt),
          grossTonnage: parseFloat(formData.grossTonnage),
          length: parseFloat(formData.length),
          beam: parseFloat(formData.beam),
          draft: parseFloat(formData.draft),
          currentLocation: {
            latitude: 0,
            longitude: 0
          },
          lastMaintenance: new Date().toISOString(),
          nextScheduledMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
        }),
      });

      if (response.ok) {
        alert('Vessel registered successfully!');
        navigate('/vessels');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error registering vessel:', error);
      alert('Failed to register vessel. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Register New Vessel</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="vesselId" className="block text-sm font-medium text-gray-700 mb-1">
              Vessel ID
            </label>
            <input
              type="text"
              id="vesselId"
              name="vesselId"
              value={formData.vesselId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Cargo Ship">Cargo Ship</option>
              <option value="Container Ship">Container Ship</option>
              <option value="Tanker">Tanker</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
              <option value="Passenger Ship">Passenger Ship</option>
              <option value="Fishing Vessel">Fishing Vessel</option>
              <option value="Tugboat">Tugboat</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
              Flag
            </label>
            <input
              type="text"
              id="flag"
              name="flag"
              value={formData.flag}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              id="yearBuilt"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="grossTonnage" className="block text-sm font-medium text-gray-700 mb-1">
              Gross Tonnage
            </label>
            <input
              type="number"
              id="grossTonnage"
              name="grossTonnage"
              value={formData.grossTonnage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Length (meters)
            </label>
            <input
              type="number"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="beam" className="block text-sm font-medium text-gray-700 mb-1">
              Beam (meters)
            </label>
            <input
              type="number"
              id="beam"
              name="beam"
              value={formData.beam}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-1">
              Draft (meters)
            </label>
            <input
              type="number"
              id="draft"
              name="draft"
              value={formData.draft}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Docked">Docked</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-900 transition duration-300"
          >
            Register Vessel
          </button>
        </div>
      </form>
    </div>
  );
}
