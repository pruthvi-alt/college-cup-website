const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { initializeStorage } = require('./config/storage');

// Import routes
const sportsRoutes = require('./routes/sports');
const collegesRoutes = require('./routes/colleges');
const teamsRoutes = require('./routes/teams');
const matchesRoutes = require('./routes/matches');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static('public'));

// Routes
app.use('/api/sports', sportsRoutes);
app.use('/api/colleges', collegesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'College Cup Tournament API',
        version: '1.0.0',
        endpoints: {
            sports: '/api/sports',
            colleges: '/api/colleges',
            teams: '/api/teams',
            matches: '/api/matches',
            admin: '/api/admin'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Start server
const startServer = async () => {
    try {
        // Initialize file storage
        console.log('🔄 Initializing data storage...');
        await initializeStorage();
        
        // Test database connection (optional)
        const dbConnected = await testConnection();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
            console.log(`🌐 Open the website: Open index.html in your browser`);
            console.log(``);
            console.log(`📝 Using file-based storage (data/ folder)`);
            
            if (dbConnected) {
                console.log(`✅ MySQL is also available for advanced features`);
            } else {
                console.log(`❗ MySQL Setup (Optional):`);
                console.log(`   1. Install MySQL`);
                console.log(`   2. Create database: CREATE DATABASE college_cup;`);
                console.log(`   3. Import schema: mysql -u root -p college_cup < ../database/schema.sql`);
                console.log(`   4. Update .env file with your MySQL credentials`);
                console.log(``);
                console.log(`🎯 The website works perfectly without MySQL!`);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // Still try to start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (with basic functionality)`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
        });
    }
};

startServer();

module.exports = app;
