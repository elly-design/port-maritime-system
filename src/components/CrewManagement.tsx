import React, { useState, useEffect } from 'react';

interface Crew {
  _id: string;
  crewId: string;
  firstName: string;
  lastName: string;
  position: string;
  nationality: string;
  licenseNumber: string;
  licenseExpiry: string;
  contactNumber: string;
  email: string;
  status: string;
  currentVessel?: {
    _id: string;
    vesselId: string;
    name: string;
  };
  certifications: {
    name: string;
    issuedDate: string;
    expiryDate: string;
  }[];
  joinDate: string;
  contractEndDate: string;
}

interface Vessel {
  _id: string;
  vesselId: string;
  name: string;
}

export default function CrewManagement() {
  const [crew, setCrew] = useState<Crew[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [isAddingCrew, setIsAddingCrew] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    crewId: '',
    firstName: '',
    lastName: '',
    position: '',
    nationality: '',
    licenseNumber: '',
    licenseExpiry: '',
    contactNumber: '',
    email: '',
    status: 'Active',
    currentVessel: '',
    joinDate: '',
    contractEndDate: ''
  });

  useEffect(() => {
    fetchCrew();
    fetchVessels();
  }, []);

  const fetchCrew = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crew');
      
      if (!response.ok) {
        throw new Error('Failed to fetch crew data');
      }
      
      const data = await response.json();
      setCrew(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crew:', error);
      setError('Failed to load crew data. Please try again later.');
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
      const response = await fetch('/api/crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          certifications: [],
          dateOfBirth: new Date()
        }),
      });

      if (response.ok) {
        alert('Crew member added successfully!');
        fetchCrew();
        setIsAddingCrew(false);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to add crew member: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding crew member:', error);
      alert('Failed to add crew member. Please try again.');
    }
  };

  const handleDeleteCrew = async (crewId: string) => {
    if (!confirm('Are you sure you want to delete this crew member?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/crew/${crewId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCrew(crew.filter(c => c.crewId !== crewId));
        if (selectedCrew?.crewId === crewId) {
          setSelectedCrew(null);
        }
        alert('Crew member deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete crew member: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting crew member:', error);
      alert('Failed to delete crew member. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      crewId: '',
      firstName: '',
      lastName: '',
      position: '',
      nationality: '',
      licenseNumber: '',
      licenseExpiry: '',
      contactNumber: '',
      email: '',
      status: 'Active',
      currentVessel: '',
      joinDate: '',
      contractEndDate: ''
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Crew Management</h1>
        <button
          onClick={() => {
            setIsAddingCrew(!isAddingCrew);
            resetForm();
          }}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          {isAddingCrew ? 'Cancel' : 'Add Crew Member'}
        </button>
      </div>

      {isAddingCrew && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Crew Member</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew ID
                </label>
                <input
                  type="text"
                  name="crewId"
                  value={formData.crewId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Training">Training</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Vessel
                </label>
                <select
                  name="currentVessel"
                  value={formData.currentVessel}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">None</option>
                  {vessels.map((vessel) => (
                    <option key={vessel._id} value={vessel._id}>
                      {vessel.name} ({vessel.vesselId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract End Date
                </label>
                <input
                  type="date"
                  name="contractEndDate"
                  value={formData.contractEndDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
              >
                Add Crew Member
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading crew data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchCrew}
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vessel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crew.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No crew members found
                      </td>
                    </tr>
                  ) : (
                    crew.map((crewMember) => (
                      <tr 
                        key={crewMember._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedCrew?._id === crewMember._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCrew(crewMember)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {crewMember.firstName} {crewMember.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {crewMember.crewId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{crewMember.position}</div>
                          <div className="text-sm text-gray-500">{crewMember.nationality}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {crewMember.currentVessel ? crewMember.currentVessel.name : 'Not Assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            crewMember.status === 'Active' ? 'bg-green-100 text-green-800' :
                            crewMember.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                            crewMember.status === 'Training' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {crewMember.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCrew(crewMember.crewId);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            {selectedCrew && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Crew Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedCrew.firstName} {selectedCrew.lastName}
                    </h3>
                    <p className="text-gray-600">ID: {selectedCrew.crewId}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p>{selectedCrew.position}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p>{selectedCrew.nationality}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">License</p>
                      <p>{selectedCrew.licenseNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">License Expiry</p>
                      <p>{new Date(selectedCrew.licenseExpiry).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p>{selectedCrew.contactNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{selectedCrew.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p>{new Date(selectedCrew.joinDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Contract End</p>
                      <p>{new Date(selectedCrew.contractEndDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Assigned Vessel</p>
                    <p>{selectedCrew.currentVessel ? selectedCrew.currentVessel.name : 'Not Assigned'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Certifications</p>
                    {selectedCrew.certifications && selectedCrew.certifications.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {selectedCrew.certifications.map((cert, index) => (
                          <li key={index}>
                            {cert.name} (Expires: {new Date(cert.expiryDate).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No certifications</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
