/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import classes from "./ProblemPage.module.css";

export const ProblemContainer = ({ problem, serialNumber }) => {
  const { title, rating, problem_id } = problem; // Assuming 'id' is part of the problem object
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/solveproblem/${problem_id}`);
  };

  return (
    <div className={classes.problemContainer} onClick={handleClick}>
      <span className={classes.serialNumber}>#{serialNumber + 1}</span>
      <h2 className={classes.title}>{title}</h2>
      <div className={classes.metaInfo}>
        <span className={classes.rating}>Rating: {rating}</span>
      </div>
    </div>
  );
};
