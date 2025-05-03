const pool = require("../db");
const query = require("../quaries");

const problem_detail = async (req, res) => {
  try {
    const { problem_id } = req.body;
    // console.log(problem_id);
    const problem = await pool.query(query.getProblem, [problem_id]);
    res.status(200).json(problem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = problem_detail;
