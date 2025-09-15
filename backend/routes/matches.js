const express = require('express');
const { Storage } = require('../config/storage');

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const { sport_id, date, status } = req.query;
        const matches = await Storage.getMatches({ sport_id, date, status });
        
        res.json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch matches',
            error: error.message
        });
    }
});

// Create new match
router.post('/', async (req, res) => {
    try {
        const matchData = req.body;
        const newMatch = await Storage.addMatch(matchData);

        res.status(201).json({
            success: true,
            message: 'Match scheduled successfully',
            data: {
                match_id: newMatch.match_id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to schedule match',
            error: error.message
        });
    }
});

module.exports = router;
