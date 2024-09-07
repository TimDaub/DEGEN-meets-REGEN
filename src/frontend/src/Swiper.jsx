import React, { useEffect, useState } from "react";
import { CardSwiper } from "react-card-swiper";
import ReactSvg from "./assets/react.svg";

const Content = (props) => (
  <>
    <h1>{props.displayName}</h1>
    <p>{props.bio}</p>
  </>
);

function App(props) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`/profile/random?fid=${props.fid}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const nextProfiles = data.map((elem) => ({
          id: `${elem.fid}`,
          meta: { apk: elem.pfpUrl },
          src: elem.pfpUrl,
          content: <Content displayName={elem.displayName} bio={elem.bio} />,
        }));
        setProfiles(nextProfiles);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfiles();
  }, []); // Add dependencies if needed

  console.log(profiles);
  if (profiles.length === 0) return;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "300px", height: "500px" }}>
        <CardSwiper data={profiles} emptyState={<div>Empty State</div>} />
      </div>
    </div>
  );
}

export default App;
