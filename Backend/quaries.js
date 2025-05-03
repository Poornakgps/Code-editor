const getProblem = 'SELECT * FROM problems WHERE problem_id = $1';
const addProblem = 'INSERT INTO problems (title, description, rating, input, output, memorylimit, timelimit, inputformat, outputformat, constrains) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING problem_id';
const problem_List = 'SELECT problem_id, title, rating FROM problems';
const contest_List = 'SELECT * FROM contest'
const contestProblemList = `SELECT problem_id, title, rating FROM problems WHERE problem_id = $1`;


module.exports = {
    getProblem,
    addProblem,
    problem_List,
    contest_List,
    contestProblemList
}