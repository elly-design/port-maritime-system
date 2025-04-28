import React, { useState, useEffect } from 'react';

interface Maintenance {
  _id: string;
  maintenanceId: string;
  vessel: {
    _id: string;
    vesselId: string;
    name: string;
  };
  type: string;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  assignedTechnicians: string[];
  parts: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  totalCost: number;
  notes: string;
}

interface Vessel {
  _id: string;
  vesselId: string;
  name: string;
}

export default function MaintenanceSchedule() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [isAddingMaintenance, setIsAddingMaintenance] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    maintenanceId: '',
    vessel: '',
    type: 'Routine',
    description: '',
    scheduledDate: '',
    status: 'Scheduled',
    assignedTechnicians: '',
    notes: ''
  });

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchVessels();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/maintenance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance records');
      }
      
      const data = await response.json();
      setMaintenanceRecords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      setError('Failed to load maintenance records. Please try again later.');
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
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maintenanceId: formData.maintenanceId,
          vessel: formData.vessel,
          type: formData.type,
          description: formData.description,
          scheduledDate: new Date(formData.scheduledDate),
          status: formData.status,
          assignedTechnicians: formData.assignedTechnicians.split(',').map(tech => tech.trim()),
          parts: [],
          totalCost: 0,
          notes: formData.notes
        }),
      });

      if (response.ok) {
        alert('Maintenance record added successfully!');
        fetchMaintenanceRecords();
        setIsAddingMaintenance(false);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to add maintenance record: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      alert('Failed to add maintenance record. Please try again.');
    }
  };

  const handleUpdateMaintenanceStatus = async (maintenanceId: string, newStatus: string) => {
    try {
      const completedDate = newStatus === 'Completed' ? new Date() : undefined;
      
      const response = await fetch(`/api/maintenance/${maintenanceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          completedDate
        }),
      });
      
      if (response.ok) {
        setMaintenanceRecords(maintenanceRecords.map(record => 
          record.maintenanceId === maintenanceId 
            ? { 
                ...record, 
                status: newStatus,
                completedDate: completedDate ? completedDate.toISOString() : record.completedDate
              } 
            : record
        ));
        
        if (selectedMaintenance?.maintenanceId === maintenanceId) {
          setSelectedMaintenance({ 
            ...selectedMaintenance, 
            status: newStatus,
            completedDate: completedDate ? completedDate.toISOString() : selectedMaintenance.completedDate
          });
        }
        
        alert('Maintenance status updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update maintenance status: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      alert('Failed to update maintenance status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      maintenanceId: '',
      vessel: '',
      type: 'Routine',
      description: '',
      scheduledDate: '',
      status: 'Scheduled',
      assignedTechnicians: '',
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
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

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'Routine':
        return 'bg-green-100 text-green-800';
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Inspection':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMaintenanceRecords = filterStatus 
    ? maintenanceRecords.filter(record => record.status === filterStatus)
    : maintenanceRecords;

  const sortedMaintenanceRecords = [...filteredMaintenanceRecords].sort((a, b) => {
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Maintenance Schedule</h1>
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => {
              setIsAddingMaintenance(!isAddingMaintenance);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            {isAddingMaintenance ? 'Cancel' : 'Add Maintenance'}
          </button>
        </div>
      </div>

      {isAddingMaintenance && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Maintenance Record</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance ID
                </label>
                <input
                  type="text"
                  name="maintenanceId"
                  value={formData.maintenanceId}
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
                  Maintenance Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="Routine">Routine</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Technicians (comma-separated)
                </label>
                <input
                  type="text"
                  name="assignedTechnicians"
                  value={formData.assignedTechnicians}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="John Doe, Jane Smith"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
              >
                Add Maintenance Record
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading maintenance records...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchMaintenanceRecords}
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
                      ID / Vessel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Date
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
                  {sortedMaintenanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No maintenance records found
                      </td>
                    </tr>
                  ) : (
                    sortedMaintenanceRecords.map((record) => (
                      <tr 
                        key={record._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedMaintenance?._id === record._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedMaintenance(record)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.maintenanceId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.vessel.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceTypeColor(record.type)}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(record.scheduledDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(record.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <select
                            value={record.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdateMaintenanceStatus(record.maintenanceId, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            {selectedMaintenance ? (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Maintenance Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedMaintenance.maintenanceId}
                    </h3>
                    <p className="text-gray-600">Vessel: {selectedMaintenance.vessel.name}</p>
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceTypeColor(selectedMaintenance.type)}`}>
                      {selectedMaintenance.type}
                    </span>
                    <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedMaintenance.status)}">
                      {selectedMaintenance.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{selectedMaintenance.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Date</p>
                      <p>{new Date(selectedMaintenance.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    
                    {selectedMaintenance.completedDate && (
                      <div>
                        <p className="text-sm text-gray-500">Completed Date</p>
                        <p>{new Date(selectedMaintenance.completedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Assigned Technicians</p>
                    {selectedMaintenance.assignedTechnicians.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {selectedMaintenance.assignedTechnicians.map((tech, index) => (
                          <li key={index}>{tech}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No technicians assigned</p>
                    )}
                  </div>
                  
                  {selectedMaintenance.parts && selectedMaintenance.parts.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Parts</p>
                      <table className="min-w-full divide-y divide-gray-200 mt-1">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                              Part
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                              Qty
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                              Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedMaintenance.parts.map((part, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{part.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{part.quantity}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">${part.cost.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="font-semibold">${selectedMaintenance.totalCost.toFixed(2)}</p>
                  </div>
                  
                  {selectedMaintenance.notes && (
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="mt-1">{selectedMaintenance.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-[200px]">
                <p className="text-gray-500">Select a maintenance record to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
