import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Network, Bell, AlertTriangle, AlertCircle, CheckCircle, Server, ArrowLeft } from 'lucide-react';
import apiService from './services/apiService';

// World map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Extended mock data with 50+ cities
const mockLocations = [
  // North America
  { id: 1, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, status: 'online', devices: 24 },
  { id: 2, name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, status: 'warning', devices: 18 },
  { id: 3, name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, status: 'offline', devices: 15 },
  { id: 4, name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, status: 'online', devices: 22 },
  { id: 5, name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, status: 'online', devices: 31 },
  { id: 6, name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, status: 'online', devices: 19 },
  { id: 7, name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, status: 'warning', devices: 16 },
  { id: 8, name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, status: 'online', devices: 28 },
  { id: 9, name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, status: 'online', devices: 14 },
  { id: 10, name: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970, status: 'warning', devices: 20 },
  { id: 11, name: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, status: 'online', devices: 17 },
  { id: 12, name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, status: 'online', devices: 22 },
  
  // Europe
  { id: 13, name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, status: 'online', devices: 30 },
  { id: 14, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, status: 'warning', devices: 17 },
  { id: 15, name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, status: 'online', devices: 24 },
  { id: 16, name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, status: 'online', devices: 26 },
  { id: 17, name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, status: 'warning', devices: 19 },
  { id: 18, name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, status: 'online', devices: 23 },
  { id: 19, name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, status: 'online', devices: 16 },
  { id: 20, name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, status: 'online', devices: 18 },
  { id: 21, name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, status: 'warning', devices: 15 },
  { id: 22, name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, status: 'online', devices: 14 },
  { id: 23, name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, status: 'online', devices: 17 },
  { id: 24, name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, status: 'online', devices: 13 },
  { id: 25, name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, status: 'offline', devices: 12 },
  
  // Asia
  { id: 26, name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, status: 'online', devices: 28 },
  { id: 27, name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, status: 'online', devices: 26 },
  { id: 28, name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, status: 'online', devices: 25 },
  { id: 29, name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, status: 'warning', devices: 32 },
  { id: 30, name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, status: 'online', devices: 27 },
  { id: 31, name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, status: 'warning', devices: 23 },
  { id: 32, name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, status: 'online', devices: 19 },
  { id: 33, name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, status: 'online', devices: 21 },
  { id: 34, name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, status: 'warning', devices: 17 },
  { id: 35, name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, status: 'online', devices: 16 },
  { id: 36, name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, status: 'online', devices: 18 },
  { id: 37, name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, status: 'offline', devices: 14 },
  
  // Australia/Oceania
  { id: 38, name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, status: 'offline', devices: 19 },
  { id: 39, name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, status: 'online', devices: 18 },
  { id: 40, name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, status: 'online', devices: 15 },
  { id: 41, name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, status: 'warning', devices: 12 },
  { id: 42, name: 'Auckland', country: 'New Zealand', lat: -36.8509, lng: 174.7645, status: 'online', devices: 14 },
  
  // South America
  { id: 43, name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, status: 'warning', devices: 21 },
  { id: 44, name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, status: 'online', devices: 19 },
  { id: 45, name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, status: 'online', devices: 17 },
  { id: 46, name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, status: 'warning', devices: 15 },
  { id: 47, name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721, status: 'online', devices: 16 },
  { id: 48, name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, status: 'online', devices: 14 },
  
  // Africa
  { id: 49, name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, status: 'warning', devices: 18 },
  { id: 50, name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, status: 'online', devices: 20 },
  { id: 51, name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, status: 'offline', devices: 17 },
  { id: 52, name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, status: 'online', devices: 13 },
  { id: 53, name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, status: 'online', devices: 15 },
  { id: 54, name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870, status: 'warning', devices: 11 },
  { id: 55, name: 'Addis Ababa', country: 'Ethiopia', lat: 9.0084, lng: 38.7616, status: 'online', devices: 12 },
  
  // Additional major tech hubs
  { id: 56, name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, status: 'online', devices: 29 },
  { id: 57, name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, status: 'online', devices: 23 },
  { id: 58, name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, status: 'warning', devices: 16 },
  { id: 59, name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, status: 'offline', devices: 27 },
  { id: 60, name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579, status: 'online', devices: 31 }
];

