// Application State
let currentSport = null;
let currentStandingSport = null;
let sports = [];
let colleges = [];
let venues = [];

// DOM Elements
const elements = {
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    sportsGrid: document.getElementById('sports-grid'),
    scheduleContainer: document.getElementById('schedule-container'),
    standingsContent: document.getElementById('standings-content'),
    standingsTabs: document.getElementById('standings-tabs'),
    totalColleges: document.getElementById('total-colleges'),
    totalTeams: document.getElementById('total-teams'),
    totalMatches: document.getElementById('total-matches'),
    playersContainer: document.getElementById('players-container'),
    addPlayerBtn: document.getElementById('add-player'),
    teamSportSelect: document.getElementById('team-sport'),
    teamCollegeSelect: document.getElementById('team-college')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    initializeNavigation();
    initializeTabs();
    await loadInitialData();
    initializeForms();
    initializeFilters();
    
    // Load dashboard stats
    loadDashboardStats();
});

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    elements.hamburger?.addEventListener('click', () => {
        elements.hamburger.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu
                elements.hamburger?.classList.remove('active');
                elements.navMenu?.classList.remove('active');
            }
        });
    });
}

// Tab functionality
function initializeTabs() {
    // Registration tabs
    const registerTabs = document.querySelectorAll('.register-tabs .tab-btn');
    registerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // Update tab buttons
            registerTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.register-section .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabType}-tab`).classList.add('active');
        });
    });

    // Admin tabs
    const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // Update tab buttons
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.admin-section .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabType}-tab`).classList.add('active');
            
            // Load specific admin data
            loadAdminTabData(tabType);
        });
    });
}

// Load initial data
async function loadInitialData() {
    try {
        Utils.showLoading();
        
        // Load sports
        const sportsResponse = await API.getSports();
        sports = sportsResponse.data;
        displaySports(sports);
        populateSportsFilters();
        
        // Load colleges
        const collegesResponse = await API.getColleges();
        colleges = collegesResponse.data;
        populateCollegeSelect();
        
        // Load venues
        const venuesResponse = await API.getVenues();
        venues = venuesResponse.data;
        
        // Load schedule
        await loadSchedule();
        
        // Load standings
        await loadStandings();
        
        Utils.hideLoading();
    } catch (error) {
        Utils.hideLoading();
        Utils.showError('Failed to load initial data: ' + error.message);
    }
}

// Display sports
function displaySports(sportsData) {
    const sportIcons = {
        'Football': 'fas fa-futbol',
        'Cricket': 'fas fa-baseball-ball',
        'Basketball': 'fas fa-basketball-ball',
        'Volleyball': 'fas fa-volleyball-ball',
        'Badminton': 'fas fa-shuttlecock',
        'Table Tennis': 'fas fa-table-tennis',
        'Hockey': 'fas fa-hockey-puck',
        'Kabaddi': 'fas fa-fist-raised'
    };

    const html = sportsData.map(sport => {
        const iconClass = Object.keys(sportIcons).find(key => 
            sport.sport_name.toLowerCase().includes(key.toLowerCase())
        );
        
        return `
            <div class="sport-card fade-in" data-sport-id="${sport.sport_id}">
                <div class="sport-icon">
                    <i class="${sportIcons[iconClass] || 'fas fa-trophy'}"></i>
                </div>
                <h3 class="sport-name">${sport.sport_name}</h3>
                <p class="sport-teams" id="sport-teams-${sport.sport_id}">Loading teams...</p>
                <button class="btn btn-primary mt-1" onclick="viewSportDetails(${sport.sport_id})">
                    View Details
                </button>
            </div>
        `;
    }).join('');

    elements.sportsGrid.innerHTML = html;

    // Load team counts for each sport
    sportsData.forEach(async (sport) => {
        try {
            const teamsResponse = await API.getSportTeams(sport.sport_id);
            const teamCount = teamsResponse.count;
            const teamCountElement = document.getElementById(`sport-teams-${sport.sport_id}`);
            if (teamCountElement) {
                teamCountElement.textContent = `${teamCount} teams registered`;
            }
        } catch (error) {
            console.error(`Failed to load team count for sport ${sport.sport_id}:`, error);
        }
    });
}

// Load and display schedule
async function loadSchedule(filters = {}) {
    try {
        const response = await API.getMatches(filters);
        displaySchedule(response.data);
    } catch (error) {
        elements.scheduleContainer.innerHTML = '<div class="error">Failed to load schedule</div>';
    }
}

