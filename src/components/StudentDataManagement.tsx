import React, { useState } from 'react';

interface Student {
  id: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  batch: string;
  status: string;
}

export default function StudentDataManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    id: '',
    fullName: '',
    gender: '',
    phoneNumber: '',
    batch: '',
    status: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!formData.id) return;
    
    const newStudent = { ...formData };
    setStudents(prev => [...prev, newStudent]);
    handleClear();
  };

  const handleDelete = () => {
    if (!selectedStudent) return;
    
    setStudents(prev => prev.filter(student => student.id !== selectedStudent.id));
    handleClear();
  };

  const handleUpdate = () => {
    if (!selectedStudent || !formData.id) return;
    
    setStudents(prev => 
      prev.map(student => 
        student.id === selectedStudent.id ? formData : student
      )
    );
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      id: '',
      fullName: '',
      gender: '',
      phoneNumber: '',
      batch: '',
      status: ''
    });
    setSelectedStudent(null);
  };

  const handleImport = () => {
    // This would typically handle file import functionality
    console.log('Import functionality');
    
    // For demo purposes, let's add some sample data
    const sampleData: Student[] = [
      { id: 'STD001', fullName: 'John Doe', gender: 'Male', phoneNumber: '123-456-7890', batch: '2023A', status: 'Active' },
      { id: 'STD002', fullName: 'Jane Smith', gender: 'Female', phoneNumber: '987-654-3210', batch: '2023B', status: 'Active' },
    ];
    
    setStudents(prev => [...prev, ...sampleData]);
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData(student);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-4">Student's Data</h1>
      
      {/* Student Data Display Area */}
      <div className="mb-6 bg-gray-200 rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
        {students.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Gender</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Batch</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr 
                  key={student.id} 
                  className={`hover:bg-gray-100 cursor-pointer ${selectedStudent?.id === student.id ? 'bg-blue-100' : ''}`}
                  onClick={() => selectStudent(student)}
                >
                  <td className="p-2">{student.id}</td>
                  <td className="p-2">{student.fullName}</td>
                  <td className="p-2">{student.gender}</td>
                  <td className="p-2">{student.phoneNumber}</td>
                  <td className="p-2">{student.batch}</td>
                  <td className="p-2">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-10">No student data available</div>
        )}
      </div>
      
      {/* Form Fields */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">STUDENT ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
        
        <div className="row-span-3">
          {/* This would typically be an image upload area */}
          <div className="h-full bg-gray-200 rounded flex items-center justify-center">
            <button 
              onClick={handleImport}
              className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-900"
            >
              Import
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 rounded"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={handleAdd}
          className="flex-1 bg-indigo-800 text-white py-2 rounded hover:bg-indigo-900"
        >
          ADD
        </button>
        
        <button 
          onClick={handleDelete}
          className="flex-1 bg-indigo-800 text-white py-2 rounded hover:bg-indigo-900"
        >
          Delete
        </button>
        
        <button 
          onClick={handleUpdate}
          className="flex-1 bg-indigo-800 text-white py-2 rounded hover:bg-indigo-900"
        >
          Update
        </button>
        
        <button 
          onClick={handleClear}
          className="flex-1 bg-indigo-800 text-white py-2 rounded hover:bg-indigo-900"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