// Extended location details - only for first 10 locations for brevity
const mockLocationDetails = {
  1: { // New York
    devices: [
      { id: 101, name: 'Router NYC-001', type: 'Core Router', status: 'online', ipAddress: '192.168.1.1', lastPing: '12ms' },
      { id: 102, name: 'Switch NYC-002', type: 'Distribution Switch', status: 'online', ipAddress: '192.168.1.2', lastPing: '8ms' }
    ],
    alerts: []
  },
  2: { // Miami
    devices: [
      { id: 201, name: 'Router MIA-001', type: 'Edge Router', status: 'warning', ipAddress: '192.168.2.1', lastPing: '87ms' },
      { id: 202, name: 'Switch MIA-002', type: 'Access Switch', status: 'online', ipAddress: '192.168.2.2', lastPing: '15ms' }
    ],
    alerts: [
      { id: 1, severity: 'warning', message: 'Router MIA-001 experiencing high latency', timestamp: '2025-04-14T14:32:10Z' }
    ]
  },
  3: { // San Francisco
    devices: [
      { id: 301, name: 'Router SFO-001', type: 'Core Router', status: 'offline', ipAddress: '192.168.3.1', lastPing: 'timeout' },
      { id: 302, name: 'Switch SFO-002', type: 'Distribution Switch', status: 'warning', ipAddress: '192.168.3.2', lastPing: '120ms' }
    ],
    alerts: [
      { id: 2, severity: 'critical', message: 'Router SFO-001 is offline, security risk detected', timestamp: '2025-04-14T13:05:22Z' },
      { id: 3, severity: 'warning', message: 'Switch SFO-002 experiencing packet loss', timestamp: '2025-04-14T12:48:17Z' }
    ]
  },
  43: { // São Paulo
    devices: [
      { id: 4301, name: 'Router SAO-001', type: 'Edge Router', status: 'warning', ipAddress: '192.168.43.1', lastPing: '94ms' }
    ],
    alerts: [
      { id: 10, severity: 'warning', message: 'High traffic detected on SAO-001', timestamp: '2025-04-14T10:15:22Z' }
    ]
  }
};

