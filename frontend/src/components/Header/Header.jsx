import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { logoutUser } from '../../api/authApi.jsx'

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const onLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    navigate('/');
  };

  return (
    <header id="gamePageHeader">
      <h2 id="title"><Link to="/">GeoRanking 🌎</Link></h2>
      <div id="configButtons">
        <div className="headerConfigButton" id="languageSelect">
          <button title="Change language"></button>
        </div>
        <div className="headerConfigButton" id="colorSchemeSelect">
          <button title="Change theme"></button>
        </div>
        {!user ? (
          <div className="authActions">
            <Link className="authLink" to="/login">Login</Link>
            <Link className="authPrimary" to="/register">Register</Link>
          </div>
        ) : (
          <div className="authActions">
            <Link className="authUserLink" to="/user">{user.username} <span className="openIcon">↗</span></Link>
            <button className="authPrimary" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
