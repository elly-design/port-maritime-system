// Test script for Maritime Vessel Management System API
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body ? body : undefined
  };

  try {
    const response = await axios(`${BASE_URL}${endpoint}`, options);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { status: 'Error', error: error.message };
  }
}

// Test functions for each endpoint
async function testHomeEndpoint() {
  console.log('\n--- Testing Home Endpoint ---');
  const result = await makeRequest('/');
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

async function testGetAllVessels() {
  console.log('\n--- Testing Get All Vessels ---');
  const result = await makeRequest('/api/vessels');
  console.log('Status:', result.status);
  console.log('Number of vessels:', result.data.length);
  console.log('First vessel:', result.data[0]);
}

async function testGetVesselById() {
  console.log('\n--- Testing Get Vessel By ID ---');
  const result = await makeRequest('/api/vessels/V001');
  console.log('Status:', result.status);
  console.log('Vessel data:', result.data);
}

async function testGetAllCrew() {
  console.log('\n--- Testing Get All Crew ---');
  const result = await makeRequest('/api/crew');
  console.log('Status:', result.status);
  console.log('Number of crew members:', result.data.length);
  console.log('First crew member:', result.data[0]);
}

async function testGetAllVoyages() {
  console.log('\n--- Testing Get All Voyages ---');
  const result = await makeRequest('/api/voyages');
  console.log('Status:', result.status);
  console.log('Number of voyages:', result.data.length);
  console.log('First voyage:', result.data[0]);
}

async function testGetAllMaintenance() {
  console.log('\n--- Testing Get All Maintenance Records ---');
  const result = await makeRequest('/api/maintenance');
  console.log('Status:', result.status);
  console.log('Number of maintenance records:', result.data.length);
  console.log('First maintenance record:', result.data[0]);
}

// Run all tests
async function runAllTests() {
  try {
    await testHomeEndpoint();
    await testGetAllVessels();
    await testGetVesselById();
    await testGetAllCrew();
    await testGetAllVoyages();
    await testGetAllMaintenance();
    
    console.log('\n--- All tests completed ---');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Execute tests
runAllTests();
