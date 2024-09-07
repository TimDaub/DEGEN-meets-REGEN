import "@farcaster/auth-kit/styles.css";
import { providers } from "ethers";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import { useEffect } from "react";

import Swiper from "./Swiper.jsx";

const config = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: "example.com",
  siweUri: "https://example.com/login",
  provider: new providers.JsonRpcProvider(undefined, 10),
};

function App() {
  const { isAuthenticated, profile } = useProfile();
  let { fid, displayName, custody, ...restProfile } = profile;

  if (localStorage.getItem("fid") && !isAuthenticated) {
    fid = localStorage.getItem("fid");
  }
  if (fid) {
    localStorage.setItem("fid", fid);
  }

  return (
    <main style={{ fontFamily: "Raleway" }}>
      {/* @ts-expect-error ethers version type incompat */}
      <AuthKitProvider config={config}>
        <div
          style={{
            position: "fixed",
            top: "12px",
            left: "12px",
            height: "46.5px",
            display: "flex",
            alignItems: "center",
            fontSize: "1.3rem",
            fontWeight: "bold",
            fontFamily: "Kavoon",
            width: "30wv",
          }}
        >
          🎩 meets 🌱
        </div>
        <div style={{ position: "fixed", top: "12px", right: "12px" }}>
          {!fid && !isAuthenticated && <SignInButton />}
        </div>
        <div
          style={{
            marginTop: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
          }}
        >
          <Profile />
        </div>
      </AuthKitProvider>
    </main>
  );
}

function Profile() {
  const { isAuthenticated, profile } = useProfile();
  let { fid, displayName, custody, ...restProfile } = profile;

  if (localStorage.getItem("fid") && !isAuthenticated) {
    fid = localStorage.getItem("fid");
  }
  if (fid) {
    localStorage.setItem("fid", fid);
  }

  useEffect(() => {
    const sendProfileToAPI = async () => {
      try {
        const response = await fetch("/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fid, displayName, custody, ...restProfile }),
        });
        const data = await response.json();
        console.log("Profile saved:", data);
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    };

    if (isAuthenticated) {
      sendProfileToAPI();
    }
  }, [isAuthenticated, fid, displayName, custody, restProfile]);

  return (
    <>
      {isAuthenticated || fid ? (
        <Swiper fid={fid} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 1rem",
          }}
        >
          <p>
            <span style={{ fontSize: "3rem", fontFamily: "Kavoon" }}>
              🎩 DEGEN meets REGEN 🌱?{" "}
            </span>
            <br />
            <p style={{ fontSize: "2rem" }}>How do Farcasters perceive you?</p>
            Click the "Sign in with Farcaster" button above, then scan the QR
            code to sign in.
          </p>
        </div>
      )}
    </>
  );
}

export default App;