function displaySchedule(matches) {
    if (matches.length === 0) {
        elements.scheduleContainer.innerHTML = '<div class="text-center">No matches scheduled</div>';
        return;
    }

    const html = matches.map(match => `
        <div class="match-card fade-in">
            <div class="match-teams">
                <span class="team">${match.team1_name}</span>
                <span class="vs">vs</span>
                <span class="team">${match.team2_name}</span>
            </div>
            <div class="match-info">
                <div class="match-time">${Utils.formatTime(match.start_time)}</div>
                <div class="match-venue">${match.venue_name}</div>
                <div class="match-date">${Utils.formatDate(match.match_date)}</div>
            </div>
            <div class="match-status status-${match.status}">
                ${match.status}
                ${match.status === 'completed' ? 
                    `<br><small>${match.team1_score} - ${match.team2_score}</small>` : ''}
            </div>
        </div>
    `).join('');

    elements.scheduleContainer.innerHTML = html;
}

// Load and display standings
async function loadStandings() {
    try {
        // Create tabs for each sport
        const tabsHtml = sports.map(sport => `
            <button class="tab-btn ${sport.sport_id === 1 ? 'active' : ''}" 
                    data-sport-id="${sport.sport_id}" 
                    onclick="loadSportStandings(${sport.sport_id})">
                ${sport.sport_name}
            </button>
        `).join('');
        
        elements.standingsTabs.innerHTML = tabsHtml;
        
        // Load first sport standings
        if (sports.length > 0) {
            await loadSportStandings(sports[0].sport_id);
        }
    } catch (error) {
        elements.standingsContent.innerHTML = '<div class="error">Failed to load standings</div>';
    }
}

async function loadSportStandings(sportId) {
    try {
        currentStandingSport = sportId;
        
        // Update active tab
        document.querySelectorAll('.standings-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.sportId) === sportId) {
                btn.classList.add('active');
            }
        });

        const response = await API.getSportStandings(sportId);
        displayStandings(response.data);
    } catch (error) {
        elements.standingsContent.innerHTML = '<div class="error">Failed to load standings</div>';
    }
}

function displayStandings(standings) {
    if (standings.length === 0) {
        elements.standingsContent.innerHTML = '<div class="text-center">No teams registered yet</div>';
        return;
    }

    const html = `
        <table class="standings-table">
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>College</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                ${standings.map((team, index) => `
                    <tr>
                        <td class="position">${index + 1}</td>
                        <td>${team.team_name}</td>
                        <td>${team.college_name}</td>
                        <td>${team.matches_played}</td>
                        <td>${team.matches_won}</td>
                        <td>${team.matches_drawn}</td>
                        <td>${team.matches_lost}</td>
                        <td>${team.goals_for}</td>
                        <td>${team.goals_against}</td>
                        <td class="${team.goal_difference >= 0 ? 'text-success' : 'text-danger'}">
                            ${team.goal_difference > 0 ? '+' : ''}${team.goal_difference}
                        </td>
                        <td><strong>${team.points}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    elements.standingsContent.innerHTML = html;
}

// Initialize forms
function initializeForms() {
    // College registration form
    const collegeForm = document.getElementById('college-form');
    collegeForm?.addEventListener('submit', handleCollegeRegistration);

    // Team registration form
    const teamForm = document.getElementById('team-form');
    teamForm?.addEventListener('submit', handleTeamRegistration);

    // Match creation form
    const matchForm = document.getElementById('match-form');
    matchForm?.addEventListener('submit', handleMatchCreation);

    // Add player functionality
    elements.addPlayerBtn?.addEventListener('click', addPlayerRow);

    // Team sport change handler
    elements.teamSportSelect?.addEventListener('change', updateTeamSizeRequirements);

    // Create match button
    document.getElementById('create-match')?.addEventListener('click', () => {
        populateMatchForm();
        document.getElementById('match-modal').style.display = 'block';
    });
}

