// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper Functions
class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Sports API
    static async getSports() {
        return this.request('/sports');
    }

    static async getSport(id) {
        return this.request(`/sports/${id}`);
    }

    static async getSportTeams(id) {
        return this.request(`/sports/${id}/teams`);
    }

    static async getSportStandings(id) {
        return this.request(`/sports/${id}/standings`);
    }

    // Colleges API
    static async getColleges(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/colleges?${params}`);
    }

    static async getCollege(id) {
        return this.request(`/colleges/${id}`);
    }

    static async registerCollege(data) {
        return this.request('/colleges', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async getStates() {
        return this.request('/colleges/data/states');
    }

    static async getCities(state) {
        return this.request(`/colleges/data/cities?state=${encodeURIComponent(state)}`);
    }

    // Teams API
    static async getTeams(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/teams?${params}`);
    }

    static async getTeam(id) {
        return this.request(`/teams/${id}`);
    }

    static async registerTeam(data) {
        return this.request('/teams', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateTeamStatus(id, status) {
        return this.request(`/teams/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Matches API
    static async getMatches(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/matches?${params}`);
    }

    static async getMatch(id) {
        return this.request(`/matches/${id}`);
    }

    static async createMatch(data) {
        return this.request('/matches', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateMatchResult(id, result) {
        return this.request(`/matches/${id}/result`, {
            method: 'PUT',
            body: JSON.stringify(result)
        });
    }

    static async updateMatchStatus(id, status) {
        return this.request(`/matches/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    static async getTodayMatches() {
        return this.request('/matches/today/schedule');
    }

    // Admin API
    static async getDashboard() {
        return this.request('/admin/dashboard');
    }

    static async getVenues() {
        return this.request('/admin/venues');
    }

    static async getPendingTeams() {
        return this.request('/admin/teams/pending');
    }

    static async getAdminSchedule(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/matches/schedule?${params}`);
    }

    static async getVenueAvailability(date) {
        return this.request(`/admin/venues/availability?date=${date}`);
    }

    static async exportData(type) {
        return this.request(`/admin/export/${type}`);
    }
}

// Utility Functions
const Utils = {
    showLoading() {
        document.getElementById('loading-modal').style.display = 'block';
    },

    hideLoading() {
        document.getElementById('loading-modal').style.display = 'none';
    },

    showSuccess(title, message) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').style.display = 'block';
    },

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-modal').style.display = 'block';
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const time = new Date();
        time.setHours(parseInt(hours), parseInt(minutes));
        return time.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    Utils.showError('An unexpected error occurred. Please try again.');
});

// Close modal function
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
