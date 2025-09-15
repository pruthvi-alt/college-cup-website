const express = require('express');
const { body, validationResult } = require('express-validator');
const { Storage } = require('../config/storage');

const router = express.Router();

// Get all colleges
router.get('/', async (req, res) => {
    try {
        const { state, city } = req.query;
        const colleges = await Storage.getColleges({ state, city });
        
        res.json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch colleges',
            error: error.message
        });
    }
});

// Get college by ID
router.get('/:id', async (req, res) => {
    try {
        const collegeId = req.params.id;
        const college = await Storage.getCollege(collegeId);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            data: college
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch college',
            error: error.message
        });
    }
});

// Register new college
router.post('/', [
    body('college_name').trim().isLength({ min: 5, max: 200 }).withMessage('College name must be 5-200 characters'),
    body('college_code').trim().isLength({ min: 3, max: 20 }).withMessage('College code must be 3-20 characters'),
    body('city').trim().isLength({ min: 2, max: 100 }).withMessage('City must be 2-100 characters'),
    body('state').trim().isLength({ min: 2, max: 100 }).withMessage('State must be 2-100 characters'),
    body('contact_person').trim().isLength({ min: 2, max: 100 }).withMessage('Contact person must be 2-100 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required')
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

        const collegeData = req.body;
        
        // Check for duplicates manually
        const colleges = await Storage.getColleges();
        const existing = colleges.find(c => 
            c.college_code === collegeData.college_code || c.email === collegeData.email
        );
        
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'College code or email already exists'
            });
        }

        const newCollege = await Storage.addCollege(collegeData);

        res.status(201).json({
            success: true,
            message: 'College registered successfully',
            data: {
                college_id: newCollege.college_id,
                college_name: newCollege.college_name,
                college_code: newCollege.college_code
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register college',
            error: error.message
        });
    }
});

module.exports = router;
