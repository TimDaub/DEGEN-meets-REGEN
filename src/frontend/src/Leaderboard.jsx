import React, { useEffect, useState } from "react";

function Leaderboard({ fid }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const leaderboardUrl = `/profile/leaderboard/${fid}`;
        const leaderboardResponse = await fetch(leaderboardUrl);
        if (!leaderboardResponse.ok)
          throw new Error("Network response was not ok for leaderboard");
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboardData(leaderboardData);

        const statsUrl = `/profile/stats/${fid}`;
        const statsResponse = await fetch(statsUrl);
        if (!statsResponse.ok)
          throw new Error("Network response was not ok for stats");
        const statsData = await statsResponse.json();
        setStats([statsData]); // Assuming you want it in an array similar to leaderboardDat
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }

    fetchData();
  }, [fid]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100vw",
        }}
      >
        {stats.map(({ pfpUrl, displayName, likes, dislikes }, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem 1rem",
              boxSizing: "border-box",
            }}
          >
            <img
              src={pfpUrl}
              alt="Profile"
              style={{
                width: "2rem",
                height: "2rem",
                objectFit: "cover",
                marginRight: "1rem",
                borderRadius: "50%",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{displayName}</div>
              <div style={{ fontSize: "0.8rem" }}>
                {likes} 🎩 {dislikes} 🌱
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {leaderboardData.map(
          ({ pfpUrl, displayName, likes, dislikes }, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                width: "100%",
                padding: "0.5rem 1rem",
                boxSizing: "border-box",
              }}
            >
              <img
                src={pfpUrl}
                alt="Profile"
                style={{
                  width: "2rem",
                  height: "2rem",
                  objectFit: "cover",
                  marginRight: "1rem",
                  borderRadius: "50%",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{displayName}</div>
                <div style={{ fontSize: "0.8rem" }}>
                  {likes} 🎩 {dislikes} 🌱
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
