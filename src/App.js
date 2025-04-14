import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Network, Bell, AlertTriangle, AlertCircle, CheckCircle, Server, ArrowLeft, Brain } from 'lucide-react';
import apiService from './services/apiService';
import AiInsightsSidebar from './components/AiInsightsSidebar';
import PredictiveHeatmap from './components/PredictiveHeatmap';

// Import the Lumen logo SVG
import lumenLogo from './lumen.svg';

// Use the image in a component
const LumenLogo = () => (
  <img src={lumenLogo} alt="Lumen Technologies" style={{ height: '28px', marginRight: '30px' }} />
);

// World map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Set of test locations covering all continents - exactly 20 visible cities
const mockLocations = [
  // North America
  { id: 1, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, status: 'online', devices: 4 },
  { id: 2, name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, status: 'warning', devices: 3 },
  { id: 3, name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, status: 'online', devices: 4 },
  { id: 4, name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, status: 'offline', devices: 3 },
  
  // Europe
  { id: 5, name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, status: 'online', devices: 4 },
  { id: 6, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, status: 'warning', devices: 3 },
  { id: 7, name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, status: 'online', devices: 4 },
  { id: 8, name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, status: 'offline', devices: 3 },
  
  // Asia
  { id: 9, name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, status: 'online', devices: 4 },
  { id: 10, name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, status: 'warning', devices: 3 },
  { id: 11, name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, status: 'offline', devices: 4 },
  { id: 12, name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, status: 'online', devices: 3 },
  
  // Australia/Oceania
  { id: 13, name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, status: 'warning', devices: 4 },
  { id: 14, name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, status: 'online', devices: 3 },
  
  // South America
  { id: 15, name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, status: 'warning', devices: 4 },
  { id: 16, name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, status: 'online', devices: 3 },
  
  // Africa
  { id: 17, name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, status: 'offline', devices: 4 },
  { id: 18, name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, status: 'online', devices: 3 },
  { id: 19, name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, status: 'warning', devices: 4 },
  { id: 20, name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, status: 'online', devices: 3 }
];

// Create detailed device and alert data for all cities
const mockLocationDetails = {};

// Define device types and status messages for random generation
const deviceTypes = ['Core Router', 'Edge Router', 'Distribution Switch', 'Access Switch', 'Firewall'];
const alertMessages = [
  'High latency detected',
  'Intermittent connectivity issues',
  'Bandwidth utilization above threshold',
  'Device experiencing packet loss',
  'Connection timeout detected',
  'Unusual traffic pattern detected'
];

