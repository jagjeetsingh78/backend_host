const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const getquiz = async (req, res) => {
    const chapterId = req.params.chapterId || req.query.chapterId;

    if (!chapterId) {
        return res.status(400).json({ message: "Chapter ID is required" });
    }

    const chapterIdNumber = parseInt(chapterId, 10);
    if (Number.isNaN(chapterIdNumber)) {
        return res.status(400).json({ message: "Chapter ID must be a number" });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM quizzes WHERE chapter_id = $1',
            [chapterIdNumber]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ✅ ONLY THESE ROUTES (NO /:chapterId)
router.get('/chapter/:chapterId', getquiz);


module.exports = router;