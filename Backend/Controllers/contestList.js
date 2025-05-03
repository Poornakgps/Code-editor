const pool = require("../db");
const query = require("../quaries");

const contest_List = async (req, res) => {
  try {
    const problem = await pool.query(query.contest_List);
    res.status(200).json(problem.rows);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = contest_List;
