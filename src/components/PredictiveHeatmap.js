import React, { useState, useEffect } from 'react';
import { Brain, Clock, AlertTriangle } from 'lucide-react';

// This component will overlay a heatmap on the world map
const PredictiveHeatmap = ({ visible = true, locations = [] }) => {
  const [timeframe, setTimeframe] = useState('24h'); // Options: 6h, 24h, 72h
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Generate predictive risk data based on current network conditions
  useEffect(() => {
    if (!visible) return;
    
    setLoading(true);
    
    // Simulate AI analysis delay
    const timer = setTimeout(() => {
      // Generate risk hotspots with fixed coordinates
      const generatedRiskData = generateFixedHotspots(timeframe);
      setRiskData(generatedRiskData);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [visible, timeframe]);

  // Generate fixed hotspot data that will work with the map
  const generateFixedHotspots = (timeframe) => {
    // Use exactly these three cities with fixed coordinates from the map
    const targetCities = [
      {
        id: 'los-angeles',
        name: 'Los Angeles', 
        location: 'Los Angeles, USA',
        lat: 34.0522, 
        lng: -118.2437,
        severity: 'critical',
        reason: 'Critical infrastructure failure detected',
        confidence: 89,
        intensity: 0.9
      },
      {
        id: 'new-york',
        name: 'New York',
        location: 'New York, USA',
        lat: 40.7128,
        lng: -74.0060,
        severity: 'warning',
        reason: 'Performance degradation trending',
        confidence: 72,
        intensity: 0.6
      },
      {
        id: 'chicago',
        name: 'Chicago',
        location: 'Chicago, USA',
        lat: 41.8781,
        lng: -87.6298,
        severity: 'warning',
        reason: 'Bandwidth utilization above threshold',
        confidence: 68,
        intensity: 0.6
      }
    ];
    
    const hotspots = [];
    
    // Base radius for each timeframe
    const baseRadius = timeframe === '6h' ? 30 : 
                      timeframe === '24h' ? 40 : 50;
    
    // Create hotspots for each target city
    targetCities.forEach(city => {
      // Custom predictions based on city and timeframe
      const getPrediction = () => {
        if (city.id === 'los-angeles') {
          return timeframe === '6h' 
            ? 'Critical datacenter failure affecting 38% of network capacity for next 6 hours'
            : timeframe === '24h'
              ? 'Network outages likely to persist for 18-24 hours as redundant systems reach capacity'
              : 'Extended recovery timeframe projected for next 48-72 hours';
        } else if (city.id === 'new-york') {
          return timeframe === '6h' 
            ? 'Increasing latency affecting east coast traffic routing for next 2-6 hours'
            : timeframe === '24h'
              ? 'Bandwidth constraints expected to impact service quality for next 24 hours'
              : 'Traffic rerouting recommended within 48 hours to prevent degradation';
        } else if (city.id === 'chicago') {
          return timeframe === '6h' 
            ? 'Peak traffic patterns causing intermittent gateway timeouts for next 4-6 hours'
            : timeframe === '24h'
              ? 'Current load projections indicate potential service impact within 12-24 hours'
              : 'Traffic patterns suggest resource saturation within 36-72 hours';
        }
      };
      
      // Custom reasoning factors based on the city
      const getFactors = () => {
        if (city.id === 'los-angeles') {
          return {
            factor1: 'Primary cooling system failure in West Coast data center',
            factor2: 'Redundant systems operating at 82% capacity',
            factor3: 'Historical similar incidents resulted in 24h+ recovery times'
          };
        } else if (city.id === 'new-york') {
          return {
            factor1: 'Gradual throughput decrease detected across multiple edge devices',
            factor2: 'East coast traffic volume increased 37% in last monitoring cycle',
            factor3: 'Similar pattern preceded 3 previous congestion incidents'
          };
        } else if (city.id === 'chicago') {
          return {
            factor1: 'Midwest gateway experiencing packet loss during peak periods',
            factor2: 'Current load balancing configuration approaching threshold limits',
            factor3: 'Automated scaling resources delayed by verification processes'
          };
        }
      };
      
      const factors = getFactors();
      
      // Main hotspot
      hotspots.push({
        id: `hotspot-${city.id}`,
        lat: city.lat,
        lng: city.lng,
        radius: baseRadius,
        intensity: city.intensity,
        location: city.location,
        reason: city.reason,
        confidence: city.confidence,
        prediction: getPrediction(),
        factor1: factors.factor1,
        factor2: factors.factor2,
        factor3: factors.factor3
      });
      
      // Add a nearby node for each city (only if it's not Chicago to keep things cleaner)
      if (city.id !== 'chicago') {
        const latOffset = (Math.random() - 0.5) * 0.02; // Very small offset
        const lngOffset = (Math.random() - 0.5) * 0.02;
        
        hotspots.push({
          id: `hotspot-${city.id}-node-1`,
          lat: city.lat + latOffset,
          lng: city.lng + lngOffset,
          radius: baseRadius * 0.6,
          intensity: city.intensity * 0.8,
          location: `${city.name} Substation`,
          reason: `Connected to affected ${city.name} network`,
          confidence: city.confidence - 8,
          prediction: `Directly impacted by main ${city.name} network issues`,
          factor1: `Shared infrastructure with primary ${city.name} systems`,
          factor2: 'Redundant systems currently handling increased load',
          factor3: 'Mitigation recommended within next monitoring cycle'
        });
      }
    });
    
    return hotspots;
  };

  // If not visible, don't render anything
  if (!visible) return null;

  // Render loading state
  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', marginBottom: '16px' }}>
            <Brain size={24} style={{ color: '#00B2E3', marginRight: '8px' }} />
            <span style={{ fontWeight: 'bold', color: '#333' }}>AI Analysis in Progress</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00B2E3', 
                         animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00B2E3', 
                         animation: 'pulse 1.5s infinite ease-in-out 0.3s' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00B2E3', 
                         animation: 'pulse 1.5s infinite ease-in-out 0.6s' }} />
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Analyzing network patterns to predict potential incidents
          </p>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(0.8); opacity: 0.5; }
              50% { transform: scale(1.2); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Heatmap Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }}>
        {riskData.map(hotspot => {
          // Color based on id
          const color = hotspot.id.includes('los-angeles') ? 
                       'rgba(255,59,48,' + hotspot.intensity + ')' : 
                       'rgba(255,149,0,' + hotspot.intensity + ')';
          
          // These are magic numbers based on the mercator projection in the SimpleMapGlobe component
          // They're calculated to position the hotspots directly over the city markers
          const mapWidth = 900;
          const mapHeight = 500;
          
          // Convert to x/y coordinates
          const x = (hotspot.lng + 180) * (mapWidth / 360);
          const y = mapHeight / 2 - Math.log(Math.tan((Math.PI / 4) + (hotspot.lat * Math.PI / 180) / 2)) * (mapWidth / (2 * Math.PI));
          
          // Convert to percentages
          const left = `${(x / mapWidth) * 100}%`;
          const top = `${(y / mapHeight) * 100}%`;
          
          return (
            <div 
              key={hotspot.id}
              style={{
                position: 'absolute',
                top: top,
                left: left,
                width: `${hotspot.radius}px`,
                height: `${hotspot.radius}px`,
                marginLeft: `-${hotspot.radius / 2}px`,
                marginTop: `-${hotspot.radius / 2}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color} 0%, ${color.replace(hotspot.intensity, '0')} 70%)`,
                opacity: 0.7,
                pointerEvents: 'all',
                cursor: 'pointer',
                zIndex: 5
              }}
              onClick={() => setSelectedHotspot(hotspot)}
            />
          );
        })}
      </div>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        zIndex: 15
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Brain size={18} style={{ color: '#00B2E3', marginRight: '8px' }} />
          <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>AI Predictive Heatmap</span>
        </div>
        
        <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <Clock size={14} style={{ color: '#666', marginRight: '6px' }} />
            <span style={{ color: '#666', fontSize: '12px' }}>Prediction Timeframe:</span>
          </div>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {['6h', '24h', '72h'].map(time => (
              <button
                key={time}
                onClick={() => setTimeframe(time)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: timeframe === time ? '#00B2E3' : '#f0f0f0',
                  color: timeframe === time ? 'white' : '#333',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: timeframe === time ? 'bold' : 'normal'
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
          Powered by Lumen AI Network Analytics
        </div>
      </div>
      
      {/* Selected hotspot details */}
      {selectedHotspot && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          backgroundColor: 'white',
          boxShadow: '0 2px 15px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          padding: '16px',
          zIndex: 20,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={18} style={{ 
                color: selectedHotspot.id.includes('los-angeles') ? '#FF3B30' : '#FF9500', 
                marginRight: '8px' 
              }} />
              <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                Risk Prediction: {selectedHotspot.location}
              </h3>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              position: 'relative',
              marginRight: '16px'
            }}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="30" fill="none" stroke="#eee" strokeWidth="8" />
                <circle 
                  cx="35" 
                  cy="35" 
                  r="30" 
                  fill="none" 
                  stroke={selectedHotspot.id.includes('los-angeles') ? "#FF3B30" : "#FF9500"} 
                  strokeWidth="8"
                  strokeDasharray={`${(selectedHotspot.confidence / 100) * 2 * Math.PI * 30} ${2 * Math.PI * 30}`}
                  transform="rotate(-90 35 35)"
                />
                <text x="35" y="35" textAnchor="middle" dominantBaseline="middle" 
                      fill="#333" fontWeight="bold" fontSize="16px">
                  {selectedHotspot.confidence}%
                </text>
              </svg>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {selectedHotspot.reason}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {selectedHotspot.prediction}
              </div>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '12px' 
          }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              AI Reasoning Factors:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>{selectedHotspot.factor1}</li>
              <li style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>{selectedHotspot.factor2}</li>
              <li style={{ fontSize: '12px', color: '#555' }}>{selectedHotspot.factor3}</li>
            </ul>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid #eee',
            paddingTop: '12px' 
          }}>
            <button style={{
              backgroundColor: '#00B2E3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              View Mitigation Options
            </button>
            
            <button style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PredictiveHeatmap;