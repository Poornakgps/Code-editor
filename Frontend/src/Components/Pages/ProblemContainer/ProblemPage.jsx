import { ProblemContainer } from './ProblemContainer';
import classes from './ProblemPage.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios';

const ProblemPage = () => {
  const [problemList, setProblemList] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Function to fetch problems from the API
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`/problem_list`);
        setProblemList(response.data);
      } catch (error) {
        console.error("Error fetching problem list:", error);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    // Sort the problem list based on the rating when the sortOrder changes
    const sortedProblems = [...problemList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.rating - b.rating;
      } else {
        return b.rating - a.rating;
      }
    });
    setProblemList(sortedProblems);
  }, [sortOrder]); // Re-run the sorting logic when sortOrder or problemList changes

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAddProblem = () => {
    navigate('/add-problem'); // Navigate to the AddProblem page
  };

  return (
    <div className={classes.problemPage}>
      <div className={classes.sorting}>
        <label htmlFor="sortOrder">Sort by Rating:</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button className={classes.addProblemButton} onClick={handleAddProblem}>
          Add Problem
        </button>
      </div>
      
      {problemList.map((problem, serialNumber) => (
        <ProblemContainer
          problem={problem}
          serialNumber={serialNumber}
          key={problem.problem_id} // Using problem_id as key is better if it's unique
        />
      ))}
    </div>
  );
};

export default ProblemPage;
