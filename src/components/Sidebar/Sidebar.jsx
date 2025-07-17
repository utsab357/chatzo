import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import netlifyIdentity from "netlify-identity-widget";

const Sidebar = () => {
  const [sidebarExtended, setSidebarExtended] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

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

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleLoginClick = () => {
    if (user) {
      netlifyIdentity.logout();
    } else {
      netlifyIdentity.open();
    }
  };

  return (
    <>
      {/* Hamburger icon for mobile */}
      <div
        className="sidebar-menu-icon"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? (
          <span
            style={{
              fontSize: "1.7rem", // reduced from 2rem
              color: "#333",
              lineHeight: 1,
              display: "block",
              width: "22px",
              height: "22px",
              textAlign: "center",
            }}
            aria-label="Close sidebar"
          >
            &times;
          </span>
        ) : (
          <img src={assets.menu_icon} alt="MenuIcon" />
        )}
      </div>

      {/* Overlay for closing sidebar on outside click */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className={`sidebar${mobileSidebarOpen ? " mobile-active" : ""}`}>
        <div className="top">
          <img
            className="menu"
            src={assets.menu_icon}
            alt="MenuIcon"
            onClick={() => setSidebarExtended((previous) => !previous)}
          />
          <div
            onClick={() => {
              newChat();
            }}
            className="new-chat"
          >
            <img src={assets.plus_icon} alt="" />
            {sidebarExtended ? <p>New Chat</p> : null}
          </div>
          {sidebarExtended ? (
            <div className="recent">
              <p className="recent-title">Chats..</p>
              {prevPrompts.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      loadPrompt(item);
                    }}
                    className="recent-entry"
                  >
                    <img src={assets.message_icon} alt="MessageIcon" />
                    <p>{item.slice(0, 18)}...</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="bottom">
          <div
            className="bottom-item recent-entry"
            onClick={() => setShowHistory((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <img src={assets.history_icon} alt="HistoryIcon" />
            {sidebarExtended ? <p>Activity</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="SettingIcon" />
            {sidebarExtended ? <p>Settings</p> : null}
          </div>
          
          {showHistory && (
            <div className="history-list">
              <p style={{ margin: "10px 0 5px 10px", fontWeight: "bold" }}>
                History
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {prevPrompts.length === 0 && (
                  <li
                    style={{
                      padding: "8px 16px",
                      color: "#888",
                    }}
                  >
                    No history yet.
                  </li>
                )}
                {prevPrompts.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "8px 16px",
                      cursor: "pointer",
                    }}
                    onClick={() => loadPrompt(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
