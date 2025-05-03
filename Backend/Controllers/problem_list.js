const e = require("express");
const pool = require("../db");
const query = require("../quaries");

const problem_list = async (req, res) => {
  try {
    const problemlist = await pool.query(query.problem_List);
    res.status(200).json(problemlist.rows);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = problem_list;
