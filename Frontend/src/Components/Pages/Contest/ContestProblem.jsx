import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./ContestDetail.module.css";
import { ProblemContainer } from "../ProblemContainer/ProblemContainer";

const ContestDetailPage = () => {
  const location = useLocation();
  const { contest } = location.state || {};
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isContestRunning, setIsContestRunning] = useState(false);

  const getCountdown = useCallback((endTime) => {
    const now = Date.now();
    const timeDiff = endTime - now;

    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      let countdown = "";
      if (days > 0) countdown += `${days}d `;
      if (hours > 0 || days > 0) countdown += `${hours}h `;
      countdown += `${minutes}m ${seconds}s`;

      return countdown.trim();
    } else {
      return "Contest has ended";
    }
  }, []);

  useEffect(() => {
    if (contest) {
      const contestStartTime = contest.contest_start_time * 1000;
      const contestEndTime = contestStartTime + contest.contest_duration * 1000;
      const now = Date.now();

      setIsContestRunning(now >= contestStartTime && now < contestEndTime);

      const updateTimer = () => {
        if (now < contestStartTime) {
          setTimeRemaining(`Starts in: ${getCountdown(contestStartTime)}`);
        } else if (now < contestEndTime) {
          setTimeRemaining(`Ends in: ${getCountdown(contestEndTime)}`);
        } else {
          setTimeRemaining("Contest has ended");
        }
      };

      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [contest, getCountdown]);

  useEffect(() => {
    if (contest && contest.contest_problem) {
      const fetchProblems = async () => {
        try {
          const response = await axios.post("/contestProblemList", {
            problems: contest.contest_problem,
          });
          setProblems(response.data);
        } catch (error) {
          console.error("Error fetching problems", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProblems();
    }
  }, [contest]);

  const formatTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (!contest) {
    return <p>No contest data available</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contWrap}>
        <h2 className={styles.subHeader}>{contest.contest_name}</h2>
        <div className={styles.contestDetails}>
          <p>Start Time: {formatTime(contest.contest_start_time)}</p>
          <p>Duration: {formatDuration(contest.contest_duration)}</p>
          <p>Contest ID: {contest.contest_id}</p>
          <div className={styles.tickingClock}>
            <p>{timeRemaining}</p>
          </div>
        </div>

        {loading ? (
          <p>Loading problems...</p>
        ) : (
          <table className={styles.problemTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problemList, index) => (
                <ProblemContainer
                  problem={problemList[0]}
                  serialNumber={index}
                  key={problemList[0].problem_id}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ContestDetailPage;