// Generate device and alert data for all locations
for (let i = 0; i < mockLocations.length; i++) {
  const location = mockLocations[i];
  const devices = [];
  const alerts = [];
  
  // Add 3-4 devices per location with different statuses
  const deviceCount = location.devices; // Already set to 3 or 4 in mockLocations
  const statuses = ['online', 'warning', 'offline', 'online']; // Ensure mix of statuses
  
  for (let d = 1; d <= deviceCount; d++) {
    // Cycle through statuses to ensure each location has mixed device statuses
    const deviceStatus = statuses[d % statuses.length];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const pingTime = deviceStatus === 'online' ? `${Math.floor(Math.random() * 20) + 5}ms` : 
                    deviceStatus === 'warning' ? `${Math.floor(Math.random() * 70) + 50}ms` : 'timeout';
    
    devices.push({
      id: location.id * 100 + d,
      name: `Router ${location.name.substring(0, 3).toUpperCase()}-${d.toString().padStart(3, '0')}`,
      type: deviceType,
      status: deviceStatus,
      ipAddress: `192.168.${location.id}.${d}`,
      lastPing: pingTime
    });
    
    // Create alerts for non-online devices
    if (deviceStatus !== 'online') {
      alerts.push({
        id: location.id * 100 + d,
        severity: deviceStatus === 'warning' ? 'warning' : 'critical',
        message: `${alertMessages[Math.floor(Math.random() * alertMessages.length)]} on Router ${location.name.substring(0, 3).toUpperCase()}-${d.toString().padStart(3, '0')}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString() // Random time in last 24h
      });
    }
  }
  
  mockLocationDetails[location.id] = { devices, alerts };
}

// Add some special cases for demonstration
mockLocationDetails[1] = { // New York
  devices: [
    { id: 101, name: 'Router NYC-001', type: 'Core Router', status: 'online', ipAddress: '192.168.1.1', lastPing: '12ms' },
    { id: 102, name: 'Switch NYC-002', type: 'Distribution Switch', status: 'online', ipAddress: '192.168.1.2', lastPing: '8ms' },
    { id: 103, name: 'Firewall NYC-003', type: 'Firewall', status: 'warning', ipAddress: '192.168.1.3', lastPing: '67ms' },
    { id: 104, name: 'Router NYC-004', type: 'Edge Router', status: 'offline', ipAddress: '192.168.1.4', lastPing: 'timeout' }
  ],
  alerts: [
    { id: 103, severity: 'warning', message: 'High latency detected on Firewall NYC-003', timestamp: '2025-04-14T15:32:10Z' },
    { id: 104, severity: 'critical', message: 'Connection timeout detected on Router NYC-004', timestamp: '2025-04-14T14:18:42Z' }
  ]
};

// Simple Map Globe Component with hover tooltips
const SimpleMapGlobe = ({ locations = [], onLocationSelect }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  
  // Debug function to log clicks
  const handleLocationClick = (location) => {
    console.log(`Clicked on ${location.name} (ID: ${location.id})`);
    onLocationSelect(location);
  };
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 210 }}
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
            onClick={() => handleLocationClick(location)}
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
                transition: 'all 0.2s'
              }}
              opacity={hoveredLocation?.id === location.id ? 1 : 0.9}
              transform={hoveredLocation?.id === location.id ? "scale(1.3)" : "scale(1)"}
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
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to get data from API, but if it fails, use mock data
        try {
          const locationsData = await apiService.getNetworkLocations();
          if (locationsData && locationsData.length > 0) {
            setLocations(locationsData);
          }
        } catch (apiError) {
          console.log("Using mock data as API is not available");
          // Keep using mockLocations which is already set as default
        }
      } catch (error) {
        console.error('Error in data loading process:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch location details when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      console.log("Selected location:", selectedLocation.name, "ID:", selectedLocation.id);
      const details = mockLocationDetails[selectedLocation.id];
      console.log("Location details found:", details ? "Yes" : "No");
      setLocationDetails(details || {
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
      {/* Header with Lumen Logo */}
      <header style={{ 
        background: 'linear-gradient(to right, white 220px, #00B2E3 400px)',
        padding: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo on the left */}
          <div style={{ marginLeft: '12px' }}>
            <LumenLogo />
          </div>
          
          {/* NEO 2.0 section on the far right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '20px' }}>
            <Network size={28} style={{ color: 'white' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'white' }}>NEO <span style={{ fontWeight: '200' }}>Mind</span></h1>
              <p style={{ color: 'white', fontSize: '11px', fontWeight: '600', margin: 0 }}>Global Network Monitoring</p>
            </div>
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginBottom: '8px' 
              }}>
                <button 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  style={{
                    backgroundColor: showHeatmap ? '#00B2E3' : 'white',
                    color: showHeatmap ? 'white' : '#333',
                    border: '1px solid #00B2E3',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <Brain size={16} />
                  {showHeatmap ? 'Hide AI Predictions' : 'Show AI Predictions'}
                </button>
              </div>
              
              <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', position: 'relative' }}>
                {loading ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', width: '48px', height: '48px', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ marginTop: '16px', color: '#6B7280' }}>Loading network data...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <SimpleMapGlobe 
                      locations={locations}
                      onLocationSelect={setSelectedLocation}
                    />
                    <PredictiveHeatmap 
                      visible={showHeatmap} 
                      locations={locations} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Location Details Panel */}
          {selectedLocation && (
            <div style={{ width: '320px', backgroundColor: 'white', borderLeft: '1px solid #E5E7EB', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
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
                {/* AI Insights Section */}
                <div style={{ padding: '16px' }}>
                  <AiInsightsSidebar location={selectedLocation} />
                </div>
                
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
              {locations.filter(loc => loc.status === 'online').length} locations /
              {locations.reduce((sum, loc) => {
                const details = mockLocationDetails[loc.id];
                return sum + (details ? details.devices.filter(d => d.status === 'online').length : 0);
              }, 0)} devices
            </span></span>
            <span style={{ marginRight: '16px' }}>Warning: <span style={{ fontWeight: '600', color: '#F59E0B' }}>
              {locations.filter(loc => loc.status === 'warning').length} locations /
              {locations.reduce((sum, loc) => {
                const details = mockLocationDetails[loc.id];
                return sum + (details ? details.devices.filter(d => d.status === 'warning').length : 0);
              }, 0)} devices
            </span></span>
            <span>Critical: <span style={{ fontWeight: '600', color: '#EF4444' }}>
              {locations.filter(loc => loc.status === 'offline').length} locations /
              {locations.reduce((sum, loc) => {
                const details = mockLocationDetails[loc.id];
                return sum + (details ? details.devices.filter(d => d.status === 'offline').length : 0);
              }, 0)} devices
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