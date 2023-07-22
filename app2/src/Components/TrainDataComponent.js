import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainDataComponent = () => {
const login = async () => {
  const result = await axios.post("http://20.244.56.144/train/auth", {
  "companyName": "Train",
  "clientID": "4482aacb-b053-450f-ae5e-f27993578d55",
  "clientSecret": "WeqXXYMdxTRsqOTD",
  "ownerName": "Yash",
  "ownerEmail": "2000330100264@rkgit.edu.in",
  "rollNo": "264"
});

  console.log(result.data.access_token);

  localStorage.setItem("token", result.data.access_token);
};

useEffect(() => {
  login();
}, []);
const apiUrl = "http://20.244.56.144:80/train/trains";
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTAwMDgyNDYsImNvbXBhbnlOYW1lIjoiVHJhaW4iLCJjbGllbnRJRCI6IjQ0ODJhYWNiLWIwNTMtNDUwZi1hZTVlLWYyNzk5MzU3OGQ1NSIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIyNjQifQ.srnYTvgDkAbTws-4nb4xTna5R_drt9Un6y4vAmq2B-k";
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get(apiUrl, config)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message || "An error occurred while fetching data.");
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const customSort = (a, b) => {
    if (a.price.sleeper !== b.price.sleeper) {
      return a.price.sleeper - b.price.sleeper;
    }

    if (a.seatsAvailable.sleeper !== b.seatsAvailable.sleeper) {
      return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
    }

    const aDepartureTime = new Date(
      a.departureTime.Hours * 3600000 +
        a.departureTime.Minutes * 60000 +
        a.delayedBy * 60000
    );
    const bDepartureTime = new Date(
      b.departureTime.Hours * 3600000 +
        b.departureTime.Minutes * 60000 +
        b.delayedBy * 60000
    );
    return bDepartureTime - aDepartureTime;
  };
  const trainsArray = Object.values(data);
  console.log(data);
  trainsArray.sort(customSort);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Trains Schedule</h2>
      <ul>
        {data.map((train, index) => (
          <li key={index} className="my-4 border p-4">
            <h3 className="text-lg font-semibold">{train.trainName}</h3>
            <p>Train Number: {train.trainNumber}</p>
            <p>
              Departure Time: {train.departureTime.Hours}:
              {train.departureTime.Minutes}
            </p>
            <p>Sleeper Seats Available: {train.seatsAvailable.sleeper}</p>
            <p>AC Seats Available: {train.seatsAvailable.AC}</p>
            <p>Sleeper Price: {train.price.sleeper}</p>
            <p>AC Price: {train.price.AC}</p>
            <p>Delayed By: {train.delayedBy} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainDataComponent;
