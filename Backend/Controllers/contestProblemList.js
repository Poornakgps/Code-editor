const express = require('express');
const pool = require('../db');
const query = require('../quaries'); // Corrected spelling

const contestProblemList = async (req, res) => {
  try {
    const {problems} = req.body; // Array of problem IDs

    // console.log(problems)
    let problem_set = []
    for(let i = 0; i<problems.length; ++i){
        let temp  = await pool.query(query.contestProblemList, [problems[i]]);
        // console.log(temp.rows)
        problem_set.push(temp.rows)
    }
    // console.log(problem_set)
    res.status(200).json(problem_set);
  } catch (error) {
    console.error('Error fetching problems:', error); // Log error details for debugging
    res.status(500).json({ message: "An error occurred while fetching problems.", error: error.message });
  }
};

module.exports = contestProblemList;