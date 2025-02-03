// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// GET endpoint to fetch department data
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find(); // Fetch all departments
        const data = departments.map(dept => ({
            timestamp: new Date(), // You can modify this to fetch actual timestamps if available
            value: dept.numberOfStudents, // Assuming there's a field 'numberOfStudents'
        }));
        res.json(data);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
