const http = require('http');

const PORT = 3000;
const URL = `http://localhost:${PORT}/api/admin/diagnostics`;

async function makeRequest(headers) {
  return new Promise((resolve, reject) => {
    const req = http.request(URL, {
      method: 'GET',
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log("Starting diagnostics authorization tests...");
  
  // Test 1: No passcode
  console.log("\nTest 1: Request with no passcode...");
  try {
    const res = await makeRequest({});
    console.log(`Result: Status ${res.status}`);
    if (res.status === 401) {
      console.log("✅ Passed (Received 401 Unauthorized)");
    } else {
      console.error(`❌ Failed: Expected 401 but got ${res.status}`);
    }
  } catch (err) {
    console.error("❌ Request Error:", err.message);
  }

  // Test 2: Incorrect passcode
  console.log("\nTest 2: Request with incorrect passcode...");
  try {
    const res = await makeRequest({ 'x-admin-passcode': 'wrong-passcode' });
    console.log(`Result: Status ${res.status}`);
    if (res.status === 401) {
      console.log("✅ Passed (Received 401 Unauthorized)");
    } else {
      console.error(`❌ Failed: Expected 401 but got ${res.status}`);
    }
  } catch (err) {
    console.error("❌ Request Error:", err.message);
  }

  // Test 3: Old default passcode fallback (should be rejected!)
  console.log("\nTest 3: Request with old default passcode 'nd3-admin'...");
  try {
    const res = await makeRequest({ 'x-admin-passcode': 'nd3-admin' });
    console.log(`Result: Status ${res.status}`);
    if (res.status === 401) {
      console.log("✅ Passed (Received 401 Unauthorized - fallback is disabled)");
    } else {
      console.error(`❌ Failed: Expected 401 but got ${res.status} (Fallback still active!)`);
    }
  } catch (err) {
    console.error("❌ Request Error:", err.message);
  }

  // Test 4: Correct passcode (when env is set)
  const expectedPasscode = process.env.TEST_COMMAND_CENTRE_PASSWORD;
  if (expectedPasscode) {
    console.log(`\nTest 4: Request with correct passcode '${expectedPasscode}'...`);
    try {
      const res = await makeRequest({ 'x-admin-passcode': expectedPasscode });
      console.log(`Result: Status ${res.status}`);
      if (res.status === 200) {
        console.log("✅ Passed (Received 200 OK)");
      } else {
        console.error(`❌ Failed: Expected 200 but got ${res.status}. Body: ${res.body}`);
      }
    } catch (err) {
      console.error("❌ Request Error:", err.message);
    }
  } else {
    console.log("\nSkipping Test 4 (TEST_COMMAND_CENTRE_PASSWORD is not set in test environment).");
  }
}

// Check if server is reachable first
const req = http.request(`http://localhost:${PORT}/`, { method: 'GET' }, (res) => {
  runTests();
});
req.on('error', (err) => {
  console.error(`Error: Local dev server not running on port ${PORT}. Please run 'npm run dev' first.`);
  process.exit(1);
});
req.end();
