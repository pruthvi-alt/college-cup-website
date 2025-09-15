const express = require('express');
const { Storage } = require('../config/storage');

const router = express.Router();

// Get all sports
router.get('/', async (req, res) => {
    try {
        const sports = await Storage.getSports();
        
        res.json({
            success: true,
            count: sports.length,
            data: sports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sports',
            error: error.message
        });
    }
});

// Get sport by ID
router.get('/:id', async (req, res) => {
    try {
        const sportId = req.params.id;
        const sport = await Storage.getSport(sportId);

        if (!sport) {
            return res.status(404).json({
                success: false,
                message: 'Sport not found'
            });
        }

        res.json({
            success: true,
            data: sport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sport',
            error: error.message
        });
    }
});

// Get teams registered for a specific sport
router.get('/:id/teams', async (req, res) => {
    try {
        const sportId = req.params.id;
        const teams = await Storage.getTeams({ sport_id: sportId, status: 'approved' });

        res.json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teams for sport',
            error: error.message
        });
    }
});

// Get standings for a specific sport
router.get('/:id/standings', async (req, res) => {
    try {
        const sportId = req.params.id;
        const standings = await Storage.getStandingsBySport(sportId);

        res.json({
            success: true,
            count: standings.length,
            data: standings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch standings',
            error: error.message
        });
    }
});

module.exports = router;
