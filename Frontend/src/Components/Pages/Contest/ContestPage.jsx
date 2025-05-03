import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Contest.module.css";
import useInterval from "./UseInterval";  // Adjust the path as needed

const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("/getcontestlist");
        const now = Date.now();
        const futureContests = response.data.filter(contest => contest.contest_start_time * 1000 + contest.contest_duration * 1000 > now);
        
        const sortedContests = futureContests.sort((a, b) => a.contest_start_time - b.contest_start_time);
  
        setContests(sortedContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
  
    fetchContests();
  }, []);

  useInterval(() => {
    setCurrentTime(Date.now());
  }, 1000);

  const formatTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    return `${minutes} minutes`;
  };

  const getCountdown = (startTime) => {
    const now = Date.now();
    const timeDiff = startTime * 1000 - now;
    
    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      let countdown = '';
      if (days > 0) countdown += `${days}d `;
      if (hours > 0 || days > 0) countdown += `${hours}h `;
      countdown += `${minutes}m ${seconds}s`;
      
      return countdown.trim();
    } else {
      return "Ongoing";
    }
  };
  const handleClick = (contest) => {
    const now = Date.now();
    const contestEndTime = Number(contest.contest_start_time) * 1000 + Number(contest.contest_duration) * 1000;
    if (contest.contest_start_time * 1000 <= now && now <= contestEndTime) {
      navigate("/contest-detail", { state: { contest } });
    } else {
      console.log("Contest is not ongoing.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Contests</h1>
      <div className={styles.contestGrid}>
        {contests &&
          contests.map((contest) => {
            const now = Date.now();
            const contestEndTime = contest.contest_start_time * 1000 + contest.contest_duration * 1000;
            const isOngoing = contest.contest_start_time * 1000 <= now && now <= contestEndTime;
            const isUpcoming = contest.contest_start_time * 1000 > now;

            return (
              <div 
                key={contest.contest_id} 
                className={`${styles.contestItem} ${isOngoing ? styles.ongoing : ''} ${isUpcoming ? styles.upcoming : ''}`}
                onClick={() => isOngoing && handleClick(contest)}
              >
                <h3 className={styles.contestName}>{contest.contest_name}</h3>
                <div className={styles.contestDetails}>
                  <p><span className={styles.label}>Start:</span> {formatTime(contest.contest_start_time)}</p>
                  <p>
                    <span className={styles.label}>
                      {isOngoing ? 'Remaining:' : isUpcoming ? 'Starts in:' : 'Duration:'}
                    </span>
                    {isOngoing || isUpcoming
                      ? getCountdown(isOngoing ? Number(contest.contest_start_time) + Number(contest.contest_duration) : contest.contest_start_time)
                      : formatDuration(contest.contest_duration)}
                  </p>
                </div>
                <div className={styles.status}>
                  {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Ended'}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ContestPage;