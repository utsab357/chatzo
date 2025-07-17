import "./Main.css";
import { assets } from "../../assets/assets";
import { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import netlifyIdentity from "netlify-identity-widget";

const Main = () => {
  // destructuring the object of context
  const {
    input,
    setInput,
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
  } = useContext(Context);

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    netlifyIdentity.init();
    netlifyIdentity.on("login", (user) => {
      setUser(user);
      netlifyIdentity.close();
    });
    netlifyIdentity.on("logout", () => setUser(null));
    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, []);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = GLOBE({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x7f79ae,
        color2: 0x010410,
        backgroundColor: 0xcfdfe0,
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleLoginClick = () => {
    if (user) {
      netlifyIdentity.logout();
    } else {
      netlifyIdentity.open();
    }
  };

  return (
    <div
      ref={vantaRef}
      style={{
        minHeight: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        className="main"
        style={{
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <div className="nav">
          <p className="chatzo-font">Chatzo</p>
          <button className="login-btn" onClick={handleLoginClick}>
            {user ? user.email.charAt(0).toUpperCase() : "Login"}
          </button>
        </div>
        <div className="main-container">
          {!showResult ? (
            <>
              <div className="greet">
                <p>
                  <span>Hi,</span>
                </p>
                <p>How can I help you today?</p>
              </div>
              <div className="cards">
                <div
                  className="card"
                  onClick={() => {
                    setInput("Suggest beautiful places to see on upcoming road trip");
                    onSent("Suggest beautiful places to see on upcoming road trip");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <p>Suggest beautiful places to see on upcoming road trip</p>
                  <img src={assets.compass_icon} alt="CompassIcon" />
                </div>
                <div
                  className="card"
                  onClick={() => {
                    setInput("Give me a creative idea for a birthday party");
                    onSent("Give me a creative idea for a birthday party");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <p>Give me a creative idea for a birthday party</p>
                  <img src={assets.bulb_icon} alt="BulbIcon" />
                </div>
                <div
                  className="card"
                  onClick={() => {
                    setInput("Write a friendly message to a new neighbor");
                    onSent("Write a friendly message to a new neighbor");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <p>Write a friendly message to a new neighbor</p>
                  <img src={assets.message_icon} alt="MessageIcon" />
                </div>
                <div
                  className="card"
                  onClick={() => {
                    setInput("Show me some useful JavaScript code snippets");
                    onSent("Show me some useful JavaScript code snippets");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <p>Show me some useful JavaScript code snippets</p>
                  <img src={assets.code_icon} alt="CodeIcon" />
                </div>
              </div>
            </>
          ) : (
            <div className="result">
              <div className="result-title">
                <img src={assets.logo} alt="logo" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data blur-output">
                <img src={assets.logo} alt="logo" />
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                )}
              </div>
            </div>
          )}

          <div className="main-bottom">
            <div className="search-box">
              <input
                onChange={(event) => setInput(event.target.value)}
                value={input}
                type="text"
                placeholder="Ask me anything..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSent();
                  }
                }}
              />
              <div className="search-box-icon">
                {input ? (
                  <img
                    onClick={() => onSent()}
                    src={assets.send_icon}
                    alt="SendIcon"
                  />
                ) : null}
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
