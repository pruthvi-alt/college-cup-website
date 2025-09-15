# College Cup Tournament Website

A comprehensive web application for managing inter-college sports tournaments across India. This system allows colleges to register teams for various sports, manage schedules, track standings, and allocate time slots for matches.

## Features

### 🏆 Tournament Management
- **Multi-Sport Support**: Football, Cricket, Basketball, Volleyball, Badminton, Table Tennis, Hockey, Kabaddi
- **Team Registration**: Colleges across India can register teams for different sports
- **Player Management**: Individual player registration with detailed information
- **Match Scheduling**: Automated scheduling with venue and time allocation
- **Live Standings**: Real-time tournament standings and statistics

### 🎯 Key Functionalities
- **College Registration**: Register participating colleges with contact details
- **Team Registration**: Register teams for specific sports with player rosters
- **Admin Dashboard**: Comprehensive admin panel for managing the tournament
- **Schedule Management**: Create and manage match schedules with venue allocation
- **Results Tracking**: Update match results and automatic standings calculation
- **Data Export**: Export tournament data for reports and analysis

### 🌐 Professional Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic data loading without page refresh
- **Professional UI**: Modern, clean interface with smooth animations
- **Data Validation**: Comprehensive form validation and error handling
- **Security**: Input sanitization and SQL injection prevention

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database for data storage
- **RESTful API** architecture
- **JWT** for authentication (ready for implementation)
- **Express Validator** for input validation
- **CORS** enabled for frontend communication

### Frontend
- **Vanilla JavaScript** (ES6+)
- **HTML5** with semantic markup
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Font Awesome** icons
- **Google Fonts** (Poppins)

### Database
- **MySQL 8.0+** with optimized schema
- **Foreign key constraints** for data integrity
- **Indexes** for performance optimization
- **Sample data** for testing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- A modern web browser

### Step 1: Database Setup
1. Install MySQL and create a new database:
```sql
CREATE DATABASE college_cup;
```

2. Import the database schema:
```bash
mysql -u root -p college_cup < database/schema.sql
```

### Step 2: Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=college_cup
DB_PORT=3306
```

4. Start the backend server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

### Step 3: Frontend Setup
1. Open `index.html` in a web browser, or
2. Use a local development server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

The website will be available at `http://localhost:8080`

## Usage Guide

### For Colleges
1. **Register College**: First register your college with contact details
2. **Register Teams**: Register teams for different sports
3. **View Schedule**: Check match schedules and timings
4. **Track Progress**: Monitor team standings and results

### For Administrators
1. **Dashboard**: View overall tournament statistics
2. **Team Approval**: Approve or reject team registrations
3. **Schedule Matches**: Create and manage match schedules
4. **Update Results**: Record match results and update standings
5. **Export Data**: Download tournament data for reports

## API Endpoints

### Sports
- `GET /api/sports` - Get all sports
- `GET /api/sports/:id` - Get sport details
- `GET /api/sports/:id/teams` - Get teams for a sport
- `GET /api/sports/:id/standings` - Get standings for a sport

### Colleges
- `GET /api/colleges` - Get all colleges
- `POST /api/colleges` - Register new college
- `GET /api/colleges/:id` - Get college details

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Register new team
- `PUT /api/teams/:id/status` - Update team status (admin)

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match (admin)
- `PUT /api/matches/:id/result` - Update match result (admin)
- `GET /api/matches/today/schedule` - Get today's matches

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/venues` - Get all venues
- `GET /api/admin/teams/pending` - Get pending team approvals

## Database Schema

### Key Tables
- **sports**: Available sports and their requirements
- **colleges**: Participating colleges information
- **teams**: Registered teams with college and sport associations
- **players**: Individual players in teams
- **matches**: Scheduled matches with venues and timing
- **standings**: Tournament standings and statistics
- **venues**: Available venues and facilities

## Project Structure
```
college-cup-website/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── sports.js
│   │   ├── colleges.js
│   │   ├── teams.js
│   │   ├── matches.js
│   │   └── admin.js
│   ├── package.json
│   ├── server.js
│   └── .env
├── database/
│   └── schema.sql
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   └── app.js
├── images/
├── index.html
└── README.md
```

## Features in Detail

### Team Registration System
- Validate team size based on sport requirements
- Prevent duplicate registrations from same college for same sport
- Collect detailed player information
- Admin approval workflow

### Scheduling System
- Venue availability checking
- Time conflict prevention
- Multiple match types (group, quarter, semi, final)
- Referee assignment

### Standings Calculation
- Automatic points calculation (Win=3, Draw=1, Loss=0)
- Goal difference tracking
- Position ranking based on points and goal difference

## Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Content Security Policy
- Rate limiting (can be added)
- Authentication ready (JWT setup included)

## Customization Options
- Add new sports easily through database
- Modify scoring systems
- Customize tournament format
- Add additional venues
- Extend player information fields

## Support
For issues or questions:
- Check the console for error messages
- Verify database connection
- Ensure all dependencies are installed
- Check API endpoints are responding

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**College Cup 2024** - Bringing together the best sporting talents from colleges across India! 🏆
