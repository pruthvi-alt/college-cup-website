const express = require('express');
const { Storage } = require('../config/storage');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const dashboardData = await Storage.getDashboardStats();
        
        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});

// Get all venues
router.get('/venues', async (req, res) => {
    try {
        const venues = await Storage.getVenues();
        
        res.json({
            success: true,
            count: venues.length,
            data: venues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch venues',
            error: error.message
        });
    }
});

// Get pending team approvals
router.get('/teams/pending', async (req, res) => {
    try {
        const pendingTeams = await Storage.getTeams({ status: 'pending' });

        res.json({
            success: true,
            count: pendingTeams.length,
            data: pendingTeams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending teams',
            error: error.message
        });
    }
});

module.exports = router;
