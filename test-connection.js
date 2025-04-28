import http from 'http';

// Test connection to the server
function testConnection(host, port) {
  console.log(`Testing connection to ${host}:${port}...`);
  
  const options = {
    hostname: host,
    port: port,
    path: '/',
    method: 'GET',
    timeout: 5000 // 5 seconds timeout
  };
  
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('RESPONSE BODY:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
      console.log('Connection test SUCCESSFUL');
    });
  });
  
  req.on('error', (e) => {
    console.error(`Connection test FAILED: ${e.message}`);
    if (e.code === 'ECONNREFUSED') {
      console.error('The server is not running or not accessible at this address and port.');
    }
  });
  
  req.on('timeout', () => {
    console.error('Connection test TIMED OUT');
    req.abort();
  });
  
  req.end();
}

// Test localhost on different ports
console.log('==== Testing API Server Connectivity ====');
testConnection('localhost', 5001);
setTimeout(() => testConnection('127.0.0.1', 5001), 2000);
