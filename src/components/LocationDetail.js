import React, { useState, useEffect } from 'react';
import { Activity, Server, Wifi, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import apiService from '../services/apiService';

const LocationDetail = ({ location, onBack }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);

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
                                <h5 className="text-sm font-medium text-gray-500">Recommendations</h5>
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