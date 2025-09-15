const fs = require('fs').promises;
const path = require('path');

// Storage file paths
const dataDir = path.join(__dirname, '..', 'data');
const files = {
    sports: path.join(dataDir, 'sports.json'),
    colleges: path.join(dataDir, 'colleges.json'),
    teams: path.join(dataDir, 'teams.json'),
    players: path.join(dataDir, 'players.json'),
    matches: path.join(dataDir, 'matches.json'),
    standings: path.join(dataDir, 'standings.json'),
    venues: path.join(dataDir, 'venues.json')
};

// Initialize data directory and files
async function initializeStorage() {
    try {
        // Create data directory if it doesn't exist
        await fs.mkdir(dataDir, { recursive: true });
        
        // Initialize files with sample data if they don't exist
        await initializeSports();
        await initializeVenues();
        await initializeFiles();
        
        console.log('✅ File storage initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ File storage initialization failed:', error.message);
        return false;
    }
}

async function initializeSports() {
    try {
        await fs.access(files.sports);
    } catch {
        const sportsData = [
            { sport_id: 1, sport_name: 'Football', max_team_size: 11, min_team_size: 11, description: 'Association football with 11 players per team' },
            { sport_id: 2, sport_name: 'Cricket', max_team_size: 11, min_team_size: 11, description: 'Cricket match with 11 players per team' },
            { sport_id: 3, sport_name: 'Basketball', max_team_size: 5, min_team_size: 5, description: 'Basketball with 5 players per team' },
            { sport_id: 4, sport_name: 'Volleyball', max_team_size: 6, min_team_size: 6, description: 'Volleyball with 6 players per team' },
            { sport_id: 5, sport_name: 'Badminton Singles', max_team_size: 1, min_team_size: 1, description: 'Individual badminton competition' },
            { sport_id: 6, sport_name: 'Badminton Doubles', max_team_size: 2, min_team_size: 2, description: 'Badminton doubles competition' },
            { sport_id: 7, sport_name: 'Table Tennis Singles', max_team_size: 1, min_team_size: 1, description: 'Individual table tennis competition' },
            { sport_id: 8, sport_name: 'Table Tennis Doubles', max_team_size: 2, min_team_size: 2, description: 'Table tennis doubles competition' },
            { sport_id: 9, sport_name: 'Hockey', max_team_size: 11, min_team_size: 11, description: 'Field hockey with 11 players per team' },
            { sport_id: 10, sport_name: 'Kabaddi', max_team_size: 7, min_team_size: 7, description: 'Kabaddi with 7 players per team' }
        ];
        await writeData('sports', sportsData);
    }
}

async function initializeVenues() {
    try {
        await fs.access(files.venues);
    } catch {
        const venuesData = [
            { venue_id: 1, venue_name: 'Main Football Ground', venue_type: 'outdoor', capacity: 5000, location: 'Sports Complex North' },
            { venue_id: 2, venue_name: 'Basketball Court 1', venue_type: 'indoor', capacity: 500, location: 'Sports Complex Indoor Hall' },
            { venue_id: 3, venue_name: 'Basketball Court 2', venue_type: 'indoor', capacity: 500, location: 'Sports Complex Indoor Hall' },
            { venue_id: 4, venue_name: 'Volleyball Court 1', venue_type: 'indoor', capacity: 300, location: 'Sports Complex Indoor Hall' },
            { venue_id: 5, venue_name: 'Volleyball Court 2', venue_type: 'indoor', capacity: 300, location: 'Sports Complex Indoor Hall' },
            { venue_id: 6, venue_name: 'Badminton Hall', venue_type: 'indoor', capacity: 200, location: 'Sports Complex Indoor Hall' },
            { venue_id: 7, venue_name: 'Table Tennis Hall', venue_type: 'indoor', capacity: 100, location: 'Sports Complex Indoor Hall' },
            { venue_id: 8, venue_name: 'Hockey Ground', venue_type: 'outdoor', capacity: 3000, location: 'Sports Complex South' },
            { venue_id: 9, venue_name: 'Cricket Ground', venue_type: 'outdoor', capacity: 8000, location: 'Sports Complex East' },
            { venue_id: 10, venue_name: 'Kabaddi Ground', venue_type: 'outdoor', capacity: 2000, location: 'Sports Complex West' }
        ];
        await writeData('venues', venuesData);
    }
}