// Initialize filters
function initializeFilters() {
    const sportFilter = document.getElementById('sport-filter');
    const dateFilter = document.getElementById('date-filter');
    const statusFilter = document.getElementById('status-filter');

    const debouncedLoadSchedule = Utils.debounce(() => {
        const filters = {};
        if (sportFilter.value) filters.sport_id = sportFilter.value;
        if (dateFilter.value) filters.date = dateFilter.value;
        if (statusFilter.value) filters.status = statusFilter.value;
        loadSchedule(filters);
    }, 300);

    sportFilter?.addEventListener('change', debouncedLoadSchedule);
    dateFilter?.addEventListener('change', debouncedLoadSchedule);
    statusFilter?.addEventListener('change', debouncedLoadSchedule);
}

// Populate filters
function populateSportsFilters() {
    const sportFilter = document.getElementById('sport-filter');
    const matchSportSelect = document.getElementById('match-sport');
    
    if (sportFilter) {
        const options = sports.map(sport => 
            `<option value="${sport.sport_id}">${sport.sport_name}</option>`
        ).join('');
        sportFilter.innerHTML = '<option value="">All Sports</option>' + options;
    }

    if (matchSportSelect) {
        const options = sports.map(sport => 
            `<option value="${sport.sport_id}">${sport.sport_name}</option>`
        ).join('');
        matchSportSelect.innerHTML = '<option value="">Select Sport</option>' + options;
    }

    if (elements.teamSportSelect) {
        const options = sports.map(sport => 
            `<option value="${sport.sport_id}" data-min="${sport.min_team_size}" data-max="${sport.max_team_size}">
                ${sport.sport_name} (${sport.min_team_size}-${sport.max_team_size} players)
            </option>`
        ).join('');
        elements.teamSportSelect.innerHTML = '<option value="">Select Sport</option>' + options;
    }
}

function populateCollegeSelect() {
    if (elements.teamCollegeSelect) {
        const options = colleges.map(college => 
            `<option value="${college.college_id}">${college.college_name} - ${college.city}, ${college.state}</option>`
        ).join('');
        elements.teamCollegeSelect.innerHTML = '<option value="">Select College</option>' + options;
    }
}

// Form Handlers
async function handleCollegeRegistration(e) {
    e.preventDefault();
    
    try {
        Utils.showLoading();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        await API.registerCollege(data);
        
        Utils.hideLoading();
        Utils.showSuccess('Success!', 'College registered successfully');
        e.target.reset();
        
        // Reload colleges data
        const collegesResponse = await API.getColleges();
        colleges = collegesResponse.data;
        populateCollegeSelect();
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showError(error.message);
    }
}

async function handleTeamRegistration(e) {
    e.preventDefault();
    
    try {
        Utils.showLoading();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Collect players data
        const players = [];
        const playerRows = document.querySelectorAll('.player-row');
        
        playerRows.forEach(row => {
            const playerName = row.querySelector('[name="player_name"]').value;
            const playerEmail = row.querySelector('[name="player_email"]').value;
            const playerPhone = row.querySelector('[name="player_phone"]').value;
            const jerseyNumber = row.querySelector('[name="jersey_number"]').value;
            const position = row.querySelector('[name="position"]').value;
            
            if (playerName.trim()) {
                players.push({
                    player_name: playerName,
                    player_email: playerEmail || null,
                    player_phone: playerPhone || null,
                    jersey_number: jerseyNumber || null,
                    position: position || null
                });
            }
        });
        
        data.players = players;
        
        await API.registerTeam(data);
        
        Utils.hideLoading();
        Utils.showSuccess('Success!', 'Team registered successfully! Waiting for admin approval.');
        e.target.reset();
        elements.playersContainer.innerHTML = '';
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showError(error.message);
    }
}

async function handleMatchCreation(e) {
    e.preventDefault();
    
    try {
        Utils.showLoading();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        await API.createMatch(data);
        
        Utils.hideLoading();
        Utils.showSuccess('Success!', 'Match scheduled successfully!');
        closeModal('match-modal');
        e.target.reset();
        
        // Reload schedule
        await loadSchedule();
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showError(error.message);
    }
}

