const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Sports endpoints
  async getSports() {
    return this.request('/sports');
  }

  async getSportById(id) {
    return this.request(`/sports/${id}`);
  }

  async createSport(sportData) {
    return this.request('/sports', {
      method: 'POST',
      body: JSON.stringify(sportData),
    });
  }

  // Colleges endpoints
  async getColleges() {
    return this.request('/colleges');
  }

  async getCollegeById(id) {
    return this.request(`/colleges/${id}`);
  }

  async createCollege(collegeData) {
    return this.request('/colleges', {
      method: 'POST',
      body: JSON.stringify(collegeData),
    });
  }

  // Teams endpoints
  async getTeams() {
    return this.request('/teams');
  }

  async getTeamById(id) {
    return this.request(`/teams/${id}`);
  }

  async createTeam(teamData) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async updateTeam(id, teamData) {
    return this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  }

  async deleteTeam(id) {
    return this.request(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Matches endpoints
  async getMatches() {
    return this.request('/matches');
  }

  async getMatchById(id) {
    return this.request(`/matches/${id}`);
  }

  async createMatch(matchData) {
    return this.request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatch(id, matchData) {
    return this.request(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(matchData),
    });
  }

  async deleteMatch(id) {
    return this.request(`/matches/${id}`, {
      method: 'DELETE',
    });
  }

  // Convenience methods for specific match queries
  async getLiveMatches() {
    const matches = await this.getMatches();
    return matches.filter(match => match.status === 'live' || match.status === 'in_progress');
  }

  async getUpcomingMatches() {
    const matches = await this.getMatches();
    return matches.filter(match => match.status === 'upcoming' || match.status === 'scheduled');
  }

  async getRecentMatches() {
    const matches = await this.getMatches();
    return matches
      .filter(match => match.status === 'completed' || match.status === 'finished')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Get last 10 matches
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get API info
  async getApiInfo() {
    try {
      const response = await fetch(this.baseURL.replace('/api', ''));
      return response.json();
    } catch (error) {
      console.error('Failed to get API info:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
