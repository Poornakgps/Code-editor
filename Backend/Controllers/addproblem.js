const e = require("express");
const pool = require("../db");
const query = require("../quaries");

const addProblem = async (req, res) => {
    try {
        const {title, description, rating, input, output, memorylimit, timelimit, inputformat, outputformat, constrains} = req.body;
        const problem = await pool.query(query.addProblem, [title, description, rating, input, output, memorylimit, timelimit, inputformat, outputformat, constrains]);
        if(problem.rows.length > 0){
            res.status(200).json({message: "Problem added successfully"});
        }
        else{
            res.status(500).json({message: "Problem not added"});
        } 
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

module.exports = addProblem;
