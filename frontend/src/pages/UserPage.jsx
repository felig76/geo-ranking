import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import UserStatsChart from "../components/UserStatsChart.jsx";
import "./UserPage.css";
import Header from "../components/Header/Header.jsx";

export default function UserPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Header />
        <div className="userPageContainer">
          <div className="card">
            <h2>Sign in required</h2>
            <p>Please login to view your profile and stats.</p>
          </div>
        </div>
      </>
    );
  }

  const stats = user.stats || {};
  const plays = Array.isArray(stats.dailyPlays) ? stats.dailyPlays : [];

  const summary = useMemo(() => ({
    gamesPlayed: stats.gamesPlayed || 0,
    highestScore: stats.highestScore || 0,
    averageScore: Math.round((stats.averageScore || 0) * 100) / 100,
    currentStreak: stats.currentStreak || 0,
    longestStreak: stats.longestStreak || 0,
  }), [stats]);

  return (
    <>
      <Header />
      <div className="userPageContainer">
      <header className="userHeader">
        <div className="userIdentity">
          <div className="avatarPlaceholder" aria-hidden>
            {user.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="identityText">
            <h1>{user.username}</h1>
            <p className="muted">{user.email}</p>
          </div>
        </div>
        <div className="headerActions">
          <button className="actionButton" title="Edit profile">Edit</button>
          <button className="actionButton" title="Settings">Settings</button>
          <button className="dangerButton" title="Delete account">Delete</button>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h3>Overview</h3>
          <div className="statsGrid">
            <div className="statItem"><span className="label">Games Played</span><span className="value">{summary.gamesPlayed}</span></div>
            <div className="statItem"><span className="label">Highest Score</span><span className="value">{summary.highestScore}</span></div>
            <div className="statItem"><span className="label">Average Score</span><span className="value">{summary.averageScore}</span></div>
            <div className="statItem"><span className="label">Current Streak</span><span className="value">{summary.currentStreak}</span></div>
            <div className="statItem"><span className="label">Longest Streak</span><span className="value">{summary.longestStreak}</span></div>
          </div>
        </div>
        <div className="card">
          <h3>Daily Plays</h3>
          <UserStatsChart plays={plays} />
        </div>
      </section>
      </div>
    </>
  );
}
