const express = require('express');
const { body, validationResult } = require('express-validator');
const { Storage } = require('../config/storage');

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
    try {
        const { sport_id, college_id, status } = req.query;
        const teams = await Storage.getTeams({ sport_id, college_id, status });
        
        res.json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teams',
            error: error.message
        });
    }
});

// Register new team
router.post('/', [
    body('team_name').trim().isLength({ min: 2, max: 100 }).withMessage('Team name must be 2-100 characters'),
    body('sport_id').isInt({ min: 1 }).withMessage('Valid sport ID is required'),
    body('college_id').isInt({ min: 1 }).withMessage('Valid college ID is required'),
    body('captain_name').trim().isLength({ min: 2, max: 100 }).withMessage('Captain name must be 2-100 characters'),
    body('captain_email').isEmail().withMessage('Valid email is required'),
    body('captain_phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
    body('players').isArray({ min: 1 }).withMessage('At least one player is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const teamData = req.body;
        const newTeam = await Storage.addTeam(teamData);

        res.status(201).json({
            success: true,
            message: 'Team registered successfully',
            data: {
                team_id: newTeam.team_id,
                team_name: newTeam.team_name,
                sport_id: newTeam.sport_id,
                college_id: newTeam.college_id
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update team status (admin only)
router.put('/:id/status', [
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const teamId = req.params.id;
        const { status } = req.body;

        const updatedTeam = await Storage.updateTeamStatus(teamId, status);

        res.json({
            success: true,
            message: `Team ${status} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update team status',
            error: error.message
        });
    }
});

module.exports = router;
