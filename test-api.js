// Simple API test script
const http = require('http');

// Test data
const testData = {
  roadmap: { skill: 'web development' },
  job: { role: 'frontend developer' }
};

// Helper function to make POST request
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          console.log(`✅ ${path} - Status: ${res.statusCode}`);
          console.log(`Response:`, JSON.stringify(response, null, 2));
          resolve(response);
        } catch (error) {
          console.log(`❌ ${path} - Invalid JSON response`);
          console.log('Raw response:', body);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path} - Request failed:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🚀 Testing API endpoints...\n');
  
  try {
    // Test roadmap endpoint
    await makeRequest('/roadmap', testData.roadmap);
    console.log('');
    
    // Test job endpoint
    await makeRequest('/job', testData.job);
    console.log('');
    
    // Test health endpoint
    await makeRequest('/health', {});
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.log('\n❌ Tests failed. Make sure the server is running on port 3000.');
  }
}

runTests();