async function initializeFiles() {
    const emptyFiles = ['colleges', 'teams', 'players', 'matches', 'standings'];
    for (const file of emptyFiles) {
        try {
            await fs.access(files[file]);
        } catch {
            await writeData(file, []);
        }
    }
}

// Read data from file
async function readData(type) {
    try {
        const data = await fs.readFile(files[type], 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${type} data:`, error);
        return [];
    }
}

// Write data to file
async function writeData(type, data) {
    try {
        await fs.writeFile(files[type], JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${type} data:`, error);
        return false;
    }
}

// Get next ID for a collection
async function getNextId(type) {
    const data = await readData(type);
    if (data.length === 0) return 1;
    const maxId = Math.max(...data.map(item => item[`${type.slice(0, -1)}_id`] || item.id || 0));
    return maxId + 1;
}

// Query-like functions to mimic SQL operations
const Storage = {
    // Sports operations
    async getSports() {
        return await readData('sports');
    },

    async getSport(id) {
        const sports = await readData('sports');
        return sports.find(sport => sport.sport_id === parseInt(id));
    },

    // Colleges operations
    async getColleges(filters = {}) {
        let colleges = await readData('colleges');
        
        if (filters.state) {
            colleges = colleges.filter(c => c.state === filters.state);
        }
        if (filters.city) {
            colleges = colleges.filter(c => c.city === filters.city);
        }
        
        return colleges;
    },

    async addCollege(collegeData) {
        const colleges = await readData('colleges');
        const newCollege = {
            college_id: await getNextId('colleges'),
            ...collegeData,
            created_at: new Date().toISOString()
        };
        colleges.push(newCollege);
        await writeData('colleges', colleges);
        return newCollege;
    },

    async getCollege(id) {
        const colleges = await readData('colleges');
        return colleges.find(college => college.college_id === parseInt(id));
    },

    // Teams operations
    async getTeams(filters = {}) {
        let teams = await readData('teams');
        const colleges = await readData('colleges');
        const sports = await readData('sports');
        
        // Join with colleges and sports data
        teams = teams.map(team => {
            const college = colleges.find(c => c.college_id === team.college_id);
            const sport = sports.find(s => s.sport_id === team.sport_id);
            return {
                ...team,
                college_name: college?.college_name || 'Unknown',
                city: college?.city || 'Unknown',
                state: college?.state || 'Unknown',
                sport_name: sport?.sport_name || 'Unknown'
            };
        });

        if (filters.sport_id) {
            teams = teams.filter(t => t.sport_id === parseInt(filters.sport_id));
        }
        if (filters.college_id) {
            teams = teams.filter(t => t.college_id === parseInt(filters.college_id));
        }
        if (filters.status) {
            teams = teams.filter(t => t.status === filters.status);
        }
        
        return teams;
    },

    async addTeam(teamData) {
        const teams = await readData('teams');
        
        // Check for duplicate
        const duplicate = teams.find(t => 
            t.sport_id === teamData.sport_id && t.college_id === teamData.college_id
        );
        
        if (duplicate) {
            throw new Error('This college already has a team registered for this sport');
        }

        const newTeam = {
            team_id: await getNextId('teams'),
            ...teamData,
            status: 'pending',
            registration_fee_paid: false,
            created_at: new Date().toISOString()
        };
        
        teams.push(newTeam);
        await writeData('teams', teams);
        
        // Add players
        if (teamData.players) {
            await this.addPlayers(newTeam.team_id, teamData.players, teamData.captain_name);
        }
        
        return newTeam;
    },

    async updateTeamStatus(teamId, status) {
        const teams = await readData('teams');
        const teamIndex = teams.findIndex(t => t.team_id === parseInt(teamId));
        
        if (teamIndex === -1) {
            throw new Error('Team not found');
        }
        
        teams[teamIndex].status = status;
        await writeData('teams', teams);
        
        // If approved, add to standings
        if (status === 'approved') {
            await this.addTeamToStandings(teams[teamIndex]);
        }
        
        return teams[teamIndex];
    },

    // Players operations
    async addPlayers(teamId, players, captainName) {
        const allPlayers = await readData('players');
        
        for (const player of players) {
            const newPlayer = {
                player_id: await getNextId('players'),
                team_id: teamId,
                ...player,
                is_captain: player.player_name === captainName,
                created_at: new Date().toISOString()
            };
            allPlayers.push(newPlayer);
        }
        
        await writeData('players', allPlayers);
    },

    async getTeamPlayers(teamId) {
        const players = await readData('players');
        return players.filter(p => p.team_id === parseInt(teamId));
    },

    // Standings operations
    async addTeamToStandings(team) {
        const standings = await readData('standings');
        
        const existingStanding = standings.find(s => 
            s.sport_id === team.sport_id && s.team_id === team.team_id
        );
        
        if (!existingStanding) {
            const newStanding = {
                standing_id: await getNextId('standings'),
                sport_id: team.sport_id,
                team_id: team.team_id,
                matches_played: 0,
                matches_won: 0,
                matches_drawn: 0,
                matches_lost: 0,
                goals_for: 0,
                goals_against: 0,
                goal_difference: 0,
                points: 0,
                position: 0,
                updated_at: new Date().toISOString()
            };
            standings.push(newStanding);
            await writeData('standings', standings);
        }
    },

    async getStandingsBySport(sportId) {
        const standings = await readData('standings');
        const teams = await readData('teams');
        const colleges = await readData('colleges');
        
        let sportStandings = standings.filter(s => s.sport_id === parseInt(sportId));
        
        // Join with team and college data
        sportStandings = sportStandings.map(standing => {
            const team = teams.find(t => t.team_id === standing.team_id);
            const college = colleges.find(c => c.college_id === team?.college_id);
            return {
                ...standing,
                team_name: team?.team_name || 'Unknown',
                college_name: college?.college_name || 'Unknown'
            };
        });
        
        // Sort by points, then goal difference
        sportStandings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
            return b.goals_for - a.goals_for;
        });
        
        return sportStandings;
    },

    // Matches operations
    async getMatches(filters = {}) {
        let matches = await readData('matches');
        const teams = await readData('teams');
        const colleges = await readData('colleges');
        const sports = await readData('sports');
        const venues = await readData('venues');
        
        // Join with related data
        matches = matches.map(match => {
            const team1 = teams.find(t => t.team_id === match.team1_id);
            const team2 = teams.find(t => t.team_id === match.team2_id);
            const sport = sports.find(s => s.sport_id === match.sport_id);
            const venue = venues.find(v => v.venue_id === match.venue_id);
            const college1 = colleges.find(c => c.college_id === team1?.college_id);
            const college2 = colleges.find(c => c.college_id === team2?.college_id);
            
            return {
                ...match,
                sport_name: sport?.sport_name || 'Unknown',
                team1_name: team1?.team_name || 'Unknown',
                team2_name: team2?.team_name || 'Unknown',
                team1_college: college1?.college_name || 'Unknown',
                team2_college: college2?.college_name || 'Unknown',
                venue_name: venue?.venue_name || 'Unknown',
                venue_location: venue?.location || 'Unknown'
            };
        });

        // Apply filters
        if (filters.sport_id) {
            matches = matches.filter(m => m.sport_id === parseInt(filters.sport_id));
        }
        if (filters.date) {
            matches = matches.filter(m => m.match_date === filters.date);
        }
        if (filters.status) {
            matches = matches.filter(m => m.status === filters.status);
        }
        
        return matches.sort((a, b) => new Date(a.match_date + ' ' + a.start_time) - new Date(b.match_date + ' ' + b.start_time));
    },

    async addMatch(matchData) {
        const matches = await readData('matches');
        const newMatch = {
            match_id: await getNextId('matches'),
            ...matchData,
            status: 'scheduled',
            team1_score: 0,
            team2_score: 0,
            winner_team_id: null,
            created_at: new Date().toISOString()
        };
        matches.push(newMatch);
        await writeData('matches', matches);
        return newMatch;
    },

    // Venues operations
    async getVenues() {
        return await readData('venues');
    },

    // Dashboard data
    async getDashboardStats() {
        const colleges = await readData('colleges');
        const teams = await readData('teams');
        const matches = await readData('matches');
        const sports = await readData('sports');
        
        const teamStatus = teams.reduce((acc, team) => {
            acc[team.status] = (acc[team.status] || 0) + 1;
            return acc;
        }, {});
        
        const matchStatus = matches.reduce((acc, match) => {
            acc[match.status] = (acc[match.status] || 0) + 1;
            return acc;
        }, {});

        return {
            totals: {
                colleges: colleges.length,
                teams: teams.length,
                matches: matches.length,
                sports: sports.length
            },
            teamStatus: Object.entries(teamStatus).map(([status, count]) => ({ status, count })),
            matchStatus: Object.entries(matchStatus).map(([status, count]) => ({ status, count })),
            sportsStats: sports.map(sport => {
                const sportTeams = teams.filter(t => t.sport_id === sport.sport_id);
                return {
                    sport_name: sport.sport_name,
                    team_count: sportTeams.length,
                    approved_teams: sportTeams.filter(t => t.status === 'approved').length
                };
            }),
            recentTeams: teams.slice(-10).reverse().map(team => {
                const college = colleges.find(c => c.college_id === team.college_id);
                const sport = sports.find(s => s.sport_id === team.sport_id);
                return {
                    ...team,
                    college_name: college?.college_name || 'Unknown',
                    sport_name: sport?.sport_name || 'Unknown'
                };
            })
        };
    }
};

