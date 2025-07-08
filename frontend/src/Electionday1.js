import React from "react";
import { Chart } from "react-google-charts";
import "./Electionday1.css";

const data = [
  ["Voting Method", "Percentage"],
  ["Voted early in person", 53.1],
  ["Voted on Election Day", 40.7],
  ["Voted by mail", 6.2],
];

const options = {
  title: "Voter Participation by Method",
  is3D: true,
  pieSliceText: "none", // we will use custom labels outside
  slices: {
    0: { color: "#28a745" }, // green
    1: { color: "#dc3545" }, // red
    2: { color: "#17a2b8" }, // blue
  },
  legend: "none",
  pieStartAngle: 45,
};

export default function Electionday1() {
  return (
    <div className="chart-container">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"400px"}
        height={"350px"}
      />

      {/* Custom labels */}
      <div className="labels-container">
        <div className="label green-label">
          <span className="percent">53.1%</span>
          <br />
          Voted early in person
        </div>
        <div className="label red-label">
          <span className="percent">40.7%</span>
          <br />
          Voted on Election Day
        </div>
        <div className="label blue-label">
          <span className="percent">6.2%</span>
          <br />
          Voted by mail
        </div>
      </div>
    </div>
  );
}
