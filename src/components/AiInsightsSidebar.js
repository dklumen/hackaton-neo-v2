import React, { useState, useEffect } from 'react';
import { Brain, Zap, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';

const AiInsightsSidebar = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  
  useEffect(() => {
    // Simulate loading AI insights
    setLoading(true);
    const timer = setTimeout(() => {
      setInsights(generateAiInsights(location));
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // Generate insights based on location data
  const generateAiInsights = (location) => {
    // Check for warning or offline devices
    const hasWarning = location.status === 'warning';
    const hasOffline = location.status === 'offline';
    
    return {
      healthScore: hasOffline ? 42 : hasWarning ? 68 : 94,
      predictions: [
        hasWarning && {
          message: "High latency on Firewall NYC-003 likely to persist for next 24h",
          confidence: 87,
          severity: "warning"
        },
        hasOffline && {
          message: "Router NYC-004 connection likely to remain unstable",
          confidence: 92,
          severity: "critical"
        },
        {
          message: "Network traffic forecast: 28% increase expected during 14:00-16:00",
          confidence: 78,
          severity: "info"
        }
      ].filter(Boolean)
    };
  };
  
  // Render a circular progress indicator
  const CircularProgress = ({ percentage, size = 32, strokeWidth = 3, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const dashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size > 40 ? '0.875rem' : '0.75rem',
          fontWeight: '600'
        }}>
          {percentage}%
        </div>
      </div>
    );
  };
  
  if (!location) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* AI Insights Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Brain size={16} style={{ color: '#4F46E5', marginRight: '6px' }} />
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#1E293B'
          }}>AI Insights</span>
        </div>
        <div style={{ 
          fontSize: '12px', 
          backgroundColor: '#EEF2FF', 
          color: '#4338CA', 
          borderRadius: '9999px', 
          padding: '2px 8px', 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <Zap size={12} style={{ marginRight: '4px' }} />
          AI Powered
        </div>
      </div>
      
      {/* AI Content */}
      {loading ? (
        <div style={{ 
          height: '120px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#F8FAFC', 
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ 
              height: '10px', 
              width: '10px', 
              backgroundColor: '#6366F1', 
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}></div>
            <div style={{ 
              height: '10px', 
              width: '10px', 
              backgroundColor: '#6366F1', 
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite ease-in-out 0.2s'
            }}></div>
            <div style={{ 
              height: '10px', 
              width: '10px', 
              backgroundColor: '#6366F1', 
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite ease-in-out 0.4s'
            }}></div>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      ) : (
        <div style={{ 
          borderRadius: '8px', 
          overflow: 'hidden', 
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          {/* Health Score */}
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Network Health</span>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '12px', 
                color: insights.healthScore > 80 ? '#059669' : 
                       insights.healthScore > 60 ? '#D97706' : '#DC2626'
              }}>
                <TrendingUp size={12} style={{ marginRight: '4px' }} />
                {insights.healthScore > 80 ? 'Healthy' : 
                 insights.healthScore > 60 ? 'Warning' : 'Critical'}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <div style={{ 
                width: 'calc(100% - 60px)', 
                height: '8px', 
                backgroundColor: '#E2E8F0', 
                borderRadius: '4px', 
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${insights.healthScore}%`, 
                  backgroundColor: insights.healthScore > 80 ? '#10B981' : 
                                   insights.healthScore > 60 ? '#F59E0B' : '#EF4444',
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#1E293B',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                Score: {insights.healthScore}/100
              </div>
            </div>
          </div>
          
          {/* Predictions */}
          <div style={{ padding: '12px' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#1E293B', 
              marginBottom: '10px'
            }}>
              AI Predictions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {insights.predictions.map((prediction, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '6px', 
                  padding: '10px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {prediction.severity === 'critical' ? (
                      <AlertCircle size={14} style={{ 
                        color: '#DC2626', 
                        marginTop: '2px', 
                        marginRight: '8px', 
                        flexShrink: 0 
                      }} />
                    ) : prediction.severity === 'warning' ? (
                      <AlertTriangle size={14} style={{ 
                        color: '#D97706', 
                        marginTop: '2px', 
                        marginRight: '8px', 
                        flexShrink: 0 
                      }} />
                    ) : (
                      <Zap size={14} style={{ 
                        color: '#2563EB', 
                        marginTop: '2px', 
                        marginRight: '8px', 
                        flexShrink: 0 
                      }} />
                    )}
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ 
                        fontSize: '12px', 
                        margin: '0 0 8px 0',
                        lineHeight: 1.4,
                        color: '#334155'
                      }}>
                        {prediction.message}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}>
                        <CircularProgress 
                          percentage={prediction.confidence} 
                          size={36} 
                          color={
                            prediction.severity === 'critical' ? '#EF4444' :
                            prediction.severity === 'warning' ? '#F59E0B' : '#3B82F6'
                          }
                        />
                        <div style={{ 
                          fontSize: '11px', 
                          backgroundColor: prediction.severity === 'critical' ? '#FEE2E2' :
                                           prediction.severity === 'warning' ? '#FEF3C7' : '#DBEAFE',
                          color: prediction.severity === 'critical' ? '#B91C1C' :
                                 prediction.severity === 'warning' ? '#B45309' : '#1E40AF',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {prediction.severity === 'critical' ? 'Critical' :
                           prediction.severity === 'warning' ? 'Warning' : 'Info'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsightsSidebar;