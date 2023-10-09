import React, { useEffect, useState } from "react";
import { useClub } from "../contexts/clubContext";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  TableContainer,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";

const LeaderboardTable = () => {
  const { getUserScoresByDate } = useClub();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const user = useUser();

  useEffect(() => {
    const club_id = user.userData.clubs_roles[0].club_id;
    getUserScoresByDate(club_id)
      .then((userScores) => {
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28); // Subtracting 28 days

        const summedScores = userScores.map((userScore) => {
          const fourWeekScores = userScore.scoresByDate.filter(
            (scoreByDate) => new Date(scoreByDate.date) >= fourWeeksAgo
          );

          const sum = fourWeekScores.reduce(
            (acc, curr) => acc + Number(curr.score),
            0
          );

          const winCount = fourWeekScores.filter(
            (scoreByDate) => scoreByDate.win === true
          ).length;

          return {
            name: userScore.name,
            score: sum,
            winCount: winCount, // Add win count
          };
        });

        // Sort users based on their scores in descending order and take top 5
        const sortedTop5Scores = summedScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setLeaderboardData(sortedTop5Scores);
      })
      .catch((error) => console.error(error));
  }, [user, getUserScoresByDate]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {leaderboardData.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">{row.winCount}</TableCell>
              {/* Display win count */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
