// apiService.js
const API_URL = 'http://localhost:5001/api';

/**
 * Service for handling all API calls to the NEO 2.0 backend
 */
class ApiService {
  /**
   * Fetch all network locations
   * @returns {Promise<Array>} Array of location objects
   */
  async getNetworkLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`, {
            credentials: 'include'
        });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching network locations:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific network location by ID
   * @param {number} id - Location ID
   * @returns {Promise<Object>} Location object
   */
  async getLocationById(id) {
    try {
      const response = await fetch(`${API_URL}/locations/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching location with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all devices for a specific location
   * @param {number} locationId - Location ID
   * @returns {Promise<Array>} Array of device objects
   */
  async getDevicesByLocation(locationId) {
    try {
      const response = await fetch(`${API_URL}/locations/${locationId}/devices`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching devices for location ${locationId}:`, error);
      throw error;
    }
  }

  /**
   * Run a diagnostic on a specific device
   * @param {number} deviceId - Device ID
   * @returns {Promise<Object>} Diagnostic result
   */
  async runDeviceDiagnostic(deviceId) {
    try {
      const response = await fetch(`${API_URL}/devices/${deviceId}/diagnostic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error running diagnostic for device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Get historical performance statistics
   * @returns {Promise<Object>} Historical performance data
   */
  async getHistoricalStats() {
    try {
      const response = await fetch(`${API_URL}/stats/historical`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical stats:', error);
      throw error;
    }
  }

  /**
   * Get all notifications
   * @returns {Promise<Array>} Array of notification objects
   */
  async getNotifications() {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Create a new notification
   * @param {Object} notification - Notification object
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notification) {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }
}

export default new ApiService();