# NEO 2.0 Network Monitoring Dashboard

A next-generation network monitoring solution for Lumen Technologies, designed to provide real-time visibility of global network infrastructure.

## Overview

NEO 2.0 is a comprehensive network monitoring dashboard that allows network operations teams to visualize, diagnose, and troubleshoot network issues across a global infrastructure. The application features an interactive 3D globe visualization of network locations, detailed device monitoring, automated diagnostics, and predictive analysis capabilities.

## Features

- **Interactive 3D Globe**: Visualize global network status with an interactive globe showing real-time status of all locations
- **Device Monitoring**: View detailed information about network devices at each location
- **Automated Diagnostics**: Run on-demand diagnostics on any device to troubleshoot issues
- **Predictive Analysis**: Identify potential issues before they cause outages
- **Real-time Notifications**: Receive alerts when critical issues are detected
- **Troubleshooting Workflow**: Streamlined process for field technicians to diagnose and resolve issues

## Technical Architecture

The application uses a modern tech stack:

- **Frontend**: React with Tailwind CSS for styling
- **Backend**: Node.js with Express
- **3D Visualization**: Three.js library for the interactive globe
- **Notifications**: Real-time notification system

## Components

- `NeoDashboard`: Main application container
- `NetworkGlobe`: Interactive 3D globe visualization
- `LocationDetail`: Detailed view of a network location and its devices
- `ApiService`: Service for handling API communication

## Setup

### Backend

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

## Demo Flow

The application includes a demo mode that can be triggered by clicking the "Start Demo" button. This will simulate:

1. A critical network issue being detected in Sydney
2. Notification alerts appearing in the system
3. The ability to drill down into affected devices
4. Running diagnostics on problematic equipment
5. Receiving troubleshooting recommendations

## Future Enhancements

Potential enhancements for future iterations:

- Machine learning-based predictive analytics for proactive issue detection
- Integration with ticketing systems
- Mobile application for field technicians
- Expanded diagnostic capabilities
- Historical performance analytics
- Custom alert configuration
- Automated remediation workflows

## Hackathon Notes

This project was developed for the Lumen Technologies hackathon to demonstrate:

1. Innovative approaches to network monitoring and visualization
2. Real-time diagnostic capabilities
3. Integration of multiple data sources into a unified dashboard
4. Enhanced troubleshooting workflows for field technicians
5. Proactive identification of potential network issues