// Player management
function addPlayerRow() {
    const playerCount = elements.playersContainer.children.length + 1;
    
    const playerRow = document.createElement('div');
    playerRow.className = 'player-row';
    playerRow.innerHTML = `
        <div class="form-group">
            <label>Player Name *</label>
            <input type="text" name="player_name" required>
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="player_email">
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="player_phone" pattern="[0-9]{10}">
        </div>
        <div class="form-group">
            <label>Jersey #</label>
            <input type="number" name="jersey_number" min="1" max="99">
        </div>
        <div class="form-group">
            <label>Position</label>
            <input type="text" name="position">
        </div>
        <button type="button" class="remove-player" onclick="removePlayerRow(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    elements.playersContainer.appendChild(playerRow);
}

function removePlayerRow(button) {
    button.closest('.player-row').remove();
}

function updateTeamSizeRequirements() {
    const selectedOption = elements.teamSportSelect.selectedOptions[0];
    if (selectedOption) {
        const minSize = parseInt(selectedOption.dataset.min);
        const maxSize = parseInt(selectedOption.dataset.max);
        
        // Clear existing players
        elements.playersContainer.innerHTML = '';
        
        // Add minimum required players
        for (let i = 0; i < minSize; i++) {
            addPlayerRow();
        }
    }
}

// Dashboard functions
async function loadDashboardStats() {
    try {
        const response = await API.getDashboard();
        const stats = response.data.totals;
        
        if (elements.totalColleges) elements.totalColleges.textContent = stats.colleges;
        if (elements.totalTeams) elements.totalTeams.textContent = stats.teams;
        if (elements.totalMatches) elements.totalMatches.textContent = stats.matches;
        
        animateCounters();
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 20;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 50);
    });
}

// Admin functions
async function loadAdminTabData(tabType) {
    switch (tabType) {
        case 'dashboard':
            await loadAdminDashboard();
            break;
        case 'teams-admin':
            await loadPendingTeams();
            break;
        case 'schedule-admin':
            await loadAdminSchedule();
            break;
        case 'venues':
            await loadVenuesList();
            break;
    }
}

async function loadAdminDashboard() {
    try {
        const response = await API.getDashboard();
        const data = response.data;
        
        const html = `
            <div class="stat-card">
                <h3>Total Colleges</h3>
                <span class="number">${data.totals.colleges}</span>
            </div>
            <div class="stat-card">
                <h3>Total Teams</h3>
                <span class="number">${data.totals.teams}</span>
            </div>
            <div class="stat-card">
                <h3>Total Matches</h3>
                <span class="number">${data.totals.matches}</span>
            </div>
            <div class="stat-card">
                <h3>Active Sports</h3>
                <span class="number">${data.totals.sports}</span>
            </div>
        `;
        
        document.getElementById('admin-stats').innerHTML = html;
    } catch (error) {
        document.getElementById('admin-stats').innerHTML = '<div class="error">Failed to load dashboard</div>';
    }
}

async function loadPendingTeams() {
    try {
        const response = await API.getPendingTeams();
        displayPendingTeams(response.data);
    } catch (error) {
        document.getElementById('pending-teams').innerHTML = '<div class="error">Failed to load pending teams</div>';
    }
}

function displayPendingTeams(teams) {
    if (teams.length === 0) {
        document.getElementById('pending-teams').innerHTML = '<div class="text-center">No pending team approvals</div>';
        return;
    }

    const html = teams.map(team => `
        <div class="team-card">
            <div class="team-info">
                <h4>${team.team_name}</h4>
                <p>${team.sport_name} - ${team.college_name}</p>
                <p>Captain: ${team.captain_name} (${team.captain_email})</p>
                <p>Registered: ${Utils.formatDate(team.created_at)}</p>
            </div>
            <div class="team-actions">
                <button class="btn-approve" onclick="approveTeam(${team.team_id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectTeam(${team.team_id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('pending-teams').innerHTML = html;
}

async function approveTeam(teamId) {
    try {
        await API.updateTeamStatus(teamId, 'approved');
        Utils.showSuccess('Success!', 'Team approved successfully');
        await loadPendingTeams();
    } catch (error) {
        Utils.showError(error.message);
    }
}

async function rejectTeam(teamId) {
    try {
        await API.updateTeamStatus(teamId, 'rejected');
        Utils.showSuccess('Success!', 'Team rejected');
        await loadPendingTeams();
    } catch (error) {
        Utils.showError(error.message);
    }
}

async function loadAdminSchedule() {
    try {
        const response = await API.getAdminSchedule();
        displayAdminSchedule(response.data);
    } catch (error) {
        document.getElementById('admin-schedule').innerHTML = '<div class="error">Failed to load schedule</div>';
    }
}

