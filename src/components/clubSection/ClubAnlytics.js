import React, { useEffect, useState } from "react";
import { useClub } from "../contexts/clubContext";
import { useUser } from "../contexts/UserContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend, 
  ReferenceLine
} from "recharts";

const CustomLineChart = () => {
  const { getUserScoresByDate } = useClub();
  const [chartData, setChartData] = useState([]);
  const user = useUser();
  const club_id = user.userData.clubs_roles[0].club_id;

  console.log(chartData);

  useEffect(() => {
    getUserScoresByDate(club_id)
      .then((userScores) => {
        // Create an object to hold running totals for each user
        const userTotals = userScores.reduce(
          (acc, userScore) => ({
            ...acc,
            [userScore.name]: 0,
          }),
          {}
        );

        // Transform the user scores into the format required by the chart
        let transformedData = userScores.reduce((acc, userScore) => {
          // Sort userScore.scoresByDate by date
          const sortedScoresByDate = userScore.scoresByDate.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
          );

          sortedScoresByDate.forEach((scoreByDate) => {
            // Update the running total for the user
            userTotals[userScore.name] += Number(scoreByDate.score);

            const existingDataPoint = acc.find(
              (dataPoint) => dataPoint.date === scoreByDate.date
            );

            if (existingDataPoint) {
              existingDataPoint[userScore.name] = userTotals[userScore.name];
            } else {
              acc.push({
                date: scoreByDate.date,
                [userScore.name]: userTotals[userScore.name],
              });
            }
          });

          return acc;
        }, []);

        // Sort the transformedData array by date
        transformedData = transformedData.sort(
          (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );

        setChartData(transformedData);
      })
      .catch((error) => console.error(error));
  }, [getUserScoresByDate, club_id]);
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#FF8042", "#00C49F"]; // Add more colors if you have more users

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={640} height={480} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Legend />

        {/* Render a Line for each user */}
        {chartData.length > 0 &&
          Object.keys(chartData[0])
            .filter((key) => key !== "date")
            .map((user, index) => (
              <Line
                key={user}
                type="monotone"
                dataKey={user}
                stroke={colors[index % colors.length]} // use modulus operator to avoid out of bounds error
                dot={false} // removes line markers
                connectNulls={true}
              />
            ))}
            <ReferenceLine y={10} stroke="red" label="Level 1" position="left" strokeDasharray="3 3"  />
      </LineChart>
    </div>
  );
};

export default CustomLineChart;
