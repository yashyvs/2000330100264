import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";


const TrainDataComponent = () => {
  const apiUrl = "http://20.244.56.144:80/train/trains";
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const login = async () => {
    try {
      const result = await axios.post("http://20.244.56.144/train/auth", {
        companyName: "Train",
        clientID: "4482aacb-b053-450f-ae5e-f27993578d55",
        clientSecret: "WeqXXYMdxTRsqOTD",
        ownerName: "Yash",
        ownerEmail: "2000330100264@rkgit.edu.in",
        rollNo: "264",
      });

      localStorage.setItem("token", result.data.access_token);
    } catch (error) {
      console.error("Error during login:", error.message);
      setError(error.message || "An error occurred during login.");
    }
  };

  const fetchTrains = async () => {
    const token = "Bearer " + localStorage.getItem("token");

    try {
      const result = await axios.get(apiUrl, {
        headers: {
          Authorization: token,
        },
      });
      console.log("Fetched data:", result.data);

      setData(result.data);
    } catch (error) {
      setError(error.message || "An error occurred while fetching data.");
    }
  };

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

  useEffect(() => {
    login();
      fetchTrains();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedData = [...data].sort(customSort);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">All Trains Schedule</h2>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedData.map((train, index) => (
          <li
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-gray-800"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">
              {train.trainName}
            </h3>
            <p className="text-sm text-gray-600">
              Train Number: {train.trainNumber}
            </p>
            <p className="text-sm text-green-600">
              Departure Time: {train.departureTime.Hours}:
              {train.departureTime.Minutes}
            </p>
            <p className="text-sm text-blue-600">
              Sleeper Seats Available: {train.seatsAvailable.sleeper}
            </p>
            <p className="text-sm text-red-600">
              AC Seats Available: {train.seatsAvailable.AC}
            </p>
            <p className="text-sm text-yellow-600">
              Sleeper Price: {train.price.sleeper}
            </p>
            <p className="text-sm text-purple-600">
              AC Price: {train.price.AC}
            </p>
            <p className="text-sm text-gray-700">
              Delayed By: {train.delayedBy} minutes
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainDataComponent;
