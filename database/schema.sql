-- College Cup Tournament Database Schema

CREATE DATABASE IF NOT EXISTS college_cup;
USE college_cup;

-- Table for different sports available in the tournament
CREATE TABLE sports (
    sport_id INT PRIMARY KEY AUTO_INCREMENT,
    sport_name VARCHAR(100) NOT NULL UNIQUE,
    max_team_size INT NOT NULL DEFAULT 11,
    min_team_size INT NOT NULL DEFAULT 1,
    description TEXT,
    rules TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for colleges/institutions
CREATE TABLE colleges (
    college_id INT PRIMARY KEY AUTO_INCREMENT,
    college_name VARCHAR(200) NOT NULL,
    college_code VARCHAR(20) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for teams registered for different sports
CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL,
    sport_id INT NOT NULL,
    college_id INT NOT NULL,
    captain_name VARCHAR(100) NOT NULL,
    captain_email VARCHAR(100) NOT NULL,
    captain_phone VARCHAR(20) NOT NULL,
    team_size INT NOT NULL,
    registration_fee_paid BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id),
    UNIQUE KEY unique_team_sport_college (sport_id, college_id)
);

-- Table for individual players in teams
CREATE TABLE players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    player_email VARCHAR(100),
    player_phone VARCHAR(20),
    jersey_number INT,
    position VARCHAR(50),
    is_captain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_jersey_team (team_id, jersey_number)
);

-- Table for venues/grounds
CREATE TABLE venues (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    venue_type VARCHAR(50) NOT NULL, -- indoor, outdoor, field, court
    capacity INT DEFAULT 100,
    facilities TEXT,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tournament schedule and matches
CREATE TABLE matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    sport_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    venue_id INT NOT NULL,
    match_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    match_type ENUM('group', 'quarter', 'semi', 'final') NOT NULL DEFAULT 'group',
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    winner_team_id INT,
    referee_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (team1_id) REFERENCES teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES teams(team_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
    FOREIGN KEY (winner_team_id) REFERENCES teams(team_id)
);

-- Table for tournament standings/rankings
CREATE TABLE standings (
    standing_id INT PRIMARY KEY AUTO_INCREMENT,
    sport_id INT NOT NULL,
    team_id INT NOT NULL,
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_drawn INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    goal_difference INT DEFAULT 0,
    points INT DEFAULT 0,
    position INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    UNIQUE KEY unique_sport_team (sport_id, team_id)
);

-- Table for admin users
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample sports
INSERT INTO sports (sport_name, max_team_size, min_team_size, description) VALUES
('Football', 11, 11, 'Association football with 11 players per team'),
('Cricket', 11, 11, 'Cricket match with 11 players per team'),
('Basketball', 5, 5, 'Basketball with 5 players per team'),
('Volleyball', 6, 6, 'Volleyball with 6 players per team'),
('Badminton Singles', 1, 1, 'Individual badminton competition'),
('Badminton Doubles', 2, 2, 'Badminton doubles competition'),
('Table Tennis Singles', 1, 1, 'Individual table tennis competition'),
('Table Tennis Doubles', 2, 2, 'Table tennis doubles competition'),
('Hockey', 11, 11, 'Field hockey with 11 players per team'),
('Kabaddi', 7, 7, 'Kabaddi with 7 players per team');

-- Insert sample venues
INSERT INTO venues (venue_name, venue_type, capacity, location) VALUES
('Main Football Ground', 'outdoor', 5000, 'Sports Complex North'),
('Basketball Court 1', 'indoor', 500, 'Sports Complex Indoor Hall'),
('Basketball Court 2', 'indoor', 500, 'Sports Complex Indoor Hall'),
('Volleyball Court 1', 'indoor', 300, 'Sports Complex Indoor Hall'),
('Volleyball Court 2', 'indoor', 300, 'Sports Complex Indoor Hall'),
('Badminton Hall', 'indoor', 200, 'Sports Complex Indoor Hall'),
('Table Tennis Hall', 'indoor', 100, 'Sports Complex Indoor Hall'),
('Hockey Ground', 'outdoor', 3000, 'Sports Complex South'),
('Cricket Ground', 'outdoor', 8000, 'Sports Complex East'),
('Kabaddi Ground', 'outdoor', 2000, 'Sports Complex West');

-- Create default admin user (password should be changed after first login)
INSERT INTO admins (username, password_hash, full_name, email, role) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@college.edu', 'super_admin');

-- Create indexes for better performance
CREATE INDEX idx_teams_sport ON teams(sport_id);
CREATE INDEX idx_teams_college ON teams(college_id);
CREATE INDEX idx_matches_sport ON matches(sport_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_standings_sport ON standings(sport_id);
