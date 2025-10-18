import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../api/authApi.jsx";

function LandingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const onLogout = async () => {
    try { await logoutUser(); } catch {}
    setUser(null);
    navigate("/");
  };

  return (
    <div id="landingPageContainer">
      <div className="hero">
        <h1 className="mainTitle">GeoRanking 🌎</h1>
        <p className="subtitle">Test your geography skills</p>
        <div className="ctaRow">
          <Link to="/play" className="playButton">Daily Game</Link>
          {!user ? (
            <div className="ctaAuth">
              <Link className="secondaryButton" to="/login">Login</Link>
              <Link className="primaryButton" to="/register">Register</Link>
            </div>
          ) : (
            <div className="ctaAuth">
              <Link className="welcomeLink" to="/user">Hello, {user.username} <span className="openIcon">↗</span></Link>
              <button className="primaryButton" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;