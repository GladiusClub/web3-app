import React, { useEffect, useState } from "react";
import { useClub } from "../contexts/clubContext";
import { Avatar, Box, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  TableContainer,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";
import { styled } from "@mui/material/styles";

const LeaderboardTable = () => {
  const { getUserScoresByDate } = useClub();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const user = useUser();

  useEffect(() => {
    if (!user.userData.clubs_roles || user.userData.clubs_roles.length === 0) {
      return;
    }

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

  // ... (rest of your imports and other code)

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1, 2), // Adjust padding as needed
    borderBottom: "none",
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:not(:last-child)": {
      marginBottom: theme.spacing(1), // This creates space between rows
    },
    borderRadius: theme.spacing(2), // This makes the ends rounded
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  }));

  // in your component

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {leaderboardData.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell>
                <Box display="flex" alignItems="center">
                  <Avatar>
                    {/* You can put user image or default icon here */}
                  </Avatar>
                  <Typography style={{ marginLeft: 10 }}>{row.name}</Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="right">{row.score} pts.</StyledTableCell>
              <StyledTableCell align="right">
                {row.winCount} wins
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
