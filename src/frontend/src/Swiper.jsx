import React, { useEffect, useState } from "react";
import { CardSwiper } from "react-card-swiper";
import ReactSvg from "./assets/react.svg";
import Leaderboard from "./Leaderboard.jsx";

const Content = (props) => (
  <div style={{ padding: "0 1rem", color: "black" }}>
    <a target="_blank" href={`https://warpcast.com/${props.username}`}>
      <h1 style={{ fontSize: "1.6rem", textDecoration: "underline" }}>
        {props.displayName}
      </h1>
    </a>
    <p>{props.bio}</p>
  </div>
);

function App(props) {
  const [profiles, setProfiles] = useState([]);
  const [swipped, setSwipped] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleDismiss = async (el, meta, id, action, operation) => {
    setSwipped(swipped + 1);

    const match = action === "like";
    //const matcherFid = props.fid; // The matcher's fid
    const matcherFid = parseInt(props.fid, 10);
    const matcheeFid = id; // The matchee's fid

    try {
      const response = await fetch("/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matcherFid: matcherFid,
          matcheeFid: matcheeFid,
          match: match,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post match");
      }

      const responseData = await response.json();
      console.log("Match response:", responseData);
    } catch (error) {
      console.error("Error posting match:", error);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`/profile/random?fid=${props.fid}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const nextProfiles = data.map((elem) => ({
          id: elem.fid,
          meta: { apk: elem.pfpUrl },
          src: elem.pfpUrl,
          content: (
            <Content
              username={elem.username}
              displayName={elem.displayName}
              bio={elem.bio}
            />
          ),
        }));
        setProfiles(nextProfiles);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []); // Add dependencies if needed

  if (loading) {
    return <p>Loading...</p>;
  }
  if (profiles.length === 0) {
    document.querySelector("body").style =
      "font-family: 'Raleway', sans-serif; width: 100%;";
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ alignSelf: "start", marginLeft: "1rem" }}>Leaderboard</h1>
        <p style={{ margin: "0 1rem" }}>
          {" "}
          No more people to rank! Invite your friends on Warpcast! It might take
          a while for others to rate. See your updated stats later
        </p>
        <a
          target="_blank"
          href="https://warpcast.com/~/compose?text=Think%20I%27m%20more%20of%20a%20degen%20or%20a%20regen%3F%20%0AClick%20the%20link%20below%20to%20rate%20me%20and%20other%20Farcaster%20users%20in%20%E2%80%98Degen%20or%20Regen%E2%80%99.%20&embeds[]=https://degenmeetsregen.com"
        >
          <button
            style={{
              color: "white",
              padding: "5px 10px",
              backgroundColor: "#472a91",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Share on Warpcast
          </button>
        </a>
        <Leaderboard fid={props.fid} />
      </div>
    );
  }
  const likeButton = (
    <button style={{ fontSize: "1rem", backgroundColor: "#4B0082" }}>🎩</button>
  );
  const dislikeButton = (
    <button style={{ fontSize: "1rem", backgroundColor: "#228B22" }}>🌱</button>
  );
  document.querySelector("body").style =
    "font-family: 'Raleway', sans-serif; width: 100%; height: 100%; overflow: hidden;";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "1rem",
      }}
    >
      <div style={{ width: "300px", height: "500px" }}>
        <CardSwiper
          likeButton={likeButton}
          dislikeButton={dislikeButton}
          withActionButtons={true}
          likeRibbonText="DEGEN!"
          dislikeRibbonText="REGEN!"
          onDismiss={handleDismiss}
          onFinish={() => setProfiles([])}
          data={profiles}
          emptyState={<Leaderboard fid={props.fid} />}
        />
      </div>
      <p style={{ textAlign: "center", fontSize: "0.7rem" }}>
        It works like Tinder. <br />
        Swipe RIGHT to say they are DEGEN, LEFT to say they are REGEN. <br />{" "}
        You have to swipe {profiles.length - swipped} times more to see your
        stats
      </p>
    </div>
  );
}

export default App;