function displayAdminSchedule(matches) {
    if (matches.length === 0) {
        document.getElementById('admin-schedule').innerHTML = '<div class="text-center">No matches scheduled</div>';
        return;
    }

    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Sport</th>
                    <th>Teams</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${matches.map(match => `
                    <tr>
                        <td>${Utils.formatDate(match.match_date)}</td>
                        <td>${Utils.formatTime(match.start_time)}</td>
                        <td>${match.sport_name}</td>
                        <td>
                            ${match.team1_name} vs ${match.team2_name}
                            ${match.status === 'completed' ? 
                                `<br><small>(${match.team1_score} - ${match.team2_score})</small>` : ''}
                        </td>
                        <td>${match.venue_name}</td>
                        <td>
                            <span class="match-status status-${match.status}">
                                ${match.status}
                            </span>
                        </td>
                        <td>
                            ${match.status === 'scheduled' ? 
                                `<button class="btn btn-success" onclick="startMatch(${match.match_id})">Start</button>` : ''}
                            ${match.status === 'ongoing' ? 
                                `<button class="btn btn-primary" onclick="completeMatch(${match.match_id})">Complete</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('admin-schedule').innerHTML = html;
}

async function loadVenuesList() {
    try {
        const response = await API.getVenues();
        displayVenues(response.data);
    } catch (error) {
        document.getElementById('venues-list').innerHTML = '<div class="error">Failed to load venues</div>';
    }
}

function displayVenues(venues) {
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Venue Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Facilities</th>
                </tr>
            </thead>
            <tbody>
                ${venues.map(venue => `
                    <tr>
                        <td>${venue.venue_name}</td>
                        <td><span class="badge badge-${venue.venue_type}">${venue.venue_type}</span></td>
                        <td>${venue.capacity}</td>
                        <td>${venue.location}</td>
                        <td>${venue.facilities || 'Standard facilities'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('venues-list').innerHTML = html;
}

// Match form population
async function populateMatchForm() {
    try {
        // Populate sports
        populateSportsFilters();
        
        // Populate venues
        const venueSelect = document.getElementById('match-venue');
        const venueOptions = venues.map(venue => 
            `<option value="${venue.venue_id}">${venue.venue_name} (${venue.venue_type})</option>`
        ).join('');
        venueSelect.innerHTML = '<option value="">Select Venue</option>' + venueOptions;
        
        // Handle sport change to populate teams
        document.getElementById('match-sport').addEventListener('change', async function() {
            const sportId = this.value;
            if (sportId) {
                await populateTeamSelects(sportId);
            }
        });
        
    } catch (error) {
        Utils.showError('Failed to populate match form');
    }
}

async function populateTeamSelects(sportId) {
    try {
        const response = await API.getSportTeams(sportId);
        const teams = response.data;
        
        const team1Select = document.getElementById('team1');
        const team2Select = document.getElementById('team2');
        
        const options = teams.map(team => 
            `<option value="${team.team_id}">${team.team_name} (${team.college_name})</option>`
        ).join('');
        
        team1Select.innerHTML = '<option value="">Select Team 1</option>' + options;
        team2Select.innerHTML = '<option value="">Select Team 2</option>' + options;
        
    } catch (error) {
        Utils.showError('Failed to load teams for sport');
    }
}

// Match management
async function startMatch(matchId) {
    try {
        await API.updateMatchStatus(matchId, 'ongoing');
        Utils.showSuccess('Success!', 'Match started');
        await loadAdminSchedule();
    } catch (error) {
        Utils.showError(error.message);
    }
}

async function completeMatch(matchId) {
    // This would typically open a modal to enter scores
    // For now, we'll just change status
    try {
        await API.updateMatchStatus(matchId, 'completed');
        Utils.showSuccess('Success!', 'Match completed');
        await loadAdminSchedule();
    } catch (error) {
        Utils.showError(error.message);
    }
}

// Sport details view
function viewSportDetails(sportId) {
    const sport = sports.find(s => s.sport_id === sportId);
    if (sport) {
        Utils.showSuccess(sport.sport_name, sport.description || 'Click on Schedule to view matches for this sport');
        // Optionally scroll to schedule section
        setTimeout(() => {
            document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' });
            // Set filter to this sport
            const sportFilter = document.getElementById('sport-filter');
            if (sportFilter) {
                sportFilter.value = sportId;
                sportFilter.dispatchEvent(new Event('change'));
            }
        }, 2000);
    }
}

// Scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Loading states
function setLoadingState(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isLoading) {
            element.innerHTML = '<div class="loading">Loading...</div>';
        }
    }
}
