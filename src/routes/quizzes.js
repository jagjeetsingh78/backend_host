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




const getstart = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);

    if (!quizId) {
      return res.status(400).json({ message: "Invalid Quiz ID" });
    }

    console.log("Fetching quiz:", quizId);

    const result = await pool.query(
      `SELECT 
        qz.id AS quiz_id,
        qz.time_limit,
        q.id AS question_id,
        q.text AS question_text,
        q.image_url,
        o.id AS option_id,
        o.text AS option_text
      FROM quiz_questions qq
      JOIN quizzes qz ON qq.quiz_id = qz.id
      JOIN questions q ON qq.question_id = q.id
      JOIN options o ON o.question_id = q.id
      WHERE qq.quiz_id = $1
      ORDER BY qq.order_index`,
      [quizId]
    );

    console.log("Rows fetched:", result.rows.length);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found or no questions" });
    }

    const totalTime = result.rows[0].time_limit || 0;

    const questionsMap = {};

    result.rows.forEach(row => {
      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          questionId: row.question_id,
          questionText: row.question_text || "",
          imageUrl: row.image_url || null,
          options: []
        };
      }

      questionsMap[row.question_id].options.push({
        optionId: row.option_id,
        text: row.option_text || ""
      });
    });

    res.json({
      quizId,
      totalTime,
      totalQuestions: Object.keys(questionsMap).length,
      questions: Object.values(questionsMap)
    });

  } catch (err) {
    console.error("🔥 ERROR:", err.stack);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

const submitQuiz = async (req, res) => {
  let { userId, quizId, answers } = req.body;

  // ✅ VALIDATION: Check required fields
  // We allow answers to be empty in case the user submits without answering anything.
  if (!userId || !quizId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid request body - userId, quizId, and answers array required" });
  }

  // ✅ VALIDATION: Filter valid answers only (ignore null/undefined optionIds)
  // Also use a Map to prevent duplicate submissions for the same question
  const uniqueAnswersMap = new Map();
  answers.forEach(ans => {
    if (ans.questionId && ans.optionId != null) {
      uniqueAnswersMap.set(ans.questionId, ans.optionId);
    }
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ✅ STEP 0: Verify quiz exists
    // Removed $1::integer because if the column is TEXT, it throws "operator does not exist: text = integer"
    const quizCheck = await client.query(
      "SELECT id FROM quizzes WHERE id = $1",
      [quizId]
    );

    if (quizCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ STEP 1: Create attempt
    const attemptRes = await client.query(
      `INSERT INTO quiz_attempts (user_id, quiz_id, start_time)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       RETURNING id`,
      [userId, quizId]
    );

    const attemptId = attemptRes.rows[0].id;

    // ✅ STEP 2: Get total questions in quiz
    const totalQuestionsRes = await client.query(
      `SELECT COUNT(*) as total FROM quiz_questions WHERE quiz_id = $1`,
      [quizId]
    );

    const totalQuestions = parseInt(totalQuestionsRes.rows[0].total);

    // ✅ STEP 3: Insert submissions
    const values = [];
    const params = [];

    let i = 0;
    uniqueAnswersMap.forEach((optionId, questionId) => {
      const base = i * 3;
      params.push(attemptId, questionId, optionId);
      values.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
      i++;
    });

    if (values.length > 0) {
      await client.query(
        `INSERT INTO submissions (attempt_id, question_id, selected_option_id)
         VALUES ${values.join(",")}`,
        params
      );
    }

    // ✅ STEP 4: Calculate score
    const scoreRes = await client.query(
      `SELECT COUNT(*) AS score
       FROM submissions s
       JOIN options o ON s.selected_option_id = o.id::text
       WHERE s.attempt_id = $1 AND o.is_correct = true`,
      [attemptId]
    );

    const score = parseInt(scoreRes.rows[0].score);

    // ✅ STEP 5: Update attempt with end_time and score
    await client.query(
      `UPDATE quiz_attempts
       SET score = $2,
           end_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [attemptId, score]
    );

    await client.query("COMMIT");

    // ✅ STEP 6: Response
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      attemptId,
      score,
      total: totalQuestions,
      answered: uniqueAnswersMap.size,
      percentage
    });

  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback error:", rollbackErr);
    }
    console.error("Submit Quiz Error:", err.stack);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message // Keep or remove in production depending on security needs
    });
  } finally {
    client.release();
  }
};


router.get('/chapter/:chapterId', getquiz);
router.get('/start/:quizId', getstart);

router.post('/submit', submitQuiz);


module.exports = router;