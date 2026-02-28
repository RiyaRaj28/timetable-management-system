/**
 * Manual test script for room endpoints
 * Run with: node test-rooms.js
 * 
 * Prerequisites:
 * - MongoDB must be running
 * - Server must be running on port 5000
 */

const testRoomEndpoints = async () => {
  const BASE_URL = 'http://localhost:5000/api/rooms';
  
  console.log('Testing Room Management Endpoints\n');
  console.log('='.repeat(50));
  
  try {
    // Test 1: GET /api/rooms (should return empty array initially)
    console.log('\n1. Testing GET /api/rooms');
    let response = await fetch(BASE_URL);
    let rooms = await response.json();
    console.log('Status:', response.status);
    console.log('Initial rooms:', rooms);
    
    // Test 2: POST /api/rooms (create a new room)
    console.log('\n2. Testing POST /api/rooms - Create Room A101');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'Room A101' })
    });
    let newRoom = await response.json();
    console.log('Status:', response.status);
    console.log('Created room:', newRoom);
    
    // Test 3: POST /api/rooms (create another room)
    console.log('\n3. Testing POST /api/rooms - Create Room B202');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'Room B202' })
    });
    newRoom = await response.json();
    console.log('Status:', response.status);
    console.log('Created room:', newRoom);
    
    // Test 4: GET /api/rooms (should return 2 rooms)
    console.log('\n4. Testing GET /api/rooms - List all rooms');
    response = await fetch(BASE_URL);
    rooms = await response.json();
    console.log('Status:', response.status);
    console.log('All rooms:', rooms);
    
    // Test 5: POST /api/rooms (duplicate room - should fail)
    console.log('\n5. Testing POST /api/rooms - Duplicate room (should fail)');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'Room A101' })
    });
    let error = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', error.message);
    
    // Test 6: POST /api/rooms (empty room name - should fail)
    console.log('\n6. Testing POST /api/rooms - Empty room name (should fail)');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: '' })
    });
    error = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', error.message);
    
    console.log('\n' + '='.repeat(50));
    console.log('All tests completed!');
    
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. MongoDB is running');
    console.log('2. Server is running (npm run dev in server directory)');
  }
};

testRoomEndpoints();
