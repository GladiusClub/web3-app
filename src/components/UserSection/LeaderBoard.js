import React, { useEffect, useState } from "react";
import { useClub } from "../contexts/clubContext";
import { Avatar } from "@mui/material";
import { useUser } from "../contexts/UserContext";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

function Leaderboard() {
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // gold, silver, bronze
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
  //push
  return (
    <List>
      {leaderboardData.map((user, index) => (
        <ListItem
          key={index}
          style={{
            backgroundColor: index < 3 ? colors[index] : "transparent",
            borderRadius: "15px",
            marginBottom: "10px",
            padding: "10px",
            display: "flex", // Display items in a row
            justifyContent: "space-between", // Add space between items
            alignItems: "center", // Center items vertically
            height: "60px", // Set row height
            width: "300px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <ListItemAvatar>
              {user.avatar ? (
                <Avatar src={user.avatar} />
              ) : (
                <Avatar>{user.name[0]}</Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={`${user.score} pts.`}
            />
          </div>
          <div>{user.winCount}</div>
        </ListItem>
      ))}
    </List>
  );
}

export default Leaderboard;
