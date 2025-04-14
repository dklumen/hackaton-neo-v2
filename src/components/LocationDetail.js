import React, { useState, useEffect } from 'react';
import { Activity, Server, Wifi, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, Clock, Brain, Zap, TrendingUp, Shield, Cpu } from 'lucide-react';
import apiService from '../services/apiService';

const LocationDetail = ({ location, onBack }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAiInsights, setLoadingAiInsights] = useState(false);

  useEffect(() => {
    // Fetch devices for this location
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDevicesByLocation(location.id);
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [location.id]);

  useEffect(() => {
    // Fetch AI insights for this location
    const fetchAiInsights = async () => {
      // Only load AI insights if we have devices
      if (devices.length === 0) return;
      
      setLoadingAiInsights(true);
      try {
        // In a real app, this would be an API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock AI insights based on location status
        const mockInsights = generateMockAiInsights(location, devices);
        setAiInsights(mockInsights);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      } finally {
        setLoadingAiInsights(false);
      }
    };

    fetchAiInsights();
  }, [devices, location]);

  const runDiagnostic = async (deviceId) => {
    setRunningDiagnostic(true);
    try {
      const result = await apiService.runDeviceDiagnostic(deviceId);
      setDiagnosticResult(result);
    } catch (error) {
      console.error('Error running diagnostic:', error);
    } finally {
      setRunningDiagnostic(false);
    }
  };

  // Generate mock AI insights based on location and devices
  const generateMockAiInsights = (location, devices) => {
    const offlineDevices = devices.filter(d => d.status === 'offline');
    const warningDevices = devices.filter(d => d.status === 'warning');
    
    const insights = {
      networkHealth: {
        score: location.status === 'online' ? 92 : location.status === 'warning' ? 68 : 45,
        trend: location.status === 'online' ? 'up' : 'down',
        anomalyDetected: location.status !== 'online'
      },
      predictiveAlerts: [],
      rootCauseAnalysis: null,
      recommendations: []
    };

    // Add predictive alerts based on device status
    if (warningDevices.length > 0) {
      insights.predictiveAlerts.push({
        severity: 'warning',
        device: warningDevices[0].name,
        prediction: `High likelihood (87%) of packet loss increase in the next 24 hours`,
        confidence: 87
      });
    }

    if (location.status === 'warning' || location.status === 'offline') {
      insights.predictiveAlerts.push({
        severity: 'critical',
        device: devices[0]?.name || 'Core Router',
        prediction: `Potential bandwidth saturation predicted within 48 hours`,
        confidence: 74
      });
    }

    // Root cause analysis for offline devices
    if (offlineDevices.length > 0) {
      insights.rootCauseAnalysis = {
        primaryDevice: offlineDevices[0].name,
        relatedDevices: offlineDevices.slice(1).map(d => d.name),
        cause: `Power distribution unit failure at ${location.name} data center`,
        confidence: 89,
        affectedServices: ['External API Access', 'Backup Systems']
      };
    } else if (warningDevices.length > 0) {
      insights.rootCauseAnalysis = {
        primaryDevice: warningDevices[0].name,
        relatedDevices: warningDevices.slice(1).map(d => d.name),
        cause: `Intermittent packet loss due to fiber degradation in main trunk`,
        confidence: 73,
        affectedServices: ['VoIP Services']
      };
    }

    // Add recommendations
    if (location.status === 'offline') {
      insights.recommendations.push('Dispatch on-site technician to inspect power distribution units');
      insights.recommendations.push('Initiate failover to secondary data center');
    } else if (location.status === 'warning') {
      insights.recommendations.push('Schedule maintenance window for fiber inspection');
      insights.recommendations.push('Temporarily increase bandwidth allocation for critical services');
      insights.recommendations.push('Update QoS policies to prioritize latency-sensitive traffic');
    } else {
      insights.recommendations.push('Schedule preventative maintenance within next 30 days');
      insights.recommendations.push('Consider upgrading network equipment in Q3 to accommodate growing traffic patterns');
    }

    return insights;
  };

  // Get device type icon
  const getDeviceIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'router':
      case 'core router':
      case 'edge router':
        return <Wifi size={18} />;
      case 'switch':
      case 'distribution switch':
      case 'access switch':
        return <Activity size={18} />;
      case 'server':
      case 'application server':
        return <Server size={18} />;
      default:
        return <Server size={18} />;
    }
  };

  // Get status icon and style
  const getStatusInfo = (status) => {
    switch (status) {
      case 'online':
        return {
          icon: <CheckCircle size={16} />,
          bgClass: 'bg-green-100',
          textClass: 'text-green-800',
          label: 'Online'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={16} />,
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
          label: 'Warning'
        };
      case 'offline':
        return {
          icon: <AlertCircle size={16} />,
          bgClass: 'bg-red-100',
          textClass: 'text-red-800',
          label: 'Offline'
        };
      default:
        return {
          icon: <CheckCircle size={16} />,
          bgClass: 'bg-gray-100',
          textClass: 'text-gray-800',
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div>
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 flex items-center"
          >
            ← Back to Network Map
          </button>
          <h2 className="text-2xl font-bold">{location.name}, {location.country}</h2>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              location.status === 'online' ? 'bg-green-100 text-green-800' :
              location.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {location.status === 'online' ? <CheckCircle size={12} className="mr-1" /> : 
                location.status === 'warning' ? <AlertTriangle size={12} className="mr-1" /> : 
                <AlertCircle size={12} className="mr-1" />}
              {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-600">{location.devices} devices</span>
          </div>
        </div>
        <div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => alert('Opening dashboards...')}
          >
            View Dashboards
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* AI Insights Panel */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-lg shadow-lg overflow-hidden text-white">
            <div className="p-4 border-b border-indigo-600 flex justify-between items-center">
              <div className="flex items-center">
                <Brain size={20} className="mr-2" />
                <h3 className="font-semibold">AI Network Insights</h3>
              </div>
              <div className="text-xs bg-indigo-900 rounded-full px-3 py-1 flex items-center">
                <Zap size={12} className="mr-1" />
                AI Powered
              </div>
            </div>

            {loadingAiInsights ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 relative">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-300 border-opacity-20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-100 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-indigo-100">AI analyzing network data...</p>
              </div>
            ) : aiInsights ? (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Network Health Score */}
                  <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-indigo-200">Network Health Score</h4>
                      <span className={`flex items-center text-xs ${aiInsights.networkHealth.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                        <TrendingUp size={12} className="mr-1" />
                        {aiInsights.networkHealth.trend === 'up' ? 'Improving' : 'Degrading'}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#4c1d95"
                            strokeWidth="10"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={aiInsights.networkHealth.score > 80 ? "#10b981" : aiInsights.networkHealth.score > 60 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="10"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 - (aiInsights.networkHealth.score / 100) * 282.7}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000"
                          />
                          <text
                            x="50"
                            y="55"
                            fontSize="20"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="white"
                          >
                            {aiInsights.networkHealth.score}
                          </text>
                        </svg>
                      </div>
                      <div className="text-right">
                        {aiInsights.networkHealth.anomalyDetected && (
                          <div className="bg-red-900 text-red-100 px-2 py-1 rounded text-xs flex items-center mb-2">
                            <AlertTriangle size={10} className="mr-1" />
                            Anomaly Detected
                          </div>
                        )}
                        <div className="text-xs text-indigo-200">
                          Based on 24h performance data
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Predictive Alerts */}
                  <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-indigo-200 mb-3">Predictive Alerts</h4>
                    {aiInsights.predictiveAlerts.length > 0 ? (
                      <div className="space-y-3">
                        {aiInsights.predictiveAlerts.map((alert, index) => (
                          <div key={index} className={`p-2 rounded text-xs ${
                            alert.severity === 'critical' ? 'bg-red-900 bg-opacity-60' : 'bg-yellow-900 bg-opacity-60'
                          }`}>
                            <div className="flex items-start">
                              {alert.severity === 'critical' ? (
                                <AlertCircle size={12} className="text-red-300 mt-0.5 mr-1.5 flex-shrink-0" />
                              ) : (
                                <AlertTriangle size={12} className="text-yellow-300 mt-0.5 mr-1.5 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium mb-1">{alert.device}</div>
                                <p>{alert.prediction}</p>
                                <div className="mt-1 flex justify-between items-center">
                                  <div className="w-2/3 h-1 bg-indigo-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${alert.severity === 'critical' ? 'bg-red-400' : 'bg-yellow-400'}`}
                                      style={{ width: `${alert.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-indigo-200">{alert.confidence}% confidence</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-indigo-300 text-sm">
                        No predictive alerts at this time
                      </div>
                    )}
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-indigo-200 mb-3">Recommended Actions</h4>
                    {aiInsights.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {aiInsights.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <Zap size={12} className="text-indigo-300 mt-0.5 mr-2 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="h-full flex items-center justify-center text-indigo-300 text-sm">
                        No recommendations at this time
                      </div>
                    )}
                  </div>
                </div>

                {/* Root Cause Analysis */}
                {aiInsights.rootCauseAnalysis && (
                  <div className="mt-4 bg-indigo-900 bg-opacity-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-indigo-200 mb-3">AI Root Cause Analysis</h4>
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <div className="bg-indigo-800 bg-opacity-70 p-3 rounded-lg text-sm">
                          <div className="font-medium mb-1">Identified Issue</div>
                          <p>{aiInsights.rootCauseAnalysis.cause}</p>
                          
                          <div className="mt-3 font-medium mb-1">Primary Affected Device</div>
                          <p className="flex items-center">
                            <Shield size={12} className="mr-1.5 text-red-300" />
                            {aiInsights.rootCauseAnalysis.primaryDevice}
                          </p>
                          
                          {aiInsights.rootCauseAnalysis.relatedDevices.length > 0 && (
                            <>
                              <div className="mt-3 font-medium mb-1">Related Affected Devices</div>
                              <div className="flex flex-wrap gap-2">
                                {aiInsights.rootCauseAnalysis.relatedDevices.map((device, idx) => (
                                  <span key={idx} className="bg-indigo-700 px-2 py-0.5 rounded text-xs">
                                    {device}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                          
                          <div className="mt-3 font-medium mb-1">Affected Services</div>
                          <div className="flex flex-wrap gap-2">
                            {aiInsights.rootCauseAnalysis.affectedServices.map((service, idx) => (
                              <span key={idx} className="bg-purple-800 px-2 py-0.5 rounded text-xs">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <div className="mb-2">
                          <div className="text-xs text-indigo-200">Analysis Confidence</div>
                          <div className="text-xl font-bold">{aiInsights.rootCauseAnalysis.confidence}%</div>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-indigo-800 flex items-center justify-center mx-auto">
                          <Cpu className="text-indigo-300" size={36} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <AlertTriangle size={24} className="mx-auto mb-2" />
                <p>Unable to load AI insights</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Devices List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Network Devices</h3>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw size={24} className="mx-auto mb-2 animate-spin" />
                  <p>Loading devices...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {devices.map(device => (
                    <div 
                      key={device.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedDevice?.id === device.id ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        setSelectedDevice(device);
                        setDiagnosticResult(null);
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-gray-500">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{device.name}</p>
                            {/* Status Indicator */}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              getStatusInfo(device.status).bgClass
                            } ${getStatusInfo(device.status).textClass}`}>
                              {getStatusInfo(device.status).icon}
                              <span className="ml-1">{getStatusInfo(device.status).label}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{device.type}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>{device.ipAddress}</span>
                            <span className="mx-1">•</span>
                            <span>Ping: {device.lastPing}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Device Details and Diagnostics */}
          <div className="lg:col-span-2">
            {selectedDevice ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Device Details</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2">{selectedDevice.name}</h4>
                        <div className="flex items-center">
                          {getDeviceIcon(selectedDevice.type)}
                          <span className="ml-1 text-sm text-gray-600">{selectedDevice.type}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">IP Address</p>
                          <p className="font-medium">{selectedDevice.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusInfo(selectedDevice.status).bgClass
                          } ${getStatusInfo(selectedDevice.status).textClass}`}>
                            {getStatusInfo(selectedDevice.status).icon}
                            <span className="ml-1">{getStatusInfo(selectedDevice.status).label}</span>
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Response Time</p>
                          <p className="font-medium">{selectedDevice.lastPing}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center"
                          onClick={() => runDiagnostic(selectedDevice.id)}
                          disabled={runningDiagnostic}
                        >
                          {runningDiagnostic ? (
                            <>
                              <RefreshCw size={16} className="mr-2 animate-spin" />
                              Running Diagnostic...
                            </>
                          ) : (
                            <>
                              <Activity size={16} className="mr-2" />
                              Run Diagnostic
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      {diagnosticResult ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Diagnostic Results</h4>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {new Date(diagnosticResult.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-500">Network Performance</h5>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="bg-white p-2 rounded border">
                                  <p className="text-xs text-gray-500">Ping Time</p>
                                  <p className="font-medium">{diagnosticResult.diagnosticDetails.pingTime}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <p className="text-xs text-gray-500">Packet Loss</p>
                                  <p className="font-medium">{diagnosticResult.diagnosticDetails.packetLoss}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <p className="text-xs text-gray-500">Bandwidth Usage</p>
                                  <p className="font-medium">{diagnosticResult.diagnosticDetails.bandwidthUtilization}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <p className="text-xs text-gray-500">Error Rate</p>
                                  <p className="font-medium">{diagnosticResult.diagnosticDetails.errorRate}</p>
                                </div>
                              </div>
                            </div>
                            
                            {diagnosticResult.recommendations.length > 0 && (
                              <div>
                                <div className="flex items-center">
                                  <h5 className="text-sm font-medium text-gray-500">Recommendations</h5>
                                  <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                    <Brain size={10} className="mr-1" />
                                    AI Powered
                                  </span>
                                </div>
                                <ul className="mt-2 space-y-1">
                                  {diagnosticResult.recommendations.map((recommendation, index) => (
                                    <li key={index} className="text-sm flex items-start">
                                      <AlertTriangle size={12} className="text-yellow-500 mt-1 mr-2" />
                                      {recommendation}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center h-full">
                          <div className="text-center text-gray-500">
                            <Activity size={24} className="mx-auto mb-2" />
                            <p>Run a diagnostic to see results</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow flex items-center justify-center h-full">
                <div className="text-center text-gray-500 p-8">
                  <Server size={32} className="mx-auto mb-2" />
                  <p className="text-lg">Select a device to view details</p>
                  <p className="text-sm">You can run diagnostics and see performance metrics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;