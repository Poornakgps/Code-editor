/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Resizable from 'react-resizable-layout';
import CodeEditor from '../CodeEditor/CodeEditor';
import Problem from './ProblemContainer/Problem';
import styles from './SolveProblem.module.css';
import axios from 'axios';

const YourSeparatorComponent = (props) => (
  <div
    {...props}
    className={styles.separator}
  />
);

const SolveProblem = () => {
  const { id } = useParams(); // Get the problem ID from the URL
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.post(`/problem_detail`,{problem_id:id}); // Replace with your API endpoint
        setProblem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loader component
  }

  if (!problem) {
    return <div>Problem not found.</div>;
  }

  return (
    <Resizable
      axis="x"
      style={{ overflowY: "hidden" }}
      initial={550}
      min={300}
      max={window.innerWidth - 300}
    >
      {({ position, separatorProps }) => {
        const rightWidth = `calc(100vw - ${position}px - 5px)`; // Adjust the calculation

        return (
          <div className={styles.wrapper}>
            <div
              className={styles.leftBlock}
              style={{ width: position }}
            >
              <Problem prob={problem} />
            </div>
            <YourSeparatorComponent {...separatorProps} />
            <div
              className={styles.rightBlock}
              style={{ width: rightWidth }}
            >
              <CodeEditor type="solveProblem" sampleInput={problem.input}/>
            </div>
          </div>
        );
      }}
    </Resizable>
  );
};

export default SolveProblem;