// Generate some standard details for other locations
for (let i = 4; i <= 60; i++) {
  if (!mockLocationDetails[i]) {
    const location = mockLocations.find(loc => loc.id === i);
    if (location) {
      const devices = [];
      const alerts = [];
      
      // Add 1-3 devices per location
      const deviceCount = Math.floor(Math.random() * 3) + 1;
      for (let d = 1; d <= deviceCount; d++) {
        const deviceType = ['Core Router', 'Edge Router', 'Distribution Switch', 'Access Switch', 'Firewall'][Math.floor(Math.random() * 5)];
        const deviceStatus = Math.random() > 0.7 ? location.status : 'online';
        const pingTime = deviceStatus === 'online' ? `${Math.floor(Math.random() * 20) + 5}ms` : 
                          deviceStatus === 'warning' ? `${Math.floor(Math.random() * 70) + 50}ms` : 'timeout';
        
        devices.push({
          id: i * 100 + d,
          name: `Router ${location.name.substring(0, 3).toUpperCase()}-${d.toString().padStart(3, '0')}`,
          type: deviceType,
          status: deviceStatus,
          ipAddress: `192.168.${i}.${d}`,
          lastPing: pingTime
        });
      }
      
      // Add 0-2 alerts per location based on status
      if (location.status !== 'online') {
        const alertCount = Math.floor(Math.random() * 2) + 1;
        for (let a = 1; a <= alertCount; a++) {
          const severity = location.status === 'warning' ? 'warning' : 'critical';
          const messages = [
            'High latency detected',
            'Intermittent connectivity issues',
            'Bandwidth utilization above threshold',
            'Device experiencing packet loss',
            'Connection timeout detected',
            'Unusual traffic pattern detected'
          ];
          
          alerts.push({
            id: i * 10 + a,
            severity: severity,
            message: `${messages[Math.floor(Math.random() * messages.length)]} on ${devices[0]?.name || 'network device'}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString() // Random time in last 24h
          });
        }
      }
      
      mockLocationDetails[i] = { devices, alerts };
    }
  }
}

// Simple Map Globe Component with hover tooltips
const SimpleMapGlobe = ({ locations = [], onLocationSelect }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 180 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F5F5F5" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
        
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinates={[location.lng, location.lat]}
            onClick={() => onLocationSelect(location)}
            onMouseEnter={() => setHoveredLocation(location)}
            onMouseLeave={() => setHoveredLocation(null)}
          >
            <circle
              r={5}
              fill={
                location.status === "online" ? "#10B981" :
                location.status === "warning" ? "#F59E0B" : "#EF4444"
              }
              stroke="#fff"
              strokeWidth={2}
              style={{ 
                cursor: 'pointer',
                transition: 'r 0.2s',
                r: hoveredLocation?.id === location.id ? 7 : 5
              }}
            />
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Tooltip */}
      {hoveredLocation && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          padding: '10px',
          zIndex: 1000,
          maxWidth: '220px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{hoveredLocation.name}</h3>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: hoveredLocation.status === "online" ? "#10B981" :
                               hoveredLocation.status === "warning" ? "#F59E0B" : "#EF4444"
            }}></span>
          </div>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6B7280' }}>{hoveredLocation.country}</p>
          <p style={{ margin: 0, fontSize: '13px' }}>Devices: <strong>{hoveredLocation.devices}</strong></p>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px' }}>Status: <strong>{hoveredLocation.status.charAt(0).toUpperCase() + hoveredLocation.status.slice(1)}</strong></p>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '5px' }}>Click for details</div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [locations, setLocations] = useState(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const locationsData = await apiService.getNetworkLocations();
        if (locationsData && locationsData.length > 0) {
          setLocations(locationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch location details when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      setLocationDetails(mockLocationDetails[selectedLocation.id] || {
        devices: [],
        alerts: []
      });
    } else {
      setLocationDetails(null);
    }
  }, [selectedLocation]);

  const getStatusStyle = (status) => {
    if (status === 'online') return { icon: <CheckCircle style={{marginRight: '4px'}} size={12} />, style: { backgroundColor: '#D1FAE5', color: '#065F46' } };
    if (status === 'warning') return { icon: <AlertTriangle style={{marginRight: '4px'}} size={12} />, style: { backgroundColor: '#FEF3C7', color: '#92400E' } };
    return { icon: <AlertCircle style={{marginRight: '4px'}} size={12} />, style: { backgroundColor: '#FEE2E2', color: '#991B1B' } };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #EEF2FF, #E0E7FF)' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, #1E40AF, #3730A3)', color: 'white', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Network size={28} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>NEO 2.0</h1>
            <p style={{ color: '#BFDBFE', fontSize: '14px', margin: 0 }}>Global Network Monitoring</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main Content Area */}
        <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Map Area */}
          <div style={{ flex: 1 }}>
            <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                {loading ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', width: '48px', height: '48px', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ marginTop: '16px', color: '#6B7280' }}>Loading network data...</p>
                    </div>
                  </div>
                ) : (
                  <SimpleMapGlobe 
                    locations={locations}
                    onLocationSelect={setSelectedLocation}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Location Details Panel */}
          {selectedLocation && (
            <div style={{ width: '200px', backgroundColor: 'white', borderLeft: '1px solid #E5E7EB', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', background: 'linear-gradient(to right, #EBF5FF, #EEF2FF)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', color: '#1F2937', fontSize: '18px', margin: 0 }}>{selectedLocation.name}</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0 0' }}>{selectedLocation.country}</p>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getStatusStyle(selectedLocation.status).style
                  }}>
                    {getStatusStyle(selectedLocation.status).icon}
                    {selectedLocation.status.charAt(0).toUpperCase() + selectedLocation.status.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '14px', color: '#6B7280' }}>
                  <Network size={14} style={{ marginRight: '4px', color: '#3B82F6' }} />
                  <span>{selectedLocation.devices} devices monitored</span>
                </div>
              </div>
              
              <div style={{ flex: 1, overflow: 'auto' }}>
                {/* Devices Section */}
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                    <Server size={16} style={{ marginRight: '8px', color: '#2563EB' }} />
                    Network Devices
                  </h4>
                  {locationDetails?.devices && locationDetails.devices.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {locationDetails.devices.map(device => (
                        <div key={device.id} style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '14px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} 
                             onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}
                             onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'; }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '500', color: '#111827' }}>{device.name}</span>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '500',
                              ...getStatusStyle(device.status).style
                            }}>
                              {getStatusStyle(device.status).icon}
                              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                            </span>
                          </div>
                          <div style={{ color: '#6B7280', marginTop: '4px', fontSize: '12px' }}>
                            <div style={{ marginBottom: '2px' }}>
                              <span style={{ color: '#9CA3AF', marginRight: '4px' }}>Type:</span> {device.type}
                            </div>
                            <div style={{ marginBottom: '2px' }}>
                              <span style={{ color: '#9CA3AF', marginRight: '4px' }}>IP:</span> {device.ipAddress}
                            </div>
                            <div>
                              <span style={{ color: '#9CA3AF', marginRight: '4px' }}>Ping:</span> 
                              <span style={{
                                color: device.lastPing === 'timeout' ? '#DC2626' : 
                                       parseInt(device.lastPing) > 50 ? '#D97706' : '#059669',
                                fontWeight: '500'
                              }}>
                                {device.lastPing}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                      <Server size={24} style={{ margin: '0 auto 8px auto', color: '#D1D5DB' }} />
                      <p style={{ color: '#6B7280', fontSize: '14px' }}>No device information available</p>
                    </div>
                  )}
                </div>
                
                {/* Alerts Section */}
                <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6' }}>
                  <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                    <Bell size={16} style={{ marginRight: '8px', color: '#2563EB' }} />
                    Recent Alerts
                  </h4>
                  {locationDetails?.alerts && locationDetails.alerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {locationDetails.alerts.map(alert => (
                        <div 
                          key={alert.id} 
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: '4px solid',
                            borderLeftColor: alert.severity === 'critical' ? '#EF4444' : '#F59E0B',
                            background: `linear-gradient(to right, ${alert.severity === 'critical' ? '#FEF2F2' : '#FFFBEB'}, white)`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            {alert.severity === 'critical' 
                              ? <AlertCircle size={16} style={{ color: '#EF4444', marginTop: '2px', marginRight: '8px', flexShrink: 0 }} /> 
                              : <AlertTriangle size={16} style={{ color: '#F59E0B', marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                            }
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{alert.message}</p>
                              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                      <Bell size={24} style={{ margin: '0 auto 8px auto', color: '#D1D5DB' }} />
                      <p style={{ color: '#6B7280', fontSize: '14px' }}>No alerts for this location</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Close button */}
              <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                  Back to Map
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Status Bar */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white', padding: '8px 16px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ marginRight: '16px' }}>Online: <span style={{ fontWeight: '600', color: '#10B981' }}>
              {locations.filter(loc => loc.status === 'online').reduce((sum, loc) => sum + loc.devices, 0)}
            </span></span>
            <span style={{ marginRight: '16px' }}>Warning: <span style={{ fontWeight: '600', color: '#F59E0B' }}>
              {locations.filter(loc => loc.status === 'warning').reduce((sum, loc) => sum + loc.devices, 0)}
            </span></span>
            <span>Critical: <span style={{ fontWeight: '600', color: '#EF4444' }}>
              {locations.filter(loc => loc.status === 'offline').reduce((sum, loc) => sum + loc.devices, 0)}
            </span></span>
          </div>
          <div>
            Last updated: <span style={{ fontFamily: 'monospace' }}>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;