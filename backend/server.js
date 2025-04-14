// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // React frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// Mock data - Network locations
const networkLocations = [
  { id: 1, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, status: 'online', devices: 24 },
  { id: 2, name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, status: 'warning', devices: 18 },
  { id: 3, name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, status: 'offline', devices: 15 },
  { id: 4, name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, status: 'online', devices: 22 },
  { id: 5, name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, status: 'online', devices: 30 },
  { id: 6, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, status: 'warning', devices: 17 },
  { id: 7, name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, status: 'online', devices: 28 },
  { id: 8, name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, status: 'offline', devices: 19 },
  { id: 9, name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, status: 'online', devices: 26 },
  { id: 10, name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, status: 'warning', devices: 21 }
];

// Mock data - Network devices by location
const devicesByLocation = {
  1: [ // New York
    { id: 101, name: 'Router NYC-001', type: 'Core Router', status: 'online', ipAddress: '192.168.1.1', lastPing: '12ms' },
    { id: 102, name: 'Switch NYC-002', type: 'Distribution Switch', status: 'online', ipAddress: '192.168.1.2', lastPing: '8ms' },
    { id: 103, name: 'Firewall NYC-003', type: 'Firewall', status: 'online', ipAddress: '192.168.1.3', lastPing: '10ms' }
  ],
  2: [ // Miami
    { id: 201, name: 'Router MIA-001', type: 'Edge Router', status: 'warning', ipAddress: '192.168.2.1', lastPing: '87ms' },
    { id: 202, name: 'Switch MIA-002', type: 'Access Switch', status: 'online', ipAddress: '192.168.2.2', lastPing: '15ms' }
  ],
  3: [ // San Francisco
    { id: 301, name: 'Router SFO-001', type: 'Core Router', status: 'offline', ipAddress: '192.168.3.1', lastPing: 'timeout' },
    { id: 302, name: 'Switch SFO-002', type: 'Distribution Switch', status: 'warning', ipAddress: '192.168.3.2', lastPing: '120ms' }
  ]
  // Add more locations as needed
};

// Mock historical performance data
const historicalData = {
  uptime: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [99.8, 99.9, 99.7, 99.8, 99.9, 99.6]
  },
  responseTime: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [15, 12, 18, 22, 16, 25]
  },
  issues: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [3, 1, 4, 2, 1, 5]
  }
};

// API routes
// Get all network locations
app.get('/api/locations', (req, res) => {
  res.json(networkLocations);
});

// Get specific location by ID
app.get('/api/locations/:id', (req, res) => {
  const location = networkLocations.find(loc => loc.id === parseInt(req.params.id));
  if (!location) return res.status(404).json({ message: 'Location not found' });
  res.json(location);
});

// Get devices for a specific location
app.get('/api/locations/:id/devices', (req, res) => {
  const locationId = parseInt(req.params.id);
  const devices = devicesByLocation[locationId];
  if (!devices) return res.status(404).json({ message: 'Devices not found for this location' });
  res.json(devices);
});

// Run diagnostic on a device
app.post('/api/devices/:id/diagnostic', (req, res) => {
  const deviceId = parseInt(req.params.id);
  
  // Simulate diagnostic results
  setTimeout(() => {
    // Find the device in our mock data
    let foundDevice = null;
    let locationId = null;
    
    // Search through all locations to find the device
    Object.keys(devicesByLocation).forEach(locId => {
      const device = devicesByLocation[locId].find(d => d.id === deviceId);
      if (device) {
        foundDevice = device;
        locationId = parseInt(locId);
      }
    });
    
    if (!foundDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Create diagnostic result based on device status
    const diagnosticResult = {
      deviceId,
      deviceName: foundDevice.name,
      timestamp: new Date().toISOString(),
      status: foundDevice.status,
      locationId,
      locationName: networkLocations.find(loc => loc.id === locationId)?.name || 'Unknown',
      diagnosticDetails: {
        pingTime: foundDevice.lastPing,
        packetLoss: foundDevice.status === 'online' ? '0%' : foundDevice.status === 'warning' ? '15%' : '100%',
        bandwidthUtilization: foundDevice.status === 'online' ? '42%' : foundDevice.status === 'warning' ? '87%' : 'N/A',
        errorRate: foundDevice.status === 'online' ? '0.001%' : foundDevice.status === 'warning' ? '2.3%' : 'N/A'
      },
      recommendations: foundDevice.status !== 'online' ? [
        'Check physical connectivity',
        'Verify power supply',
        'Check for recent configuration changes',
        'Run hardware diagnostic'
      ] : []
    };
    
    res.json(diagnosticResult);
  }, 2000); // Simulate 2-second processing time
});

// Get historical performance data
app.get('/api/stats/historical', (req, res) => {
  res.json(historicalData);
});

// Notification system
// Get active notifications
let notifications = [
  { 
    id: 1, 
    type: 'critical', 
    message: 'Router SFO-001 is offline, security risk detected', 
    locationId: 3, 
    deviceId: 301, 
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  { 
    id: 2, 
    type: 'warning', 
    message: 'Switch MIA-002 experiencing latency spikes', 
    locationId: 2, 
    deviceId: 202, 
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  }
];

// Get all notifications
app.get('/api/notifications', (req, res) => {
    res.json({ message: 'Notifications endpoint' });
});

// Add a new notification
app.post('/api/notifications', (req, res) => {
  const newNotification = {
    id: notifications.length + 1,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  
  notifications.unshift(newNotification);
  res.status(201).json(newNotification);
});

// Mark a notification as read
app.patch('/api/notifications/:id', (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  
  if (notificationIndex === -1) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  notifications[notificationIndex] = { ...notifications[notificationIndex], read: true };
  res.json(notifications[notificationIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`NEO 2.0 API server running on port ${PORT}`);
});