async function initializeVenuesData() {
    const venuesData = [
        { venue_id: 1, venue_name: 'Main Football Ground', venue_type: 'outdoor', capacity: 5000, location: 'Sports Complex North', facilities: 'Floodlights, Changing rooms, Medical room' },
        { venue_id: 2, venue_name: 'Basketball Court 1', venue_type: 'indoor', capacity: 500, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, Scoreboard, Sound system' },
        { venue_id: 3, venue_name: 'Basketball Court 2', venue_type: 'indoor', capacity: 500, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, Scoreboard, Sound system' },
        { venue_id: 4, venue_name: 'Volleyball Court 1', venue_type: 'indoor', capacity: 300, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, Net system, Seating' },
        { venue_id: 5, venue_name: 'Volleyball Court 2', venue_type: 'indoor', capacity: 300, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, Net system, Seating' },
        { venue_id: 6, venue_name: 'Badminton Hall', venue_type: 'indoor', capacity: 200, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, 8 courts, Professional lighting' },
        { venue_id: 7, venue_name: 'Table Tennis Hall', venue_type: 'indoor', capacity: 100, location: 'Sports Complex Indoor Hall', facilities: 'Air conditioning, 10 tables, Professional lighting' },
        { venue_id: 8, venue_name: 'Hockey Ground', venue_type: 'outdoor', capacity: 3000, location: 'Sports Complex South', facilities: 'Artificial turf, Floodlights, Dugouts' },
        { venue_id: 9, venue_name: 'Cricket Ground', venue_type: 'outdoor', capacity: 8000, location: 'Sports Complex East', facilities: 'Turf pitch, Pavilion, Electronic scoreboard' },
        { venue_id: 10, venue_name: 'Kabaddi Ground', venue_type: 'outdoor', capacity: 2000, location: 'Sports Complex West', facilities: 'Mat court, Seating, Lighting' }
    ];
    await writeData('venues', venuesData);
}

module.exports = {
    initializeStorage,
    Storage,
    readData,
    writeData,
    getNextId
};
