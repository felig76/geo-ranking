import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div id="landingPageContainer">
      <div className="hero">
        <h1 className="mainTitle">GeoRanking 🌎</h1>
        <p className="subtitle">Test your geography skills</p>
        <Link to="/play" className="playButton">Daily Game</Link>
      </div>
    </div>
  );
}

export default LandingPage;